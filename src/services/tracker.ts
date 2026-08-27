import { GameRecord, GameEventStatus, DashboardSession } from '../types';
import { GOOGLE_SHEETS_ENDPOINT } from '../config/backend';

const LOCAL_STORAGE_KEY = 'date_night_records_v1';
const SESSION_STORAGE_KEY = 'date_night_current_session_id';

/**
 * Gets or creates a unique session ID for the current player's game session.
 */
export function getOrCreateSessionId(): string {
  try {
    let sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionId) {
      const randomStr = Math.random().toString(36).substring(2, 8);
      sessionId = `sess_${Date.now()}_${randomStr}`;
      sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    }
    return sessionId;
  } catch {
    return `sess_${Date.now()}`;
  }
}

/**
 * Save an event to the local browser fallback cache
 */
function saveToLocalCache(record: GameRecord): void {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    const list: GameRecord[] = raw ? JSON.parse(raw) : [];
    list.push(record);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Could not save event to local storage', e);
  }
}

/**
 * Record a game progress or completion event.
 * Sends asynchronously to Google Apps Script and caches locally.
 */
export async function recordGameEvent(
  status: GameEventStatus,
  details?: {
    restaurantId?: string;
    restaurantName?: string;
    location?: string;
    cuisineVibe?: string;
  }
): Promise<void> {
  const sessionId = getOrCreateSessionId();
  const record: GameRecord = {
    timestamp: new Date().toISOString(),
    sessionId,
    restaurantId: details?.restaurantId || '',
    restaurantName: details?.restaurantName || '',
    location: details?.location || '',
    cuisineVibe: details?.cuisineVibe || '',
    status,
  };

  // Always save locally first
  saveToLocalCache(record);

  // If endpoint is configured, send POST
  if (
    GOOGLE_SHEETS_ENDPOINT &&
    !GOOGLE_SHEETS_ENDPOINT.includes('YOUR_SCRIPT_ID')
  ) {
    try {
      // Use text/plain or URLSearchParams for cleanest Google Apps Script CORS handling
      await fetch(GOOGLE_SHEETS_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors', // Google Apps Script web apps redirect on POST
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(record),
      });
    } catch (err) {
      console.warn('Failed to send event to Google Apps Script:', err);
    }
  }
}

export interface FetchResult {
  records: GameRecord[];
  isLive: boolean;
  error: string | null;
  usingFallback: boolean;
}

/**
 * Fetches recorded responses from Google Apps Script with fallback to local cache.
 */
export async function fetchDashboardData(): Promise<FetchResult> {
  const isEndpointConfigured =
    Boolean(GOOGLE_SHEETS_ENDPOINT) &&
    !GOOGLE_SHEETS_ENDPOINT.includes('YOUR_SCRIPT_ID');

  if (isEndpointConfigured) {
    try {
      // Append query param to GET responses
      const url = `${GOOGLE_SHEETS_ENDPOINT}${
        GOOGLE_SHEETS_ENDPOINT.includes('?') ? '&' : '?'
      }action=responses&t=${Date.now()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const json = await response.json();
      if (json && Array.isArray(json.records)) {
        return {
          records: json.records,
          isLive: true,
          error: null,
          usingFallback: false,
        };
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.warn('Error fetching live Google Apps Script data:', errorMsg);

      // Fall back to local storage cache if live fails
      const localRecords = getLocalRecords();
      return {
        records: localRecords,
        isLive: false,
        error: `Could not connect to Google Apps Script (${errorMsg})`,
        usingFallback: true,
      };
    }
  }

  // Not yet configured with real ID — use local storage cache
  const localRecords = getLocalRecords();
  return {
    records: localRecords,
    isLive: false,
    error: isEndpointConfigured ? null : 'Google Apps Script endpoint not configured yet',
    usingFallback: true,
  };
}

export function getLocalRecords(): GameRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Formats ISO timestamp to human-friendly string
 */
export function formatTimestamp(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

export function formatDateWithTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    const datePart = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const timePart = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${datePart} at ${timePart}`;
  } catch {
    return isoString;
  }
}

export function getTimeAgo(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffSeconds < 30) return 'Just now';
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  } catch {
    return '';
  }
}

/**
 * Group raw events into structured sessions
 */
export function groupRecordsBySession(records: GameRecord[]): DashboardSession[] {
  if (!records || records.length === 0) return [];

  const sessionMap = new Map<string, GameRecord[]>();

  records.forEach((rec) => {
    const sid = rec.sessionId || 'session_default';
    if (!sessionMap.has(sid)) {
      sessionMap.set(sid, []);
    }
    sessionMap.get(sid)!.push(rec);
  });

  const sessions: DashboardSession[] = [];

  sessionMap.forEach((events, sessionId) => {
    // Sort chronological
    events.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime() || 0;
      const timeB = new Date(b.timestamp).getTime() || 0;
      return timeA - timeB;
    });

    const startTime = events[0]?.timestamp || new Date().toISOString();
    const lastActivityTime =
      events[events.length - 1]?.timestamp || startTime;

    const completed = events.some((e) => e.status === 'game_completed');
    const selectedEvent = [...events]
      .reverse()
      .find((e) => e.status === 'restaurant_selected' || e.restaurantName);

    const restaurantSelected = Boolean(selectedEvent?.restaurantName);
    const restaurantId = selectedEvent?.restaurantId || '';
    const restaurantName = selectedEvent?.restaurantName || '';
    const location = selectedEvent?.location || '';
    const cuisineVibe = selectedEvent?.cuisineVibe || '';

    let status: DashboardSession['status'] = 'Not started';
    if (completed) {
      status = 'Completed ❤️';
    } else if (restaurantSelected || events.length > 0) {
      status = 'In Progress 👀';
    }

    sessions.push({
      sessionId,
      startTime,
      lastActivityTime,
      restaurantId,
      restaurantName,
      location,
      cuisineVibe,
      status,
      completed,
      restaurantSelected,
      events,
    });
  });

  // Sort sessions with most recently active first
  sessions.sort((a, b) => {
    const timeA = new Date(a.lastActivityTime).getTime() || 0;
    const timeB = new Date(b.lastActivityTime).getTime() || 0;
    return timeB - timeA;
  });

  return sessions;
}
