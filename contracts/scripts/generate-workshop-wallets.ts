import { Wallet } from "ethers";
import { writeFileSync } from "fs";
import QRCode from "qrcode";

const COUNT = 50;

async function main() {
  const wallets: { address: string; privateKey: string; qrSvg: string }[] = [];

  for (let i = 0; i < COUNT; i++) {
    const w = Wallet.createRandom();
    const qrSvg = await QRCode.toString(w.privateKey, {
      type: "svg",
      margin: 1,
      width: 150,
      errorCorrectionLevel: "L",
    });
    wallets.push({
      address: w.address,
      privateKey: w.privateKey,
      qrSvg,
    });
  }

  // Save JSON for reference (without SVGs)
  writeFileSync(
    "workshop-wallets.json",
    JSON.stringify(
      wallets.map((w) => ({ address: w.address, privateKey: w.privateKey })),
      null,
      2
    )
  );

  // Export addresses for Solidity
  const addressList = wallets.map((w) => w.address).join(",\n        ");
  writeFileSync(
    "workshop-addresses.txt",
    `// Paste into your contract constructor or whitelist function:\n\naddress[] memory participants = [\n        ${addressList}\n    ];`
  );

  // Generate printable HTML with embedded SVG QR codes
  const cards = wallets
    .map(
      (w, i) => `
    <div class="card">
      ${w.qrSvg}
      <div class="num">#${i + 1}</div>
    </div>`
    )
    .join("\n");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Workshop Wallets - Print Me</title>
  <style>
    @page {
      size: A4;
      margin: 3mm;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      width: 210mm;
      font-family: monospace;
      font-size: 10px;
    }
    .no-print {
      padding: 10px;
      background: #fffde7;
      margin-bottom: 10px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 0;
    }
    .card {
      border: 0.5px dashed #ccc;
      padding: 2mm;
      text-align: center;
      height: 37mm;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .card svg {
      width: 25mm;
      height: 25mm;
    }
    .card .num {
      font-size: 8px;
      color: #666;
      margin-top: 1mm;
    }
    @media print {
      .no-print { display: none; }
      body { width: 100%; }
    }
  </style>
</head>
<body>
  <div class="no-print">
    <strong>Instructions:</strong> Print (Ctrl+P / Cmd+P) → A4 → Margins: "None" → Print. Cut along dashed lines.
  </div>
  <div class="grid">
${cards}
  </div>
</body>
</html>`;

  writeFileSync("workshop-wallets.html", html);

  // Summary
  console.log(`\n✅ Generated ${COUNT} wallets\n`);
  console.log("Files created:");
  console.log("  - workshop-wallets.json    (addresses + private keys)");
  console.log("  - workshop-wallets.html    (open & print)");
  console.log("  - workshop-addresses.txt   (for your contract)\n");
  console.log("Addresses:");
  wallets.forEach((w, i) => console.log(`${i + 1}. ${w.address}`));
}

main();
