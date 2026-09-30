/**
 * Data structures and types for the Corporate Bootcamp Slide Deck
 */

export interface LogoItem {
  id: string;
  name: string;
  imageDataUrl?: string;
  pinned?: boolean;
}

export interface ScheduleItem {
  id: string;
  title: string;
  time?: string; // Optional time (e.g. "08:30" or empty)
  description?: string;
  icon?: string; // Lucide icon key
}

export interface TeamMember {
  id: string;
  name: string;
  role?: string;
  photoDataUrl?: string;
  present?: boolean; // True if attending this specific event, false if absent (defaults to true)
}

export interface PrincipleItem {
  id: string;
  title: string;
  description?: string;
  size?: 'large' | 'medium' | 'small';
}

export interface OrganizerConfig {
  name: string; // e.g. "پردیس نوآوری گرا"
  label?: string; // e.g. "برگزارکننده"
  subtitle?: string; // e.g. "توسعه سرمایه انسانی و نوآوری سازمانی"
  showOnCover?: boolean;
  showInFooter?: boolean;
  showInHeader?: boolean;
}

export interface EventConfig {
  brand: {
    name: string;
    prefix: string;
    subtitle: string;
    showBismillah: boolean;
  };
  organizer: OrganizerConfig;
  intro: string;
  venue: string;
  clientOrg: {
    name: string;
  };
  logos: LogoItem[];
  linkedin: string;
  modules: {
    whyWeAreHere: boolean;
    principles: boolean;
    lunch: boolean;
    workshop: boolean;
    cafe: boolean;
    team: boolean;
  };
  principlesList: PrincipleItem[];
  schedule: ScheduleItem[];
  workshop: {
    topic?: string;
  };
  lunch: {
    title: string;
    description: string;
    note: string;
  };
  team: TeamMember[];
  sectionTitles: {
    team: string;
    schedule?: string;
    principles?: string;
  };
  theme: {
    primaryHue: number; // 0 to 360
  };
}

export interface SavedEvent {
  id: string;
  name: string;
  updatedAt: number;
  config: EventConfig;
}

export type SlideType =
  | 'cover'
  | 'intro'
  | 'impact'
  | 'whyWeAreHere'
  | 'principles'
  | 'schedule'
  | 'lunch'
  | 'workshop'
  | 'cafe'
  | 'team';

export interface SlideItem {
  id: string;
  type: SlideType;
  title: string;
  isDark: boolean;
  moduleKey?: keyof EventConfig['modules'];
  part?: number;
  totalParts?: number;
  itemsSubset?: unknown[];
}
