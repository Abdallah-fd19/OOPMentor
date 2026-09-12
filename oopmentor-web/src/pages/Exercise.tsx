import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { type ExerciseDetail } from "../api/exercises";
import { Link, useParams } from "react-router-dom";
import SessionLoader from "../components/auth/SessionLoader";

const DIFFICULTY_LABELS: Record<number, string> = {
    1: "Beginner",
    2: "Intermediate",
    3: "Advanced",
};

export default function Exercise(){
    const { exerciseNumber } = useParams();
    const { authFetch } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [exercise, setExercise] = useState<ExerciseDetail | null>(null);

    useEffect(()=>{
        async function getExercise() {
            const result = await authFetch<ExerciseDetail>(`Exercises/${exerciseNumber}`);
            if (result.success && result.data){
                setExercise(result.data);
            }
            else{
                setError(result.message);
            }
            setIsLoading(false);
        }
        getExercise()
    }, [exerciseNumber])

    if (isLoading) {
        return <SessionLoader />;
    }

    if (error || !exercise) {
        return (
            <div className="min-h-screen bg-ink px-6 py-14 sm:px-10">
                <div role="alert" className="mx-auto max-w-xl border-l-2 border-rust bg-rust/10 px-3 py-2 text-sm text-paper">
                    {error ?? "Exercise not found."}
                </div>
            </div>
        );
    }

    const progress = exercise.exerciseProgress;
    const code = progress?.lastSubmittedCode ?? exercise.starterCode;

    return (
        <div className="min-h-screen bg-ink">
            <header className="border-b border-line px-6 py-4 sm:px-10">
                <Link
                    to={`/module/${exercise.moduleNumber}/exercises`}
                    className="font-mono text-xs text-steel transition-colors hover:text-ignition"
                >
                    OOPMentor<span className="text-line">.</span>Module{exercise.moduleNumber}
                </Link>
            </header>

            <main className="mx-auto max-w-2xl px-6 py-14 sm:px-10">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="font-mono text-lg text-paper">{exercise.title}</h1>
                    <span className="font-mono text-xs text-steel">
                        {DIFFICULTY_LABELS[exercise.difficultyLevel] ?? "Unknown"}
                    </span>
                </div>

                {progress && (
                    <p className="mb-6 font-mono text-xs text-steel">
                        {progress.status} · {progress.attemptsCount} attempt(s) · {progress.hintsUsedCount} hint(s)
                        {progress.isCompleted && <span className="text-sage"> · completed</span>}
                    </p>
                )}

                <p className="mb-8 whitespace-pre-wrap text-sm leading-relaxed text-paper">
                    {exercise.description}
                </p>

                <pre className="overflow-x-auto border border-line bg-panel p-4 font-mono text-[13px] text-paper">
                    {code}
                </pre>
            </main>
        </div>
    );
}
