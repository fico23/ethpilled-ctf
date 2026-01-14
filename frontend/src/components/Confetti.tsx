import { motion } from "framer-motion";
import { useMemo } from "react";

const CONFETTI_COLORS = [
  "#FF6B6B", // Coral
  "#4ECDC4", // Teal
  "#FFE66D", // Yellow
  "#95E1D3", // Mint
  "#F38181", // Salmon
  "#AA96DA", // Lavender
  "#FCBAD3", // Pink
  "#A8D8EA", // Sky blue
];

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  duration: number;
  color: string;
  rotation: number;
  size: number;
}

export default function Confetti() {
  const pieces = useMemo(() => {
    const confetti: ConfettiPiece[] = [];
    for (let i = 0; i < 50; i++) {
      confetti.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * 360,
        size: 8 + Math.random() * 8,
      });
    }
    return confetti;
  }, []);

  return (
    <div className="confetti-container">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="confetti-piece"
          initial={{
            x: `${piece.x}vw`,
            y: -20,
            rotate: piece.rotation,
            opacity: 1,
          }}
          animate={{
            y: "100vh",
            rotate: piece.rotation + 720,
            opacity: 0,
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: "easeIn",
          }}
          style={{
            backgroundColor: piece.color,
            width: piece.size,
            height: piece.size,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  );
}
