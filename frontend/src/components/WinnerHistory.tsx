import { motion, AnimatePresence } from "framer-motion";
import { useWinnerHistory, useNewWinnerDetection, formatRelativeTime } from "../hooks/useWinnerHistory";
import { formatAddress } from "../hooks/useWinners";
import Confetti from "./Confetti";

export function WinnerHistory() {
  const { data: history, isLoading } = useWinnerHistory();
  const hasNewWinner = useNewWinnerDetection(history);

  return (
    <>
      {/* Confetti effect when new winner detected */}
      <AnimatePresence>
        {hasNewWinner && <Confetti />}
      </AnimatePresence>

      <motion.section
        className="history-section"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div className="history-container">
          <div className="history-header">
            <h2>Live Activity</h2>
            <div className="live-indicator">
              <span className="live-dot" />
              <span>Live</span>
            </div>
          </div>

          {isLoading ? (
            <div className="history-loading">
              <div className="loading-shimmer" />
            </div>
          ) : !history || history.length === 0 ? (
            <div className="history-empty">
              <p>No activity yet. Be the first to play!</p>
            </div>
          ) : (
            <div className="history-list">
              <AnimatePresence mode="popLayout">
                {history.map((event, index) => (
                  <motion.div
                    key={event.id}
                    className="history-item"
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                      delay: index * 0.05,
                    }}
                    layout
                  >
                    <div className="history-icon">
                      <span>🏆</span>
                    </div>
                    <div className="history-content">
                      <span className="history-address">
                        {formatAddress(event.newWinner)}
                      </span>
                      <span className="history-action">claimed the flag</span>
                    </div>
                    <div className="history-time">
                      {formatRelativeTime(event.timestamp)}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.section>
    </>
  );
}
