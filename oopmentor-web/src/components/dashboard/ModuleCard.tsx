import { MODULE_TITLES, type ModuleSummary } from "../../api/modules";

interface ModuleCardProps {
  module: ModuleSummary;
  index: number;
}

// A module rendered as its own UML class box: title as the class name,
// progress as declared fields — echoing the auth screens' code metaphor
// rather than a generic stat card.
export default function ModuleCard({ module, index }: ModuleCardProps) {
  const title = MODULE_TITLES[module.moduleNumber] ?? `Module ${module.moduleNumber}`;
  const className = title.replace(/[^A-Za-z]/g, "");
  const hasExercises = module.exerciseCount > 0;
  const isComplete = hasExercises && module.completedCount >= module.exerciseCount;
  const progress = hasExercises ? module.completedCount / module.exerciseCount : 0;
  const accent = isComplete ? "text-sage" : "text-ignition";
  const fillColor = isComplete ? "bg-sage" : "bg-ignition";

  return (
    <div
      className="anim-rise-in border border-line bg-panel"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="px-5 py-4">
        <p className="font-mono text-[15px] text-paper">
          class <span className={accent}>{className}</span>
          <span className="text-steel"> // Module {module.moduleNumber}</span>
        </p>
      </div>

      <div className="h-px w-full bg-line" />

      <div className="space-y-2 px-5 py-4">
        <p className="font-mono text-[13px] text-steel">
          <span className="text-line">-</span> exercises: <span className="text-steel/70">int</span> = {module.exerciseCount}
        </p>
        <p className="font-mono text-[13px] text-steel">
          <span className="text-line">-</span> completed: <span className="text-steel/70">int</span> = {module.completedCount}
        </p>
      </div>

      <div className="h-px w-full bg-line" />

      <div className="px-5 py-3">
        <div className="h-1.5 w-full bg-line/60">
          <div className={`h-full ${fillColor}`} style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
      </div>
    </div>
  );
}
