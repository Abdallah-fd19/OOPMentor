// Shown while ProtectedRoute is waiting on the silent session-restore check —
// same monospace/code language as the rest of the auth screens, not a generic spinner.
export default function SessionLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink">
      <p className="font-mono text-sm text-steel">
        Session<span className="text-line">.</span>restore()
        <span className="animate-pulse text-ignition">_</span>
      </p>
    </div>
  );
}
