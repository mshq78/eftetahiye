import React from 'react';
import { EventConfig, SlideItem } from '../../types';
import { SlideRenderer } from '../slides/SlideRenderer';

interface PrintViewProps {
  slides: SlideItem[];
  config: EventConfig;
}

export const PrintView: React.FC<PrintViewProps> = ({ slides, config }) => {
  return (
    <div className="print-only">
      {slides.map((slide, index) => (
        <div key={`print-${slide.id}-${index}`} className="print-slide-page">
          <SlideRenderer
            slide={slide}
            config={config}
            slideNumber={index + 1}
            totalSlides={slides.length}
          />
        </div>
      ))}
    </div>
  );
};
