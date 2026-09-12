// Hollow-triangle inheritance arrow between two module boxes — same UML
// convention GhostDiagram uses, made solid/opaque here between real content.
export default function InheritanceConnector() {
  return (
    <svg width="24" height="32" viewBox="0 0 24 32" aria-hidden="true" className="ml-6">
      <path d="M 12 4 L 6 16 L 18 16 Z" fill="#14171C" stroke="#7C8798" strokeWidth="1" />
      <line x1="12" y1="16" x2="12" y2="32" stroke="#2E3542" strokeWidth="1" />
    </svg>
  );
}
