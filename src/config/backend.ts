/**
 * ============================================================================
 * DATE NIGHT HQ - BACKEND & CREATOR DASHBOARD CONFIGURATION
 * ============================================================================
 * 
 * 1. GOOGLE_SHEETS_ENDPOINT:
 *    Replace this placeholder with your deployed Google Apps Script Web App URL.
 *    Example: https://script.google.com/macros/s/AKfycbx.../exec
 * 
 * 2. ADMIN_PASSWORD:
 *    Change this password to your private creator secret.
 *    This gates access to the /admin creator dashboard.
 * 
 * SECURITY NOTE:
 * Production-grade OAuth or server-side authentication should be added if
 * this dashboard is ever used for sensitive information. For this project,
 * only the restaurant choice, timestamps, session ID, and game completion state
 * are stored.
 */

export const GOOGLE_SHEETS_ENDPOINT = 'https://script.google.com/macros/s/AKfycby7MDVowW14hOA1T63Tu_CcSuINnavVjKubmo-iviH6INfoijOYQ1hbvA61w5kblCP8hA/exec';

export const ADMIN_PASSWORD = 'CHANGE_THIS_PASSWORD';

export const AUTO_REFRESH_INTERVAL_MS = 30000; // 30 seconds auto-refresh
