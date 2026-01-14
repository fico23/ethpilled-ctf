import { motion, AnimatePresence } from "framer-motion";
import { useWinners, useTotalAmount, calculateRewards, formatAddress } from "../hooks/useWinners";
import { formatEther } from "viem";
import { useEffect, useRef, useState } from "react";
import Confetti from "./Confetti";

const POSITION_LABELS = ["1st", "2nd", "3rd", "4th", "5th"];
const POSITION_COLORS = [
  "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)", // Gold
  "linear-gradient(135deg, #E8E8E8 0%, #B8B8B8 100%)", // Silver
  "linear-gradient(135deg, #CD7F32 0%, #A0522D 100%)", // Bronze
  "linear-gradient(135deg, #98D8C8 0%, #7FC8A8 100%)", // Teal
  "linear-gradient(135deg, #DDA0DD 0%, #BA55D3 100%)", // Plum
];

export function WinnersList() {
  const { data: winners, isLoading: winnersLoading } = useWinners();
  const { data: totalAmount, isLoading: amountLoading } = useTotalAmount();
  const [showConfetti, setShowConfetti] = useState(false);
  const previousWinnersRef = useRef<string>("");

  const rewards = totalAmount ? calculateRewards(totalAmount) : [];

  // Detect changes and trigger confetti
  useEffect(() => {
    if (!winners) return;

    const winnersString = winners.join(",");
    if (previousWinnersRef.current && previousWinnersRef.current !== winnersString) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    previousWinnersRef.current = winnersString;
  }, [winners]);

  if (winnersLoading || amountLoading) {
    return (
      <div className="winners-container">
        <div className="winners-header">
          <h2>Current Winners</h2>
          <div className="loading-shimmer" />
        </div>
      </div>
    );
  }

  const isEmptySlot = (address: string) =>
    address === "0x0000000000000000000000000000000000000000";

  return (
    <div className="winners-container">
      {showConfetti && <Confetti />}
      <div className="winners-header">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Current Winners
        </motion.h2>
        <p className="winners-subtitle">Top positions in the CTF game</p>
      </div>

      <div className="winners-list">
        <AnimatePresence mode="popLayout">
          {winners?.map((winner, index) => (
            <motion.div
              key={`${index}-${winner}`}
              className={`winner-card ${isEmptySlot(winner) ? "empty" : ""}`}
              initial={{ opacity: 0, x: -50, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.8 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                delay: index * 0.1,
              }}
              layout
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div
                className="position-badge"
                style={{ background: POSITION_COLORS[index] }}
              >
                {POSITION_LABELS[index]}
              </div>

              <div className="winner-info">
                <span className={`winner-address ${isEmptySlot(winner) ? "empty" : ""}`}>
                  {formatAddress(winner)}
                </span>
                <span className="winner-reward">
                  {rewards[index] ? (
                    <>
                      <span className="reward-amount">
                        {parseFloat(formatEther(rewards[index])).toLocaleString()}
                      </span>
                      <span className="reward-label">tokens</span>
                    </>
                  ) : (
                    "—"
                  )}
                </span>
              </div>

              {!isEmptySlot(winner) && (
                <motion.div
                  className="winner-glow"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ background: POSITION_COLORS[index] }}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
