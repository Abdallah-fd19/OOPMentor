import type { ReactNode } from "react";
import GhostDiagram from "./GhostDiagram";

interface AuthShellProps {
  children: ReactNode;
}

// Shared page chrome for the Login and Register screens: the dark canvas,
// the faint background class diagram, and the namespace mark. Both screens
// render their own class-box card as children so the shell stays presentational.
export default function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-ink">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #7C8798 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="anim-auth-ghosts">
        <GhostDiagram />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col px-6 py-8 sm:px-10">
        <div className="font-mono text-xs text-steel">
          OOPMentor<span className="text-line">.</span>Auth
        </div>

        <main className="flex flex-1 items-center justify-center sm:justify-end sm:pr-[8%] lg:pr-[14%]">
          <div className="anim-auth-card w-full max-w-[420px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
