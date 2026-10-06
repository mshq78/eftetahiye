import { EventConfig, SavedEvent, TeamMember } from '../types';
import { defaultEventConfig } from '../event.config';
import { queueRemoteSave } from './remote';

const STORAGE_KEY_CURRENT = 'bootcamp_deck_current_config';
const STORAGE_KEY_SAVED_LIST = 'bootcamp_deck_saved_events';
const STORAGE_KEY_ACTIVE_ID = 'bootcamp_deck_active_id';
const STORAGE_KEY_MASTER_TEAM = 'bootcamp_deck_master_team_roster';

export const SYNCED_STORAGE_KEYS = [
  STORAGE_KEY_CURRENT,
  STORAGE_KEY_SAVED_LIST,
  STORAGE_KEY_ACTIVE_ID,
  STORAGE_KEY_MASTER_TEAM,
];

/** Write to localStorage (throws on quota) and queue the same value for the server. */
function persist(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
  queueRemoteSave(key, value);
}

/**
 * Get master team roster containing all registered members across events
 */
export function getMasterTeamRoster(): TeamMember[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MASTER_TEAM);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        return list;
      }
    }
  } catch (err) {
    console.warn('Failed to load master team roster from localStorage:', err);
  }
  // Initialize with default members if empty
  const initial = defaultEventConfig.team || [];
  try {
    localStorage.setItem(STORAGE_KEY_MASTER_TEAM, JSON.stringify(initial));
  } catch {
    // ignore
  }
  return initial;
}

/**
 * Save master team roster
 */
export function saveMasterTeamRoster(members: TeamMember[], syncRemote = true) {
  try {
    if (syncRemote) persist(STORAGE_KEY_MASTER_TEAM, members);
    else localStorage.setItem(STORAGE_KEY_MASTER_TEAM, JSON.stringify(members));
  } catch (err) {
    console.error('Failed to save master team roster to localStorage:', err);
  }
}

/**
 * Permanently remove members from the master roster (used when a member is
 * deleted in the editor, so that they do not reappear as "absent" later).
 */
export function removeFromMasterTeamRoster(ids: string[]) {
  if (ids.length === 0) return;
  const removed = new Set(ids);
  saveMasterTeamRoster(getMasterTeamRoster().filter((m) => !removed.has(m.id)));
}

/**
 * Sync event team with master roster: merges any members from the master roster
 * into the event's team list, preserving the presence flags of existing members,
 * and adding any new master members as non-present by default.
 */
export function syncEventTeamWithMaster(eventTeam: TeamMember[] = []): TeamMember[] {
  const master = getMasterTeamRoster();
  const resultMap = new Map<string, TeamMember>();

  // First, add all master members as inactive by default
  master.forEach((m) => {
    resultMap.set(m.id, { ...m, present: false });
  });

  // Then, apply the event's specific configurations and presence
  eventTeam.forEach((m) => {
    const existing = resultMap.get(m.id);
    resultMap.set(m.id, {
      ...existing,
      ...m,
      present: m.present !== false, // default true if not explicitly false
    });
  });

  return Array.from(resultMap.values());
}

/**
 * Load currently active configuration
 */
export function loadCurrentConfig(): EventConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CURRENT);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return defaultEventConfig;
      }
      // Ensure team members have present flag set, and sync with master roster
      const rawTeam: TeamMember[] = Array.isArray(parsed.team) ? parsed.team : defaultEventConfig.team;
      const teamWithPresence = syncEventTeamWithMaster(rawTeam);

      // Update master roster with loaded members
      const master = getMasterTeamRoster();
      const masterMap = new Map(master.map((m) => [m.id, m]));
      teamWithPresence.forEach((m) => {
        masterMap.set(m.id, {
          id: m.id,
          name: m.name,
          role: m.role,
          photoDataUrl: m.photoDataUrl,
        });
      });
      // Local-only: merely loading must not trigger a server write (and a password prompt)
      saveMasterTeamRoster(Array.from(masterMap.values()), false);

      // Merge with default to guarantee all new schema fields exist
      return {
        ...defaultEventConfig,
        ...parsed,
        team: teamWithPresence,
        brand: { ...defaultEventConfig.brand, ...(parsed.brand || {}) },
        organizer: { ...defaultEventConfig.organizer, ...(parsed.organizer || {}) },
        clientOrg: { ...defaultEventConfig.clientOrg, ...(parsed.clientOrg || {}) },
        modules: { ...defaultEventConfig.modules, ...(parsed.modules || {}) },
        workshop: { ...defaultEventConfig.workshop, ...(parsed.workshop || {}) },
        lunch: { ...defaultEventConfig.lunch, ...(parsed.lunch || {}) },
        sectionTitles: { ...defaultEventConfig.sectionTitles, ...(parsed.sectionTitles || {}) },
        theme: { ...defaultEventConfig.theme, ...(parsed.theme || {}) },
      };
    }
  } catch (err) {
    console.warn('Failed to load current config from localStorage:', err);
  }
  return defaultEventConfig;
}

/**
 * Save current configuration
 */
export function saveCurrentConfig(config: EventConfig) {
  try {
    persist(STORAGE_KEY_CURRENT, config);
    // Also sync members into master roster
    if (config.team && config.team.length > 0) {
      const master = getMasterTeamRoster();
      const masterMap = new Map(master.map((m) => [m.id, m]));
      config.team.forEach((m) => {
        masterMap.set(m.id, {
          id: m.id,
          name: m.name,
          role: m.role,
          photoDataUrl: m.photoDataUrl,
        });
      });
      saveMasterTeamRoster(Array.from(masterMap.values()));
    }
  } catch (err) {
    console.error('LocalStorage save quota error:', err);
  }
}


