import { useState, useEffect } from "react";
import { type ExerciseSummary } from "../api/exercises";
import { MODULE_TITLES } from "../api/modules";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SessionLoader from "../components/auth/SessionLoader";

function toMethodName(title: string): string {
  const words = title.replace(/[^A-Za-z0-9\s]/g, "").split(/\s+/).filter(Boolean);
  return words
    .map((word, i) => (i === 0 ? word[0].toLowerCase() + word.slice(1) : word[0].toUpperCase() + word.slice(1)))
    .join("");
}

export default function Exercises() {
  const { moduleNumber } = useParams();
  const { authFetch } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exercises, setExercises] = useState<ExerciseSummary[] | null>(null);

  useEffect(() => {
    async function getExercises() {
      const result = await authFetch<ExerciseSummary[]>(`Modules/${moduleNumber}/exercises`);
      if (result.success && result.data) {
        setExercises(result.data);
      } else {
        setError(result.message);
      }
      setIsLoading(false);
    }
    getExercises();
  }, [moduleNumber]);

  if (isLoading) {
    return <SessionLoader />;
  }

  const title = MODULE_TITLES[Number(moduleNumber)] ?? `Module ${moduleNumber}`;
  const className = title.replace(/[^A-Za-z]/g, "");

  return (
    <div className="min-h-screen bg-ink">
      <header className="border-b border-line px-6 py-4 sm:px-10">
        <Link to="/dashboard" className="font-mono text-xs text-steel transition-colors hover:text-ignition">
          OOPMentor<span className="text-line">.</span>Dashboard
        </Link>
      </header>

      <main className="mx-auto max-w-xl px-6 py-14 sm:px-10">
        <p className="mb-6 font-mono text-[15px] text-paper">
          class <span className="text-ignition">{className}</span>
          <span className="text-steel"> // Module {moduleNumber}</span>
        </p>

        {error && (
          <div role="alert" className="border-l-2 border-rust bg-rust/10 px-3 py-2 text-sm text-paper">
            {error}
          </div>
        )}

        {!error && exercises && exercises.length === 0 && (
          <p className="font-mono text-sm text-steel">No exercises in this module yet.</p>
        )}

        {!error && exercises && exercises.length > 0 && (
          <div className="border border-line bg-panel">
            {exercises.map((exercise, index) => (
              <div key={exercise.id}>
                {index > 0 && <div className="h-px w-full bg-line" />}
                <Link
                  to={`/exercise/${exercise.id}`}
                  className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-panel-raised"
                >
                  <p className="font-mono text-[14px] text-paper">
                    <span className="text-line">+</span> {toMethodName(exercise.title)}
                    <span className="text-steel">(): void</span>
                  </p>
                  <span className={`font-mono text-xs ${exercise.isCompleted ? "text-sage" : "text-steel"}`}>
                    {exercise.isCompleted ? "done" : "pending"}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
