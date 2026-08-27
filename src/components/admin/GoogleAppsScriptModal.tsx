import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, ExternalLink, Code2, Sparkles, Database } from 'lucide-react';
import { GOOGLE_APPS_SCRIPT_CODE } from '../../config/googleAppsScript';
import { GOOGLE_SHEETS_ENDPOINT } from '../../config/backend';

interface GoogleAppsScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleAppsScriptModal: React.FC<GoogleAppsScriptModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-2xl bg-[#FDFBF7] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#800020]/20 flex flex-col max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#800020] text-white flex items-center justify-center shadow-xs">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-[#800020]">
                  Google Apps Script Backend
                </h2>
                <p className="text-xs text-gray-500">
                  Connect your real Google Sheet in 2 minutes
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto py-4 space-y-6 text-sm text-[#1c1c17]">
            {/* Quick Steps */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#800020]">
                Quick Setup Steps:
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-xs text-gray-700 bg-white p-4 rounded-2xl border border-gray-200">
                <li>
                  Create a new <strong>Google Sheet</strong> (e.g. named <em>"Date Night Responses"</em>).
                </li>
                <li>
                  Click <strong>Extensions &gt; Apps Script</strong>.
                </li>
                <li>
                  Delete any existing code in <code>Code.gs</code> and paste the script below.
                </li>
                <li>
                  Click <strong>Deploy &gt; New deployment</strong>, select <strong>Web App</strong>.
                </li>
                <li>
                  Set <strong>Execute as:</strong> <em>Me</em> and <strong>Who has access:</strong> <em>Anyone</em>.
                </li>
                <li>
                  Copy the provided <strong>Web App URL</strong> and set it in <code className="bg-[#FFD1DC]/40 text-[#800020] px-1 py-0.5 rounded font-mono">/src/config/backend.ts</code>.
                </li>
              </ol>
            </div>

            {/* Current Endpoint */}
            <div className="p-3.5 rounded-2xl bg-white border border-gray-200 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                Current Configured Endpoint:
              </span>
              <div className="font-mono text-xs text-gray-800 break-all bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                {GOOGLE_SHEETS_ENDPOINT}
              </div>
            </div>

            {/* Code Block with Copy */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-[#800020]" />
                  Code.gs Source Code:
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-xl bg-[#800020] text-white hover:bg-[#660019] text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Script</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="bg-[#1e1e1e] text-gray-200 text-xs p-4 rounded-2xl font-mono overflow-x-auto max-h-64 border border-gray-800 leading-relaxed select-all">
                {GOOGLE_APPS_SCRIPT_CODE}
              </pre>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-gray-200 flex justify-end shrink-0">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#800020] hover:bg-[#660019] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Done &amp; Return to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
