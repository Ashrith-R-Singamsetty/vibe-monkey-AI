export function createFaviconSVG() {
  return `
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#9333ea" />
          <stop offset="100%" stop-color="#ec4899" />
        </linearGradient>
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#06b6d4" />
          <stop offset="100%" stop-color="#3b82f6" />
        </linearGradient>
      </defs>
      
      <!-- Main Monkey Head Circle -->
      <circle cx="50" cy="45" r="30" fill="url(#logoGradient)" />
      
      <!-- Monkey Ears -->
      <circle cx="32" cy="30" r="12" fill="url(#logoGradient)" />
      <circle cx="68" cy="30" r="12" fill="url(#logoGradient)" />
      <circle cx="32" cy="30" r="7" fill="white" opacity="0.3" />
      <circle cx="68" cy="30" r="7" fill="white" opacity="0.3" />
      
      <!-- Eyes -->
      <circle cx="42" cy="40" r="4" fill="white" />
      <circle cx="58" cy="40" r="4" fill="white" />
      <circle cx="43" cy="39" r="2" fill="#1f2937" />
      <circle cx="59" cy="39" r="2" fill="#1f2937" />
      
      <!-- Eye Shine -->
      <circle cx="44" cy="38" r="0.5" fill="white" />
      <circle cx="60" cy="38" r="0.5" fill="white" />
      
      <!-- Nose -->
      <ellipse cx="50" cy="50" rx="2" ry="1.5" fill="#1f2937" />
      
      <!-- Mouth -->
      <path d="M 45 55 Q 50 60 55 55" stroke="#1f2937" stroke-width="2" fill="none" stroke-linecap="round" />
      
      <!-- AI Circuit Pattern -->
      <g stroke="url(#accentGradient)" stroke-width="1.5" fill="none" opacity="0.8">
        <path d="M 20 75 L 30 75 L 35 80 L 45 80" stroke-linecap="round" />
        <path d="M 55 80 L 65 80 L 70 75 L 80 75" stroke-linecap="round" />
        <path d="M 35 85 L 40 85 L 45 90 L 55 90 L 60 85 L 65 85" stroke-linecap="round" />
        
        <circle cx="30" cy="75" r="2" fill="url(#accentGradient)" />
        <circle cx="70" cy="75" r="2" fill="url(#accentGradient)" />
        <circle cx="40" cy="85" r="1.5" fill="url(#accentGradient)" />
        <circle cx="60" cy="85" r="1.5" fill="url(#accentGradient)" />
        <circle cx="50" cy="90" r="1.5" fill="url(#accentGradient)" />
      </g>
      
      <!-- Neural Network Dots -->
      <g fill="url(#accentGradient)" opacity="0.6">
        <circle cx="25" cy="65" r="1" />
        <circle cx="75" cy="65" r="1" />
        <circle cx="20" cy="85" r="1" />
        <circle cx="80" cy="85" r="1" />
      </g>
    </svg>
  `;
}

// Generate favicon data URL
export function getFaviconDataURL() {
  const svgString = createFaviconSVG();
  const encoded = encodeURIComponent(svgString);
  return `data:image/svg+xml,${encoded}`;
}