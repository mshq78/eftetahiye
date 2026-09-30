import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { EventConfig, SavedEvent } from './types';
import { defaultEventConfig } from './event.config';
import { generateActiveSlides } from './utils/helpers';
import { applyThemeVariables } from './utils/theme';
import {
  loadCurrentConfig,
  saveCurrentConfig,
  getSavedEvents,
  saveEventToLibrary,
  deleteEventFromLibrary,
  getActiveEventId,
  setActiveEventId,
  exportConfigAsJSON,
  importConfigFromJSON,
  syncEventTeamWithMaster,
} from './utils/storage';
import { DeckFrame } from './components/deck/DeckFrame';
import { SlideRenderer } from './components/slides/SlideRenderer';
import { NavigationControls } from './components/deck/NavigationControls';
import { OverviewModal } from './components/deck/OverviewModal';
import { EditorDrawer } from './components/editor/EditorDrawer';
import { PrintView } from './components/deck/PrintView';

export default function App() {
  // 1. Central Event Configuration State
  const [config, setConfig] = useState<EventConfig>(() => loadCurrentConfig());

  // 2. Saved Events Library
  const [savedEvents, setSavedEvents] = useState<SavedEvent[]>(() => getSavedEvents());
  const [activeEventId, setActiveIdState] = useState<string | null>(() => getActiveEventId());

  // 3. UI States
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 4. Generate Active Slides based on modules and item counts
  const slides = useMemo(() => {
    return generateActiveSlides(config);
  }, [config]);

  // Clamp currentSlideIndex if slides array shrank
  useEffect(() => {
    if (currentSlideIndex >= slides.length) {
      setCurrentSlideIndex(Math.max(0, slides.length - 1));
    }
  }, [slides.length, currentSlideIndex]);

  // Apply Theme CSS Variables when primaryHue changes
  useEffect(() => {
    applyThemeVariables(config.theme.primaryHue);
  }, [config.theme.primaryHue]);

  // Auto-save current configuration
  const handleConfigChange = useCallback((newConfig: EventConfig) => {
    setConfig(newConfig);
    saveCurrentConfig(newConfig);
  }, []);

  // Navigation Handlers with direction tracking
  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentSlideIndex((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const handleGoToFirst = useCallback(() => {
    setDirection(-1);
    setCurrentSlideIndex(0);
  }, []);

  const handleGoToLast = useCallback(() => {
    setDirection(1);
    setCurrentSlideIndex(slides.length - 1);
  }, [slides.length]);

  // Toggle Fullscreen Handler
  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Fullscreen request failed:', err);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => {
          console.warn('Exit fullscreen failed:', err);
        });
      }
      setIsFullscreen(false);
    }
  }, []);

  // Sync fullscreen state with document change
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger presentation shortcuts if user is typing in input or textarea
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      ) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
        case ' ':
        case 'PageDown':
          e.preventDefault();
          handleNext();
          break;
        case 'ArrowRight':
        case 'PageUp':
          e.preventDefault();
          handlePrev();
          break;
        case 'Home':
          e.preventDefault();
          handleGoToFirst();
          break;
        case 'End':
          e.preventDefault();
          handleGoToLast();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          handleToggleFullscreen();
          break;
        case 'g':
        case 'G':
          e.preventDefault();
          setIsOverviewOpen((prev) => !prev);
          break;
        case 'e':
        case 'E':
          // In fullscreen mode, keep editor hidden as specified in prompt
          if (!document.fullscreenElement) {
            e.preventDefault();
            setIsEditorOpen((prev) => !prev);
          }
          break;
        case 'Escape':
          if (isOverviewOpen) {
            setIsOverviewOpen(false);
          } else if (isEditorOpen) {
            setIsEditorOpen(false);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleNext,
    handlePrev,
    handleGoToFirst,
    handleGoToLast,
    handleToggleFullscreen,
    isOverviewOpen,
    isEditorOpen,
  ]);

  // Event Management Handlers
  const handleSaveCurrentEvent = (name: string) => {
    const newEvent: SavedEvent = {
      id: `evt-${Date.now()}`,
      name,
      updatedAt: Date.now(),
      config,
    };
    saveEventToLibrary(newEvent);
    setActiveIdState(newEvent.id);
    setActiveEventId(newEvent.id);
    setSavedEvents(getSavedEvents());
  };

  const handleDuplicateEvent = (name: string) => {
    const duplicated: SavedEvent = {
      id: `evt-${Date.now()}`,
      name,
      updatedAt: Date.now(),
      config: JSON.parse(JSON.stringify(config)),
    };
    saveEventToLibrary(duplicated);
    setActiveIdState(duplicated.id);
    setActiveEventId(duplicated.id);
    setSavedEvents(getSavedEvents());
  };

  const handleSwitchEvent = (evt: SavedEvent) => {
    const syncedTeam = syncEventTeamWithMaster(evt.config.team);
    const fullConfig: EventConfig = { ...evt.config, team: syncedTeam };
    setConfig(fullConfig);
    saveCurrentConfig(fullConfig);
    setActiveIdState(evt.id);
    setActiveEventId(evt.id);
    setCurrentSlideIndex(0);
  };

  const handleDeleteEvent = (id: string) => {
    const updated = deleteEventFromLibrary(id);
    setSavedEvents(updated);
    if (activeEventId === id) {
      if (updated.length > 0) {
        handleSwitchEvent(updated[0]);
      } else {
        setActiveIdState(null);
      }
    }
  };

  const handleResetToDefault = () => {
    setConfig(defaultEventConfig);
    saveCurrentConfig(defaultEventConfig);
    setCurrentSlideIndex(0);
  };

  const handleExportJSON = () => {
    const brandName = config.brand.name || 'bootcamp';
    exportConfigAsJSON(config, `${brandName}-event-config.json`);
  };

  const handleImportJSON = async (file: File) => {
    try {
      const imported = await importConfigFromJSON(file);
      setConfig(imported);
      saveCurrentConfig(imported);
      setCurrentSlideIndex(0);
    } catch (err: unknown) {
      alert((err as Error).message || 'خطا در بارگذاری فایل JSON');
    }
  };

  const currentSlide = slides[currentSlideIndex] || slides[0];

  return (
    <main className="w-screen h-screen overflow-hidden bg-neutral-950 font-sans">
      {/* 1. Presentation Deck 16:9 Canvas Frame */}
      <DeckFrame
        onNext={handleNext}
        onPrev={handlePrev}
        isEditorOpen={isEditorOpen}
      >
        <AnimatePresence mode="wait" initial={false}>
          {currentSlide && (
            <motion.div
              key={currentSlide.id}
              initial={{
                opacity: 0,
                x: direction > 0 ? -180 : 180,
                scale: 0.94,
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                x: direction > 0 ? 180 : -180,
                scale: 0.94,
              }}
              transition={{
                duration: 0.42,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-full h-full"
            >
              <SlideRenderer
                slide={currentSlide}
                config={config}
                slideNumber={currentSlideIndex + 1}
                totalSlides={slides.length}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </DeckFrame>

      {/* 2. Floating Navigation Controls Toolbar */}
      <NavigationControls
        currentIndex={currentSlideIndex}
        totalSlides={slides.length}
        onNext={handleNext}
        onPrev={handlePrev}
        onToggleOverview={() => setIsOverviewOpen(true)}
        onToggleEditor={() => setIsEditorOpen((prev) => !prev)}
        isEditorOpen={isEditorOpen}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* 3. Slide Overview Grid Modal (G key) */}
      <OverviewModal
        isOpen={isOverviewOpen}
        onClose={() => setIsOverviewOpen(false)}
        slides={slides}
        currentIndex={currentSlideIndex}
        onSelectSlide={(idx) => setCurrentSlideIndex(idx)}
      />

      {/* 4. Event Editor Right Drawer (E key or gear button) */}
      <EditorDrawer
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        config={config}
        onChangeConfig={handleConfigChange}
        savedEvents={savedEvents}
        activeEventId={activeEventId}
        onSaveCurrentEvent={handleSaveCurrentEvent}
        onDuplicateEvent={handleDuplicateEvent}
        onSwitchEvent={handleSwitchEvent}
        onDeleteEvent={handleDeleteEvent}
        onResetToDefault={handleResetToDefault}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
      />

      {/* 5. Print-Only View for Clean 16:9 PDF Export */}
      <PrintView slides={slides} config={config} />
    </main>
  );
}
