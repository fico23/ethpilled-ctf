import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, ConnectButton } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { config } from "./wagmi";
import { WinnersList } from "./components/WinnersList";
import { GameButton } from "./components/GameButton";
import { useEndTimestamp } from "./hooks/useWinners";
import "./App.css";

const queryClient = new QueryClient();

function GameStatus() {
  const { data: endTimestamp } = useEndTimestamp();

  if (!endTimestamp) return null;

  const endDate = new Date(Number(endTimestamp) * 1000);
  const isEnded = Date.now() > endDate.getTime();

  return (
    <motion.div
      className={`game-status ${isEnded ? "ended" : "active"}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
    >
      <span className="status-dot" />
      <span className="status-text">
        {isEnded ? "Game Ended" : `Ends ${endDate.toLocaleDateString()}`}
      </span>
    </motion.div>
  );
}

function AppContent() {
  return (
    <div className="app">
      {/* Animated background blobs */}
      <div className="background-blobs">
        <motion.div
          className="blob blob-1"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="blob blob-2"
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="blob blob-3"
          animate={{
            x: [0, 60, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Header */}
      <header className="header">
        <motion.div
          className="logo-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="logo">
            <span className="logo-icon">✨</span>
            CTF Game
          </h1>
          <GameStatus />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ConnectButton
            showBalance={false}
            chainStatus="icon"
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
          />
        </motion.div>
      </header>

      {/* Main content */}
      <main className="main">
        <motion.div
          className="hero-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="hero-title">Capture The Flag</h2>
          <p className="hero-subtitle">
            Compete for the top spots and win rewards. The last 5 players to call
            game() share the prize pool.
          </p>
        </motion.div>

        <motion.div
          className="content-grid"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="winners-section">
            <WinnersList />
          </div>

          <div className="action-section">
            <div className="action-card">
              <h3>Join the Game</h3>
              <p>
                Call the game() function to claim a spot on the winners list.
                Each new call shifts previous winners down.
              </p>
              <GameButton />
            </div>

            <div className="info-card">
              <h4>How it works</h4>
              <ul>
                <li>
                  <span className="bullet">1</span>
                  Connect your wallet
                </li>
                <li>
                  <span className="bullet">2</span>
                  Click "Play Game" to call game()
                </li>
                <li>
                  <span className="bullet">3</span>
                  You'll take the #1 spot
                </li>
                <li>
                  <span className="bullet">4</span>
                  Previous winners shift down
                </li>
                <li>
                  <span className="bullet">5</span>
                  When game ends, rewards are distributed
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Built on Base • Powered by Envio</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <AppContent />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
