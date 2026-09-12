import { useState, useEffect } from "react";
import { type ModuleSummary } from "../api/modules";
import { useAuth } from "../context/AuthContext";
import ModuleCard from "../components/dashboard/ModuleCard";
import InheritanceConnector from "../components/dashboard/InheritanceConnector";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, logout, authFetch } = useAuth();
  const [modules, setModules] = useState<ModuleSummary[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadModules() {
      const result = await authFetch<ModuleSummary[]>("Modules");
      if (result.success && result.data) {
        setModules(result.data);
      } else {
        setError(result.message);
      }
      setIsLoading(false);
    }
    loadModules();
  }, []);

  return (
    <div className="min-h-screen bg-ink">
      <header className="flex items-center justify-between border-b border-line px-6 py-4 sm:px-10">
        <div className="font-mono text-xs text-steel">
          OOPMentor<span className="text-line">.</span>Dashboard
        </div>
        <div className="flex items-center gap-4 font-mono text-xs">
          <span className="text-paper">{user?.displayName}</span>
          <button
            type="button"
            onClick={logout}
            className="text-steel transition-colors hover:text-ignition"
          >
            logout()
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-6 py-14 sm:px-10">
        {isLoading && (
          <p className="font-mono text-sm text-steel">
            Curriculum<span className="text-line">.</span>load()
            <span className="animate-pulse text-ignition">_</span>
          </p>
        )}

        {!isLoading && error && (
          <div role="alert" className="border-l-2 border-rust bg-rust/10 px-3 py-2 text-sm text-paper">
            {error}
          </div>
        )}

        {!isLoading && !error && modules && modules.length === 0 && (
          <p className="font-mono text-sm text-steel">
            No modules yet — check back once your instructor seeds the curriculum.
          </p>
        )}

        {!isLoading && !error && modules && modules.length > 0 && (
          <div className="flex flex-col">
            {modules.map((module, index) => (
              <div key={module.moduleNumber}>
                {index > 0 && <InheritanceConnector />}
                <Link to={`/module/${module.moduleNumber}/exercises`}>
                  <ModuleCard module={module} index={index} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
