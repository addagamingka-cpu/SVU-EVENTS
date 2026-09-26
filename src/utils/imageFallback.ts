/**
 * Standalone offline-safe SVG Fallback Assets
 * Prevents blank images and broken assets on GitHub Pages or restricted networks.
 */

// Official SVU University Seal / Crest (Self-contained SVG Data URI)
export const DEFAULT_SVU_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="crestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23fea619"/>
      <stop offset="100%" stop-color="%23855300"/>
    </linearGradient>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23003222"/>
      <stop offset="100%" stop-color="%230d4a36"/>
    </linearGradient>
  </defs>
  <circle cx="60" cy="60" r="56" fill="url(%23bgGrad)" stroke="url(%23crestGrad)" stroke-width="4"/>
  <circle cx="60" cy="60" r="48" fill="none" stroke="%23fea619" stroke-width="1.5" stroke-dasharray="4,2"/>
  <path d="M60 22 L68 38 L86 40 L72 52 L76 70 L60 60 L44 70 L48 52 L34 40 L52 38 Z" fill="url(%23crestGrad)"/>
  <circle cx="60" cy="60" r="18" fill="%23003222" stroke="%23fea619" stroke-width="2"/>
  <text x="60" y="65" font-family="sans-serif" font-size="13" font-weight="900" fill="%23fea619" text-anchor="middle">SVU</text>
  <path d="M35 88 Q60 82 85 88" stroke="%23fea619" stroke-width="2" fill="none"/>
  <text x="60" y="98" font-family="sans-serif" font-size="8" font-weight="700" fill="%23ffffff" letter-spacing="1" text-anchor="middle">ESTD 2019</text>
</svg>`;

// Vibrant Collegiate Campus Fest Hero Banner (16:9 1280x720 SVG Data URI)
export const DEFAULT_CAMPUS_BANNER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23051e15"/>
      <stop offset="50%" stop-color="%23003222"/>
      <stop offset="100%" stop-color="%230d4a36"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="%23fea619"/>
      <stop offset="50%" stop-color="%23ffddb8"/>
      <stop offset="100%" stop-color="%23fea619"/>
    </linearGradient>
    <radialGradient id="lightGlow" cx="50%" cy="30%" r="50%">
      <stop offset="0%" stop-color="%23fea619" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="%23000000" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1280" height="720" fill="url(%23skyGrad)"/>
  <circle cx="640" cy="220" r="400" fill="url(%23lightGlow)"/>
  
  <!-- Campus Skyline Silhouette -->
  <path d="M0 560 L120 540 L160 480 L220 480 L240 560 L380 560 L420 440 L460 400 L500 440 L540 560 L680 560 L720 380 L760 340 L800 380 L840 560 L980 560 L1020 460 L1080 460 L1120 560 L1280 540 L1280 720 L0 720 Z" fill="%23002115" opacity="0.95"/>
  
  <!-- Central University Tower -->
  <rect x="580" y="300" width="120" height="260" fill="%2300180f"/>
  <polygon points="640,220 570,300 710,300" fill="%23fea619" opacity="0.85"/>
  <circle cx="640" cy="360" r="28" fill="%23fea619" opacity="0.9"/>
  <circle cx="640" cy="360" r="24" fill="%2300180f"/>
  <text x="640" y="366" font-family="sans-serif" font-size="16" font-weight="900" fill="%23fea619" text-anchor="middle">SVU</text>

  <!-- Campus Festival Laser & Lights -->
  <line x1="640" y1="220" x2="180" y2="40" stroke="%23fea619" stroke-width="3" opacity="0.6"/>
  <line x1="640" y1="220" x2="1100" y2="40" stroke="%236ffbbe" stroke-width="3" opacity="0.6"/>
  <line x1="640" y1="220" x2="380" y2="20" stroke="%23ffddb8" stroke-width="2" opacity="0.5"/>
  <line x1="640" y1="220" x2="900" y2="20" stroke="%23fea619" stroke-width="2" opacity="0.5"/>

  <!-- Fest Confetti / Star Sparkles -->
  <circle cx="280" cy="180" r="5" fill="%23fea619"/>
  <circle cx="340" cy="120" r="3" fill="%23ffffff"/>
  <circle cx="940" cy="140" r="4" fill="%236ffbbe"/>
  <circle cx="1020" cy="200" r="6" fill="%23fea619"/>
  <circle cx="500" cy="160" r="4" fill="%23ffffff"/>
  <circle cx="780" cy="150" r="5" fill="%23ffddb8"/>

  <!-- Foreground Overlay Text & Ribbon -->
  <rect x="0" y="580" width="1280" height="140" fill="%2300150d" opacity="0.8"/>
  <text x="640" y="640" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="900" fill="url(%23accentGrad)" text-anchor="middle" letter-spacing="3">SWAMI VIVEKANANDA UNIVERSITY</text>
  <text x="640" y="680" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" fill="%2399d3b8" text-anchor="middle" letter-spacing="1">Barrackpore Campus • Official Event Portal</text>
</svg>`;

// Hackathon / Tech Banner
export const HACKATHON_BANNER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <defs>
    <linearGradient id="techBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%2307131e"/>
      <stop offset="50%" stop-color="%23002619"/>
      <stop offset="100%" stop-color="%230b3d2b"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(%23techBg)"/>
  <g opacity="0.2" stroke="%236ffbbe" stroke-width="1">
    <line x1="0" y1="120" x2="1280" y2="120"/><line x1="0" y1="240" x2="1280" y2="240"/>
    <line x1="0" y1="360" x2="1280" y2="360"/><line x1="0" y1="480" x2="1280" y2="480"/>
    <line x1="0" y1="600" x2="1280" y2="600"/>
    <line x1="160" y1="0" x2="160" y2="720"/><line x1="320" y1="0" x2="320" y2="720"/>
    <line x1="480" y1="0" x2="480" y2="720"/><line x1="640" y1="0" x2="640" y2="720"/>
    <line x1="800" y1="0" x2="800" y2="720"/><line x1="960" y1="0" x2="960" y2="720"/>
    <line x1="1120" y1="0" x2="1120" y2="720"/>
  </g>
  <text x="640" y="330" font-family="monospace" font-size="64" font-weight="900" fill="%236ffbbe" text-anchor="middle" letter-spacing="4">&lt;HACK SVU 2026/&gt;</text>
  <text x="640" y="410" font-family="system-ui, sans-serif" font-size="28" font-weight="800" fill="%23fea619" text-anchor="middle">36-HOUR INTER-COLLEGE CODE HACKATHON</text>
  <text x="640" y="470" font-family="system-ui, sans-serif" font-size="20" font-weight="600" fill="%23ffffff" text-anchor="middle">Artificial Intelligence • Web3 • Cloud Innovation</text>
</svg>`;

/**
 * Image error handler that gracefully recovers to inline SVG
 */
export function handleImageFallback(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackUrl: string = DEFAULT_CAMPUS_BANNER
) {
  const target = event.currentTarget;
  if (target.src !== fallbackUrl) {
    target.src = fallbackUrl;
  }
}
