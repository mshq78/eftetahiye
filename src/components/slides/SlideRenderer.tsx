import React from 'react';
import { EventConfig, SlideItem, ScheduleItem, TeamMember } from '../../types';
import { CoverSlide } from './CoverSlide';
import { IntroSlide } from './IntroSlide';
import { ImpactSlide } from './ImpactSlide';
import { WhyWeAreHereSlide } from './WhyWeAreHereSlide';
import { PrinciplesSlide } from './PrinciplesSlide';
import { ScheduleSlide } from './ScheduleSlide';
import { LunchSlide } from './LunchSlide';
import { WorkshopSlide } from './WorkshopSlide';
import { CafeSlide } from './CafeSlide';
import { TeamSlide } from './TeamSlide';

interface SlideRendererProps {
  slide: SlideItem;
  config: EventConfig;
  slideNumber: number;
  totalSlides: number;
}

export const SlideRenderer: React.FC<SlideRendererProps> = ({
  slide,
  config,
  slideNumber,
  totalSlides,
}) => {
  switch (slide.type) {
    case 'cover':
      return <CoverSlide config={config} slideNumber={slideNumber} totalSlides={totalSlides} />;
    case 'intro':
      return <IntroSlide config={config} slideNumber={slideNumber} totalSlides={totalSlides} />;
    case 'impact':
      return <ImpactSlide config={config} slideNumber={slideNumber} totalSlides={totalSlides} />;
    case 'whyWeAreHere':
      return <WhyWeAreHereSlide config={config} slideNumber={slideNumber} totalSlides={totalSlides} />;
    case 'principles':
      return <PrinciplesSlide config={config} slideNumber={slideNumber} totalSlides={totalSlides} />;
    case 'schedule':
      return (
        <ScheduleSlide
          config={config}
          slideNumber={slideNumber}
          totalSlides={totalSlides}
          itemsSubset={slide.itemsSubset as ScheduleItem[] | undefined}
          part={slide.part}
          totalParts={slide.totalParts}
        />
      );
    case 'lunch':
      return <LunchSlide config={config} slideNumber={slideNumber} totalSlides={totalSlides} />;
    case 'workshop':
      return <WorkshopSlide config={config} slideNumber={slideNumber} totalSlides={totalSlides} />;
    case 'cafe':
      return <CafeSlide config={config} slideNumber={slideNumber} totalSlides={totalSlides} />;
    case 'team':
      return (
        <TeamSlide
          config={config}
          slideNumber={slideNumber}
          totalSlides={totalSlides}
          itemsSubset={slide.itemsSubset as TeamMember[] | undefined}
          part={slide.part}
          totalParts={slide.totalParts}
        />
      );
    default:
      return (
        <div className="w-[1920px] h-[1080px] bg-neutral-900 text-white flex items-center justify-center text-3xl font-bold">
          اسلاید نامشخص
        </div>
      );
  }
};
