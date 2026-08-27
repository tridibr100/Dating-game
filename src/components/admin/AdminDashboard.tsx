import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  RefreshCw,
  Clock,
  MapPin,
  Utensils,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Shield,
  LogOut,
  Sliders,
  Calendar,
  History,
  Check,
  Circle,
  HelpCircle,
  Database,
  PartyPopper,
  Flame,
} from 'lucide-react';
import { DEFAULT_RESTAURANTS } from '../../data/restaurants';
import {
  fetchDashboardData,
  groupRecordsBySession,
  formatTimestamp,
  formatDateWithTime,
  getTimeAgo,
  FetchResult,
} from '../../services/tracker';
import { DashboardSession, GameRecord } from '../../types';
import { AUTO_REFRESH_INTERVAL_MS, GOOGLE_SHEETS_ENDPOINT } from '../../config/backend';
import { GoogleAppsScriptModal } from './GoogleAppsScriptModal';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [fetchResult, setFetchResult] = useState<FetchResult | null>(null);
  const [sessions, setSessions] = useState<DashboardSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [isScriptModalOpen, setIsScriptModalOpen] = useState<boolean>(false);

  const loadData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    try {
      const result = await fetchDashboardData();
      setFetchResult(result);
      const parsedSessions = groupRecordsBySession(result.records);
      setSessions(parsedSessions);

      // Default selected session to the most recent one if not selected or invalid
      if (parsedSessions.length > 0) {
        setSelectedSessionId((prev) => {
          if (prev && parsedSessions.some((s) => s.sessionId === prev)) {
            return prev;
          }
          return parsedSessions[0].sessionId;
        });
      } else {
        setSelectedSessionId(null);
      }

      const now = new Date();
      setLastUpdated(
        now.toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    } catch (err) {
      console.error('Error loading dashboard data', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load & 30-second background auto-refresh
  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData(false);
    }, AUTO_REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [loadData]);

  // Current active session being viewed
  const activeSession =
    sessions.find((s) => s.sessionId === selectedSessionId) || sessions[0] || null;

  // Derive step completion states
  const isCompleted = activeSession?.completed || false;
  const isRestaurantChosen = Boolean(activeSession?.restaurantName);

  // Map configured restaurants with selection status
  const matchedRestaurantConfig = DEFAULT_RESTAURANTS.find(
    (r) =>
      r.name.toLowerCase() === activeSession?.restaurantName?.toLowerCase() ||
      r.id === activeSession?.restaurantId
  );

  return (
    <div className="min-h-screen min-h-[100dvh] w-full bg-[#FDFBF7] text-[#1c1c17] p-4 sm:p-6 lg:p-8 relative">
      {/* Subtle Background Glow Orbs */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-[#FFD1DC] rounded-full opacity-30 blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-[#800020] rounded-full opacity-5 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* ================================================================= */}
        {/* DASHBOARD HEADER */}
        {/* ================================================================= */}
        <header className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(128,0,32,0.08)] border border-[#800020]/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#800020] tracking-tight flex items-center gap-2">
                DATE NIGHT HQ <Heart className="w-6 h-6 fill-[#800020] text-[#800020]" />
              </span>

              {/* Status Indicator */}
              {fetchResult?.isLive ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Connected
                </span>
              ) : fetchResult?.usingFallback ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold" title="Using local browser event cache. Connect Google Apps Script for cloud sync.">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Local Sync Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Unable to connect
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Your very important investigation dashboard.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              id="refresh-dashboard-btn"
              onClick={() => loadData(true)}
              disabled={refreshing}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-gray-50 text-[#800020] border border-gray-200 hover:border-[#800020]/30 text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
              title="Fetch latest responses"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`}
              />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>

            <button
              onClick={() => setIsScriptModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-[#FFD1DC]/40 hover:bg-[#FFD1DC]/70 text-[#800020] border border-[#FFD1DC] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              title="Google Apps Script Setup Guide"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Google Sheet Backend</span>
            </button>

            <button
              onClick={onLogout}
              className="px-3.5 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Lock Dashboard"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock HQ</span>
            </button>
          </div>
        </header>

        {/* Live Refresh Timestamp Bar */}
        <div className="flex items-center justify-between text-xs text-gray-400 px-2">
          <span>
            {lastUpdated ? `Last updated: ${lastUpdated}` : 'Fetching live data...'}
          </span>
          <span className="flex items-center gap-1 text-[11px]">
            <Clock className="w-3 h-3 text-[#800020]/60" /> Auto-refreshes every 30s
          </span>
        </div>

        {/* Error Warning Banner if Connection Failed */}
        {fetchResult?.error && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start justify-between gap-3 text-amber-900 text-xs">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Couldn’t connect to Google Apps Script cloud endpoint.</p>
                <p className="text-amber-700 mt-0.5">
                  Check your Google Sheets connection or paste your Web App URL in <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">src/config/backend.ts</code>. Showing local session events.
                </p>
              </div>
            </div>
            <button
              onClick={() => loadData(true)}
              className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded-xl font-bold text-amber-900 transition-colors shrink-0 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* ================================================================= */}
        {/* LIVE STATE BANNER */}
        {/* ================================================================= */}
        <div className="overflow-hidden">
          {!activeSession || (!isRestaurantChosen && !isCompleted) ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-[#FFF5F7] via-white to-[#FFF5F7] border border-[#FFD1DC] rounded-3xl p-6 text-center shadow-xs"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FFD1DC]/60 text-[#800020] flex items-center justify-center mx-auto mb-3 animate-pulse">
                <Heart className="w-6 h-6 fill-[#800020]" />
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#800020] mb-1">
                She’s playing the game… 👀
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                Your mission is to wait. As soon as Miss Vashishtha makes her choices, they will appear live right here.
              </p>
            </motion.div>
          ) : isCompleted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-[#800020] to-[#570013] text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-3xl border border-white/20 shrink-0">
                    🎉
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold tracking-widest uppercase mb-1">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>MISSION ACCOMPLISHED</span>
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold">
                      She made it all the way through! ❤️
                    </h2>
                    <p className="text-xs text-white/80 mt-1">
                      Confirmed for <strong>{activeSession.restaurantName}</strong> on Friday Night at 9:30 PM.
                    </p>
                  </div>
                </div>

                <div className="px-5 py-2.5 rounded-2xl bg-white text-[#800020] font-bold text-xs shadow-md shrink-0">
                  Ready for Date Night ✨
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-[#FFD1DC]/40 via-white to-[#FFD1DC]/40 border border-[#FFD1DC] rounded-3xl p-6 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#800020] text-white flex items-center justify-center text-xl shrink-0">
                    ❤️
                  </div>
                  <div>
                    <span className="text-[11px] font-bold tracking-wider text-[#800020] uppercase block">
                      WE HAVE A WINNER ❤️
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#800020]">
                      {activeSession.restaurantName}
                    </h3>
                  </div>
                </div>

                <span className="text-xs font-bold text-gray-500 bg-white px-3 py-1.5 rounded-xl border border-gray-200">
                  Completing final confirmation...
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* ================================================================= */}
        {/* SUMMARY CARDS (3 CARDS) */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Restaurant Choice */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(128,0,32,0.06)] border border-[#800020]/10 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Her Choice
              </span>
              <Utensils className="w-4 h-4 text-[#800020]" />
            </div>
            <div>
              <div className="font-serif text-xl sm:text-2xl font-bold text-[#800020] truncate">
                {activeSession?.restaurantName || 'Waiting for choice… 👀'}
              </div>
              <p className="text-xs text-gray-500 mt-1 truncate">
                {activeSession?.cuisineVibe || 'Italian & Romantic Options'}
              </p>
            </div>
          </div>

          {/* Card 2: Game Status */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(128,0,32,0.06)] border border-[#800020]/10 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Game Status
              </span>
              <CheckCircle2 className="w-4 h-4 text-[#800020]" />
            </div>
            <div>
              <div className="font-serif text-xl sm:text-2xl font-bold text-[#800020]">
                {isCompleted
                  ? 'Completed ❤️'
                  : activeSession?.events?.length
                  ? 'In Progress 👀'
                  : 'Not completed'}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {isCompleted
                  ? 'All 6 investigation steps cleared'
                  : isRestaurantChosen
                  ? 'Restaurant chosen · Awaiting confirmation'
                  : 'Playing interactive steps'}
              </p>
            </div>
          </div>

          {/* Card 3: Last Activity */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(128,0,32,0.06)] border border-[#800020]/10 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Last Activity
              </span>
              <Clock className="w-4 h-4 text-[#800020]" />
            </div>
            <div>
              <div className="font-serif text-xl sm:text-2xl font-bold text-[#800020]">
                {activeSession
                  ? formatTimestamp(activeSession.lastActivityTime)
                  : 'No activity yet'}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {activeSession
                  ? getTimeAgo(activeSession.lastActivityTime)
                  : 'Standing by for session'}
              </p>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* MAIN SECTION: MAIN RESTAURANT CARD + GAME PROGRESS */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Restaurant Card (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(128,0,32,0.08)] border border-[#800020]/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                <span className="font-serif text-lg font-bold text-[#800020] flex items-center gap-2">
                  <Heart className="w-5 h-5 fill-[#800020]" />
                  HER RESTAURANT CHOICE ❤️
                </span>
                {isRestaurantChosen && (
                  <span className="px-3 py-1 rounded-full bg-[#FFD1DC]/40 text-[#800020] border border-[#FFD1DC] text-[11px] font-bold uppercase">
                    Official Pick
                  </span>
                )}
              </div>

              {isRestaurantChosen ? (
                <div className="space-y-4">
                  {matchedRestaurantConfig?.imageUrl && (
                    <div className="h-44 w-full rounded-2xl overflow-hidden relative shadow-inner">
                      <img
                        src={matchedRestaurantConfig.imageUrl}
                        alt={activeSession.restaurantName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
                        <span className="text-white text-xs font-medium backdrop-blur-xs bg-black/40 px-2.5 py-1 rounded-lg">
                          ⭐ {matchedRestaurantConfig.rating} ({matchedRestaurantConfig.reviewCount}+ reviews)
                        </span>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#800020]">
                      {activeSession.restaurantName}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {activeSession.cuisineVibe || matchedRestaurantConfig?.tagline}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#FDFBF7] border border-gray-100">
                      <MapPin className="w-4 h-4 text-[#800020] shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">
                          Location / Address
                        </span>
                        <span className="font-medium text-[#1c1c17]">
                          {activeSession.location || matchedRestaurantConfig?.address || 'Indiranagar / MG Road, Bengaluru'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#FDFBF7] border border-gray-100">
                      <Calendar className="w-4 h-4 text-[#800020] shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">
                          Selection Time
                        </span>
                        <span className="font-medium text-[#1c1c17]">
                          {formatDateWithTime(activeSession.lastActivityTime)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {matchedRestaurantConfig?.mapsUrl && (
                    <a
                      href={matchedRestaurantConfig.mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#800020] hover:underline pt-1"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ) : (
                <div className="py-12 text-center text-gray-400 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center mx-auto text-2xl">
                    👀
                  </div>
                  <h4 className="font-serif text-lg font-bold text-gray-600">
                    Waiting for her choice… 👀
                  </h4>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    She hasn't reached the restaurant selection step yet. Her chosen restaurant and vibe will update here automatically.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Game Progress (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(128,0,32,0.08)] border border-[#800020]/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                <span className="font-serif text-lg font-bold text-[#800020]">
                  GAME PROGRESS
                </span>
                <span className="text-xs font-bold text-gray-500">
                  {isCompleted
                    ? 'Mission accomplished ❤️'
                    : isRestaurantChosen
                    ? 'She’s almost there 👀'
                    : 'Investigation in progress 🕵️'}
                </span>
              </div>

              {/* Progress Steps Checklist */}
              <div className="space-y-3">
                {[
                  {
                    num: '01',
                    label: 'Investigation',
                    done: Boolean(activeSession?.events?.length),
                  },
                  {
                    num: '02',
                    label: 'Love Question',
                    done:
                      isRestaurantChosen ||
                      isCompleted ||
                      activeSession?.events?.some(
                        (e) => e.status === 'love_question_answered'
                      ),
                  },
                  {
                    num: '03',
                    label: 'The Trap',
                    done:
                      isRestaurantChosen ||
                      isCompleted ||
                      activeSession?.events?.some(
                        (e) => e.status === 'date_accepted'
                      ),
                  },
                  {
                    num: '04',
                    label: 'Date Upgrade',
                    done:
                      isRestaurantChosen ||
                      isCompleted ||
                      activeSession?.events?.some(
                        (e) => e.status === 'date_upgraded'
                      ),
                  },
                  {
                    num: '05',
                    label: 'Restaurant Choice',
                    done: isRestaurantChosen || isCompleted,
                  },
                  {
                    num: '06',
                    label: 'Final Confirmation',
                    done: isCompleted,
                  },
                ].map((step, idx) => (
                  <div
                    key={step.num}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      step.done
                        ? 'bg-[#FFD1DC]/20 border-[#FFD1DC] text-[#800020]'
                        : 'bg-gray-50/70 border-gray-100 text-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold opacity-60">
                        {step.num}
                      </span>
                      <span className="text-xs font-bold">
                        {step.label}
                      </span>
                    </div>

                    <div>
                      {step.done ? (
                        <span className="w-5 h-5 rounded-full bg-[#800020] text-white flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </span>
                      ) : (
                        <Circle className="w-4 h-4 text-gray-300" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-400 text-center">
              Session ID: <code className="font-mono text-[#800020]">{activeSession?.sessionId || 'N/A'}</code>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* RESTAURANT OPTIONS SECTION */}
        {/* ================================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(128,0,32,0.08)] border border-[#800020]/10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#800020]">
                RESTAURANT OPTIONS
              </h3>
              <p className="text-xs text-gray-500">
                The 3 curated options presented to Miss Vashishtha
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DEFAULT_RESTAURANTS.map((rest) => {
              const isChosen =
                rest.name.toLowerCase() ===
                  activeSession?.restaurantName?.toLowerCase() ||
                rest.id === activeSession?.restaurantId;

              return (
                <div
                  key={rest.id}
                  className={`rounded-2xl p-5 border transition-all relative flex flex-col justify-between ${
                    isChosen
                      ? 'bg-[#FFD1DC]/30 border-[#800020] ring-2 ring-[#800020]/20 shadow-md'
                      : 'bg-[#FDFBF7] border-gray-200/80 opacity-80'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl">{rest.vibeIcon}</span>
                      {isChosen ? (
                        <span className="px-2.5 py-1 rounded-full bg-[#800020] text-white text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-xs">
                          <Check className="w-3 h-3" />
                          <span>CHOSEN ❤️</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-gray-200/70 text-gray-500 text-[10px] font-bold tracking-wider uppercase">
                          Not selected
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif text-base font-bold text-[#800020]">
                      {rest.name}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {rest.cuisine} • {rest.vibe}
                    </p>
                    <p className="text-[11px] text-gray-600 mt-2 line-clamp-2">
                      {rest.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-200/50 flex items-center justify-between text-[11px] text-gray-400">
                    <span>📍 {rest.address.split(',')[0]}</span>
                    <span>{rest.priceLevel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================================================================= */}
        {/* ACTIVITY TIMELINE SECTION */}
        {/* ================================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(128,0,32,0.08)] border border-[#800020]/10">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-serif text-lg font-bold text-[#800020] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#800020]" />
              ACTIVITY TIMELINE
            </h3>
            <span className="text-xs text-gray-400">
              {activeSession?.events?.length || 0} event(s) recorded
            </span>
          </div>

          {activeSession?.events && activeSession.events.length > 0 ? (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#FFD1DC]">
              {activeSession.events.map((evt, idx) => {
                let title = 'Game Event';
                let desc = '';

                if (evt.status === 'game_started') {
                  title = 'Game started';
                  desc = 'Miss Vashishtha opened Case File #Friday';
                } else if (evt.status === 'love_question_answered') {
                  title = 'Love question answered';
                  desc = 'Passed the interrogation with 100% devotion';
                } else if (evt.status === 'date_accepted') {
                  title = 'Date accepted';
                  desc = 'Agreed to Friday Night date summons';
                } else if (evt.status === 'date_upgraded') {
                  title = 'Date upgraded';
                  desc = 'Unlocked VIP fine dining upgrade';
                } else if (evt.status === 'restaurant_selected') {
                  title = `Restaurant selected: ${evt.restaurantName || 'Option'}`;
                  desc = `${evt.location || ''} (${evt.cuisineVibe || ''})`;
                } else if (evt.status === 'game_completed') {
                  title = 'Game completed ❤️';
                  desc = 'Official reservation ticket finalized and confirmed';
                } else {
                  title = evt.status;
                  desc = evt.restaurantName || '';
                }

                return (
                  <div key={idx} className="relative group">
                    {/* Timeline Node Dot */}
                    <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-white border-2 border-[#800020] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#800020]" />
                    </div>

                    <div className="bg-[#FDFBF7] p-3.5 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div>
                        <div className="text-xs font-bold text-[#800020]">
                          {title}
                        </div>
                        {desc && (
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            {desc}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-gray-400 shrink-0">
                        {formatTimestamp(evt.timestamp)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-gray-400">
              No recorded timeline events for this session yet.
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* PREVIOUS SESSIONS SECTION */}
        {/* ================================================================= */}
        {sessions.length > 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(128,0,32,0.08)] border border-[#800020]/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-bold text-[#800020] flex items-center gap-2">
                <History className="w-5 h-5 text-[#800020]" />
                PREVIOUS SESSIONS
              </h3>
              <span className="text-xs text-gray-400">
                {sessions.length} total sessions tracked
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {sessions.map((sess) => {
                const isSelected = sess.sessionId === activeSession?.sessionId;
                return (
                  <button
                    key={sess.sessionId}
                    onClick={() => setSelectedSessionId(sess.sessionId)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FFD1DC]/30 border-[#800020] ring-2 ring-[#800020]/20'
                        : 'bg-[#FDFBF7] border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-mono text-gray-400 truncate max-w-[120px]">
                        {sess.sessionId}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase ${
                          sess.completed ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        {sess.completed ? 'Completed ❤️' : 'In Progress'}
                      </span>
                    </div>

                    <div className="font-bold text-xs text-[#800020] truncate">
                      {sess.restaurantName || 'No restaurant chosen'}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">
                      {formatDateWithTime(sess.lastActivityTime)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer info */}
        <footer className="text-center text-xs text-gray-400 py-4">
          Date Night HQ Creator Dashboard &bull; Case File #Friday Confidential
        </footer>
      </div>

      {/* Google Apps Script Backend Setup Modal */}
      <GoogleAppsScriptModal
        isOpen={isScriptModalOpen}
        onClose={() => setIsScriptModalOpen(false)}
      />
    </div>
  );
};