/**
 * Get list of saved event presets
 */
export function getSavedEvents(): SavedEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED_LIST);
    if (raw) {
      const list = JSON.parse(raw) as SavedEvent[];
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
    }
  } catch (err) {
    console.warn('Failed to get saved events list:', err);
  }

  // Initial default saved event
  const initial: SavedEvent = {
    id: 'default-hamta-mubarakeh',
    name: 'همتا – دوره پاییز (فولاد مبارکه)',
    updatedAt: Date.now(),
    config: defaultEventConfig,
  };
  try {
    localStorage.setItem(STORAGE_KEY_SAVED_LIST, JSON.stringify([initial]));
  } catch {
    // ignore
  }
  return [initial];
}

/**
 * Save an event into the saved events list
 */
export function saveEventToLibrary(event: SavedEvent) {
  const list = getSavedEvents();
  const index = list.findIndex((e) => e.id === event.id);
  if (index >= 0) {
    list[index] = event;
  } else {
    list.unshift(event);
  }
  try {
    persist(STORAGE_KEY_SAVED_LIST, list);
  } catch (err) {
    console.error('Failed to save event to library:', err);
  }
}

/**
 * Delete an event from the saved events list
 */
export function deleteEventFromLibrary(id: string) {
  const list = getSavedEvents().filter((e) => e.id !== id);
  try {
    persist(STORAGE_KEY_SAVED_LIST, list);
  } catch (err) {
    console.error('Failed to delete event:', err);
  }
  return list;
}

/**
 * Get active saved event ID
 */
export function getActiveEventId(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      return typeof parsed === 'string' ? parsed : null;
    } catch {
      return raw; // legacy plain-string value
    }
  } catch {
    return null;
  }
}

/**
 * Set active saved event ID
 */
export function setActiveEventId(id: string) {
  try {
    persist(STORAGE_KEY_ACTIVE_ID, id);
  } catch (err) {
    console.warn('Failed to save active event id:', err);
  }
}

/**
 * Export configuration as JSON file download
 */
export function exportConfigAsJSON(config: EventConfig, filename = 'bootcamp-event-config.json') {
  const jsonStr = JSON.stringify(config, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Complete a (possibly older / partial) config object with every default field
 */
function mergeWithDefaults(parsed: any): EventConfig {
  return {
    ...defaultEventConfig,
    ...parsed,
    team: Array.isArray(parsed.team) ? parsed.team : defaultEventConfig.team,
    logos: Array.isArray(parsed.logos) ? parsed.logos : defaultEventConfig.logos,
    principlesList: Array.isArray(parsed.principlesList)
      ? parsed.principlesList
      : defaultEventConfig.principlesList,
    brand: { ...defaultEventConfig.brand, ...(parsed.brand || {}) },
    organizer: { ...defaultEventConfig.organizer, ...(parsed.organizer || {}) },
    clientOrg: { ...defaultEventConfig.clientOrg, ...(parsed.clientOrg || {}) },
    modules: { ...defaultEventConfig.modules, ...(parsed.modules || {}) },
    workshop: { ...defaultEventConfig.workshop, ...(parsed.workshop || {}) },
    lunch: { ...defaultEventConfig.lunch, ...(parsed.lunch || {}) },
    sectionTitles: { ...defaultEventConfig.sectionTitles, ...(parsed.sectionTitles || {}) },
    theme: { ...defaultEventConfig.theme, ...(parsed.theme || {}) },
  };
}

/**
 * Import configuration from JSON file
 */
export function importConfigFromJSON(file: File): Promise<EventConfig> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('خطا در خواندن فایل انتخابی'));
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        if (
          !parsed ||
          typeof parsed !== 'object' ||
          !parsed.brand ||
          !Array.isArray(parsed.schedule)
        ) {
          throw new Error('فرمت فایل JSON ارائه‌شده نامعتبر است');
        }
        resolve(mergeWithDefaults(parsed));
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsText(file);
  });
}

declare const __EMBEDDED_CONFIG__: string | null;

/**
 * Offline build only: a final config JSON can be baked into the HTML
 * (see scripts/finish-offline.mjs). Whenever a different embedded config is
 * opened on a machine, it replaces the locally stored state exactly once;
 * later edits on that machine are kept until the embedded config changes.
 */
export function applyEmbeddedConfig() {
  const raw = typeof __EMBEDDED_CONFIG__ === 'string' ? __EMBEDDED_CONFIG__ : null;
  if (!raw) return;
  try {
    let hash = 0;
    for (let i = 0; i < raw.length; i++) hash = (Math.imul(31, hash) + raw.charCodeAt(i)) | 0;
    const id = String(hash);
    if (localStorage.getItem('bootcamp_deck_embedded_id') === id) return;

    const config = mergeWithDefaults(JSON.parse(raw));
    const event: SavedEvent = {
      id: 'embedded-final',
      name: `${config.brand.name} – نسخه نهایی`,
      updatedAt: Date.now(),
      config,
    };
    localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(config));
    localStorage.setItem(STORAGE_KEY_SAVED_LIST, JSON.stringify([event]));
    localStorage.setItem(STORAGE_KEY_ACTIVE_ID, JSON.stringify(event.id));
    localStorage.setItem(
      STORAGE_KEY_MASTER_TEAM,
      JSON.stringify(
        config.team.map((m) => ({ id: m.id, name: m.name, role: m.role, photoDataUrl: m.photoDataUrl })),
      ),
    );
    localStorage.setItem('bootcamp_deck_embedded_id', id);
  } catch (err) {
    console.warn('Failed to apply embedded config:', err);
  }
}
