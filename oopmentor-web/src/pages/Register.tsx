import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthShell from "../components/auth/AuthShell";
import CodeField from "../components/auth/CodeField";

export default function Register() {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await register({ email, displayName, password });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/dashboard");
  }

  return (
    <AuthShell>
      <form onSubmit={handleSubmit} className="border border-line bg-panel">
        <div className="px-6 py-5">
          <p className="font-mono text-[22px] leading-tight text-paper">
            new <span className="text-ignition">Student</span>
            <span className="text-steel">()</span>
          </p>
          <p className="mt-1.5 text-sm text-steel">
            Every learner starts as a new instance.
          </p>
        </div>

        <div className="h-px w-full bg-line anim-auth-divider" style={{ animationDelay: "0.3s" }} />

        <div className="space-y-5 px-6 py-6">
          <CodeField
            id="displayName"
            name="displayName"
            fieldType="string"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Ada Lovelace"
            autoComplete="name"
            required
          />
          <CodeField
            id="email"
            name="email"
            fieldType="string"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ada@oopmentor.dev"
            autoComplete="email"
            required
          />
          <CodeField
            id="password"
            name="password"
            fieldType="string"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            required
          />

          {error && (
            <div role="alert" className="border-l-2 border-rust bg-rust/10 px-3 py-2 text-sm text-paper">
              {error}
            </div>
          )}
        </div>

        <div className="h-px w-full bg-line anim-auth-divider" style={{ animationDelay: "0.45s" }} />

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 py-3.5 font-mono text-[15px] text-paper transition-colors hover:bg-panel-raised hover:text-ignition disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span aria-hidden="true">▶</span>
            {isSubmitting ? "Constructing…" : "new Student()"}
          </button>
        </div>
      </form>

      <p className="mt-5 text-center text-sm text-steel">
        Already have an instance?{" "}
        <Link
          to="/login"
          className="text-paper underline decoration-line underline-offset-4 hover:text-ignition hover:decoration-ignition"
        >
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
