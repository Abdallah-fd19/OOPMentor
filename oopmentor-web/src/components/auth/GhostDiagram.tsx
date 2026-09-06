// Faint, non-interactive UML class diagram used as page chrome on the auth screens.
// Echoes the product's own live class-diagram feature rather than decorating with stock art.
export default function GhostDiagram() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute left-6 top-1/2 hidden h-[560px] w-[520px] -translate-y-1/2 opacity-[0.35] md:block lg:left-16"
      viewBox="0 0 520 560"
      fill="none"
    >
      {/* Vehicle (abstract base) */}
      <g stroke="#7C8798" strokeWidth="1">
        <rect x="150" y="24" width="180" height="96" />
        <line x1="150" y1="56" x2="330" y2="56" />
        <line x1="150" y1="80" x2="330" y2="80" />
      </g>
      <text x="240" y="44" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="13" fill="#E8E6DF" fontStyle="italic">
        Vehicle
      </text>
      <text x="160" y="71" fontFamily="'JetBrains Mono', monospace" fontSize="10" fill="#7C8798">
        # speed: int
      </text>
      <text x="160" y="94" fontFamily="'JetBrains Mono', monospace" fontSize="10" fill="#7C8798">
        + accelerate()
      </text>

      {/* IDrivable interface */}
      <g stroke="#7C8798" strokeWidth="1" strokeDasharray="3 3">
        <rect x="16" y="220" width="150" height="72" />
        <line x1="16" y1="252" x2="166" y2="252" />
      </g>
      <text x="91" y="240" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="11" fill="#E8E6DF">
        «interface»
      </text>
      <text x="91" y="270" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="12" fill="#E8E6DF">
        IDrivable
      </text>

      {/* Car */}
      <g stroke="#7C8798" strokeWidth="1">
        <rect x="150" y="220" width="170" height="104" />
        <line x1="150" y1="252" x2="320" y2="252" />
        <line x1="150" y1="276" x2="320" y2="276" />
      </g>
      <text x="235" y="240" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="13" fill="#E8E6DF">
        Car
      </text>
      <text x="160" y="267" fontFamily="'JetBrains Mono', monospace" fontSize="10" fill="#7C8798">
        - fuel: double
      </text>
      <text x="160" y="291" fontFamily="'JetBrains Mono', monospace" fontSize="10" fill="#7C8798">
        + brake()
      </text>

      {/* SportsCar */}
      <g stroke="#7C8798" strokeWidth="1">
        <rect x="196" y="416" width="150" height="72" />
        <line x1="196" y1="448" x2="346" y2="448" />
      </g>
      <text x="271" y="436" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="12" fill="#E8E6DF">
        SportsCar
      </text>
      <text x="206" y="466" fontFamily="'JetBrains Mono', monospace" fontSize="10" fill="#7C8798">
        + accelerate()
      </text>

      {/* inheritance: Car -> Vehicle (hollow triangle) */}
      <line x1="240" y1="220" x2="240" y2="128" stroke="#7C8798" strokeWidth="1" />
      <path d="M 240 120 L 233 132 L 247 132 Z" fill="#14171C" stroke="#7C8798" strokeWidth="1" />

      {/* realization: Car -> IDrivable (dashed, hollow triangle) */}
      <line x1="150" y1="270" x2="168" y2="256" stroke="#7C8798" strokeWidth="1" strokeDasharray="3 3" />
      <path d="M 166 250 L 156 256 L 168 262 Z" fill="#14171C" stroke="#7C8798" strokeWidth="1" />

      {/* inheritance: SportsCar -> Car */}
      <line x1="271" y1="416" x2="255" y2="324" stroke="#7C8798" strokeWidth="1" />
      <path d="M 253 316 L 249 330 L 263 328 Z" fill="#14171C" stroke="#7C8798" strokeWidth="1" />
    </svg>
  );
}
