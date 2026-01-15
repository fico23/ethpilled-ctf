# Ethereum Guest Lecture - FER
**Duration:** 1h 30min
**Audience:** 4th year CS students, minimal blockchain knowledge
**Secret Goal:** Plant cypherpunk seed in at least 2 students

---

## PART 1: The Red Pill (~25 minutes)

### 1.1 Opening - Hook Them

🎤 **"What is the difference between cryptocurrency and blockchain?"**
- Let them struggle, discuss among themselves
- Most will conflate the two

**THE ANSWER:**
> **Blockchain** = decentralized, shared, immutable digital ledger. The **infrastructure**.
> **Cryptocurrency** = a digital asset that lives on a blockchain. What's **built on top**.

**The nuance:**
- Blockchain **must** have a cryptocurrency → L1 tokens (ETH, BTC) - you pay transactions with these
- Cryptocurrency **can** live without its own blockchain → project tokens (UNI, LINK, etc.) - just code on someone else's chain

The key insight: The blockchain can be valuable. The cryptocurrency is usually garbage.

---

🎤 **"Who here owns or has ever owned a cryptocurrency?"**
- Show of hands, gauge the room

🎤 **"Who knows someone who made serious money trading crypto?"**
- Everyone knows someone → they're hooked

---

### 1.2 The Uncomfortable Truth: Cryptocurrency is a Scam

**The Numbers:**
- 11.6 million cryptocurrencies exist
- Most are worth $0 today
- Assume 99.9999% are scams

**Two Types of Scams:**

| Type | Description | Examples |
|------|-------------|----------|
| **Type 1: Explicit** | "I will steal your money" | Rug pulls, exit scams, Ponzis |
| **Type 2: Implicit** | "I will lie about my tech" | VC-funded, low float / high FDV garbage |

**Type 2 Examples:**
- **Cardano** - academic theater, no real usage
- **Ripple** - centralized bank coin cosplaying as crypto

**Plot Twist: Even "Legit" Tokens Are Often Worthless**
- UNI (Uniswap) - great protocol, what's the token for?
  - "Governance? What are we governing? The fee switch? *Garbage.*"
- Even ETH itself - "It's for gas? How much gas do I really need?"

**🎯 TAKEAWAY:** Assume any cryptocurrency is a scam until proven otherwise. You'll be right 99.9999% of the time.

---

### 1.3 The Middleman Problem

**They Take Because They Can**

| Middleman | What They Take | Why? |
|-----------|----------------|------|
| Banks | FX fees, conversion fees, % flat on income | Because they can |
| Apple App Store | 30% | Monopoly |
| Google Play Store | 30% | Monopoly |
| Spotify | Massive cut from artists | Platform lock-in |
| Visa/Mastercard | 2-3% every transaction | Infrastructure monopoly |

**Personal Story:**
> "I received USD as a freelancer. My bank took a percentage flat on my income. Then they charged me AGAIN on conversion. Why? Because what was I going to do - ask for cash?"

🎤 **"What can you do about it? Nothing. That's the point."**

**The Nuclear Option - They Have a Switch**
- Russia invaded Ukraine (which sucks)
- Global response: freeze Russian assets
- The point isn't politics - it's that **the switch exists**
- Many people who aren't war criminals have been cut off because someone powerful decided
- Your money is yours only as long as they let it be

🎤 **"How many of you have ever felt powerless against a platform or institution?"**

---

### 1.4 The Pivot

🎤 **"So if crypto is all scams, and the system is rigged... why am I standing here?"**

*(Pause. Let the tension build.)*

**The Hierarchy (my opinion):**
1. **Ethereum**
2. ........................ *(huge gap)*
3. Maybe Bitcoin
4. Maybe Solana
5. Everything else: noise

**This is where we separate the coin from the computer.**

---

### 1.5 ETHEREUM = FREEDOM

**Freedom to own your money** - no one can freeze it, seize it, or skim from it.

**Freedom from middlemen** - no gatekeepers, no permission needed.

**Freedom to build** - deploy code that runs exactly as written, forever.

---

### 1.6 Why Ethereum? The Origin Story

**Vitalik Buterin's Red Pill Moment:**
> "I was playing World of Warcraft. Blizzard nerfed my character's ability. I cried myself to sleep. That day I realized what centralized services can do. They can change the rules whenever they want."

