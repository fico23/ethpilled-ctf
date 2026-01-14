import { motion, AnimatePresence } from "framer-motion";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { useState } from "react";
import { CTF_ADDRESS, CTF_ABI } from "../contracts/ctf";
import { useIsWhitelisted } from "../hooks/useWhitelist";

export function GameButton() {
  const { isConnected } = useAccount();
  const { isWhitelisted, isLoading: whitelistLoading } = useIsWhitelisted();
  const [showTooltip, setShowTooltip] = useState(false);

  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleClick = () => {
    if (!isConnected) return;

    if (!isWhitelisted) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
      return;
    }

    writeContract({
      address: CTF_ADDRESS,
      abi: CTF_ABI,
      functionName: "game",
    });
  };

  const isDisabled = !isConnected || isPending || isConfirming;
  const showDisabledStyle = !isConnected || (!whitelistLoading && !isWhitelisted);

  return (
    <div className="game-button-container">
      <motion.button
        className={`game-button ${showDisabledStyle ? "disabled" : ""}`}
        onClick={handleClick}
        disabled={isDisabled}
        whileHover={!showDisabledStyle ? { scale: 1.05 } : {}}
        whileTap={!showDisabledStyle ? { scale: 0.95 } : {}}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {isPending || isConfirming ? (
          <span className="button-content">
            <motion.span
              className="spinner"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            {isPending ? "Confirm in wallet..." : "Processing..."}
          </span>
        ) : (
          <span className="button-content">
            <span className="button-icon">🎮</span>
            Play Game
          </span>
        )}

        {/* Animated gradient background */}
        <motion.div
          className="button-gradient"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.button>

      {/* Tooltip for non-whitelisted users */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className="tooltip"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <span className="tooltip-icon">🔒</span>
            <span>You're not whitelisted for this game</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success message */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            className="success-message"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <span className="success-icon">✨</span>
            Transaction successful!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="error-message"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <span className="error-icon">❌</span>
            {error.message.includes("User rejected")
              ? "Transaction cancelled"
              : "Transaction failed"}
          </motion.div>
        )}
      </AnimatePresence>

      {!isConnected && (
        <p className="connect-hint">Connect your wallet to play</p>
      )}
    </div>
  );
}
