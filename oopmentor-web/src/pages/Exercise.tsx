import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { type ExerciseDetail, type SubmitExerciseResponse } from "../api/exercises";
import { type SandboxExecutionResult, type SandboxRunRequest } from "../api/sandbox";
import { Link, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import SessionLoader from "../components/auth/SessionLoader";

const DIFFICULTY_LABELS: Record<number, string> = {
    1: "Beginner",
    2: "Intermediate",
    3: "Advanced",
};

export default function Exercise() {
    const { exerciseNumber } = useParams();
    const { authFetch } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [exercise, setExercise] = useState<ExerciseDetail | null>(null);

    const [code, setCode] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [runResult, setRunResult] = useState<SandboxExecutionResult | null>(null);
    const [runErrors, setRunErrors] = useState<string[] | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<SubmitExerciseResponse | null>(null);
    const [submitErrors, setSubmitErrors] = useState<string[] | null>(null);


    useEffect(() => {
        async function getExercise() {
            const result = await authFetch<ExerciseDetail>(`Exercises/${exerciseNumber}`);
            if (result.success && result.data) {
                setExercise(result.data);
                setCode(result.data.exerciseProgress?.lastSubmittedCode ?? result.data.starterCode);
            } else {
                setError(result.message);
            }
            setIsLoading(false);
        }
        getExercise();
    }, [exerciseNumber]);

    async function runCode() {
        setIsRunning(true);
        setRunResult(null);
        setRunErrors(null);

        const payload: SandboxRunRequest = { sourceCode: code };
        const result = await authFetch<SandboxExecutionResult>("Sandbox/run", "POST", payload);

        if (result.success && result.data) {
            setRunResult(result.data);
        } else {
            setRunErrors(result.errors ?? [result.message]);
        }

        setIsRunning(false);
    }

    async function submitCode() {
        setIsSubmitting(true);
        setSubmitResult(null);
        setSubmitErrors(null);

        const result = await authFetch<SubmitExerciseResponse>(
            `Exercises/${exerciseNumber}/submit`,
            "POST",
            { sourceCode: code }
        );

        if (result.success && result.data) {
            setSubmitResult(result.data);
        } else {
            setSubmitErrors(result.errors ?? [result.message]);
        }

        setIsSubmitting(false);
    }


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

                <div className="mb-3 border border-line">
                    <Editor
                        height="360px"
                        theme="vs-dark"
                        language="csharp"
                        value={code}
                        onChange={(value) => setCode(value ?? "")}
                        options={{ minimap: { enabled: false }, fontSize: 13 }}
                    />
                </div>

                <div className="mb-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={runCode}
                        disabled={isRunning}
                        className="flex items-center gap-2 border border-line bg-panel px-5 py-2.5 font-mono text-sm text-paper transition-colors hover:bg-panel-raised hover:text-ignition disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <span aria-hidden="true">▶</span>
                        {isRunning ? "Running…" : "Run"}
                    </button>
                    <button
                        type="button"
                        onClick={submitCode}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 border border-line bg-ignition/10 px-5 py-2.5 font-mono text-sm text-ignition transition-colors hover:bg-ignition/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <span aria-hidden="true">⏎</span>
                        {isSubmitting ? "Submitting…" : "Submit"}
                    </button>
                </div>


                {runErrors && (
                    <div role="alert" className="mb-6 border-l-2 border-rust bg-rust/10 px-3 py-3 text-sm text-paper">
                        <p className="mb-2 font-mono text-xs text-rust">Execution failed</p>
                        <ul className="list-inside list-disc space-y-1 font-mono text-xs">
                            {runErrors.map((err, index) => (
                                <li key={index}>{err}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {submitErrors && (
                    <div role="alert" className="mb-6 border-l-2 border-rust bg-rust/10 px-3 py-3 text-sm text-paper">
                        <p className="mb-2 font-mono text-xs text-rust">Submission failed</p>
                        <ul className="list-inside list-disc space-y-1 font-mono text-xs">
                            {submitErrors.map((err, index) => (
                                <li key={index}>{err}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {submitResult && (
                    <div className="mb-6 border-l-2 border-line bg-panel px-4 py-3">
                        <p className={`font-mono text-sm ${submitResult.isCorrect ? "text-sage" : "text-steel"}`}>
                            {submitResult.isCorrect ? "✓ Passed" : "Not passing yet"}
                        </p>
                        <p className="mt-1 font-mono text-xs text-steel">
                            {submitResult.progress.status} · attempt {submitResult.progress.attemptsCount}
                        </p>
                    </div>
                )}


                {runResult && (
                    <div className="space-y-4">
                        <div>
                            <p className="mb-2 font-mono text-xs text-steel">
                                Console output · {runResult.executionTimeMs}ms
                            </p>
                            <div className="border border-line bg-panel p-4 font-mono text-[13px] text-paper">
                                {runResult.consoleOutput.length === 0 ? (
                                    <p className="text-steel">(no output)</p>
                                ) : (
                                    runResult.consoleOutput.map((line, index) => <p key={index}>&gt; {line}</p>)
                                )}
                            </div>
                        </div>

                        {runResult.finalState.length > 0 && (
                            <div>
                                <p className="mb-2 font-mono text-xs text-steel">Object state</p>
                                <div className="divide-y divide-line border border-line bg-panel">
                                    {runResult.finalState.map((object, index) => (
                                        <div key={index} className="px-4 py-3 font-mono text-[13px]">
                                            <p className="text-paper">
                                                {object.instanceName}
                                                <span className="text-steel"> : {object.typeName}</span>
                                            </p>
                                            <div className="mt-1 space-y-0.5 pl-4">
                                                {Object.entries(object.properties).map(([key, value]) => (
                                                    <p key={key} className="text-steel">
                                                        <span className="text-ignition">{key}</span>: {value ?? "null"}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