- A teenager's gaming rage → a $300B+ network
- He didn't ask permission. He built an alternative.

**My Shining Eyes Moment:**
> "My company's token was garbage. Price kept dropping. To increase demand, we needed to list on a big exchange.
>
> They wanted $1 million. ONE MILLION. Just to list.
>
> Then Uniswap V1 launched. We deployed our own liquidity. No permission. No million dollars. Just code.
>
> That was the moment I understood: Ethereum isn't about getting rich. It's about **nobody being able to stop you**."

---

### 1.7 Being Fair: Ethereum Isn't Perfect

**Vitalik is Built Different:**
- He criticizes Ethereum publicly
- Admits mistakes, discusses tradeoffs openly
- Compare to other founders: Cardano's Charles, Ripple's... whoever - they just lie

🎤 **"When was the last time you saw a CEO publicly criticize their own product?"**

This intellectual honesty **is** the culture.

---

### 1.8 The Culture of Sharing

**Airdrops - More Than Free Money:**
- UNI airdrop: $12k+ to every early user
- ENS, dYdX, Optimism, Arbitrum, Hyperliquid... many such cases
- The philosophy: reward **users**, not VCs

**But It's Bigger Than Money:**
- Every Ethereum conference: people sharing knowledge freely
- "I've sent Twitter DMs to developers with 100k+ followers. People who owe me nothing. They always responded. **Always.**"
- This doesn't happen in other industries

---

### 1.9 THE CLOSE: What's In It For You?

**Transition:** Okay, enough philosophy. Let's talk about YOUR career.

**Work on the Edge:**
- Solve problems that haven't been solved
- NOT another B2B SaaS with corporate bullshit
- You're 4th year CS - you can build CRUD apps at a corpo, or you can build the future

**The Money:**
- Paid significantly above market rate
- Freedom to work from anywhere
- Remote-first culture by default

**The Community:**
- Built different, from the top down
- Meritocracy: your code speaks, not your credentials
- Open source by default

**The Code Itself:**

🎤 **"How many of you hate overengineered Java enterprise bullshit?"**

*(Wait for nods, laughs)*

In Solidity:
- Bad code = more gas = **literally more expensive**
- You can MEASURE code quality with a number
- No `AbstractFactoryBuilderPatternManagerInterface`
- Every line costs real money

*(Grain of salt: don't go full assembly/Yul - security matters too)*

---

### 1.10 The Pitch

> "In the next hour, we're going to play a Capture The Flag game. You'll see real Solidity code. By the end of today, you'll understand how smart contracts work.
>
> By next week, if you want, you could deploy your first contract.
>
> **The only barrier is you.**"

---

## PART 2: Capture The Flag (~60 minutes)
*(Hands-on Solidity, DeFi concepts, live hacking)*

---

## INTERACTIVE MOMENTS SUMMARY

| # | Question | Purpose |
|---|----------|---------|
| 1 | "What is the difference between cryptocurrency and blockchain?" | Engage, expose knowledge gap |
| 2 | "Who here owns or has owned crypto?" | Gauge room, build connection |
| 3 | "Who knows someone who made serious money trading?" | Everyone does → hook them |
| 4 | "What can you do about it? Nothing." | Rhetorical punch, build frustration |
| 5 | "How many of you have felt powerless against a platform?" | Personal connection |
| 6 | "So if it's all scams... why am I here?" | Create tension before pivot |
| 7 | "When was the last time a CEO criticized their own product?" | Highlight Ethereum's culture |
| 8 | "How many of you hate overengineered Java bullshit?" | Laugh, connect as devs |

---

## PREPARATION NOTES

**Anticipate pushback:**
- "My friend made money on Solana memecoins" → Making money ≠ not a scam. Casinos pay out too.
- "What about Bitcoin?" → Bitcoin is digital gold. Ethereum is a world computer. Different thesis.
- "Isn't Ethereum also centralized?" → Vitalik has influence, not control. The DAO fork was community consensus.

**Energy:**
- These students are used to NPC lecturers
- Be provocative, be real, be yourself
- Stories > statistics

**Goal check:**
- Plant seed in at least 2 students
- Shining eyes > comprehension
- They should leave thinking "holy shit, I need to learn more"
