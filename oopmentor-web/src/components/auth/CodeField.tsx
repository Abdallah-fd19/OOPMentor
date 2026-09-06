import type { InputHTMLAttributes } from "react";

interface CodeFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  fieldType: string;
}

// A form input styled as a UML field declaration ("- name: type"), with a
// left rule that thickens and turns amber on focus — the same visual language
// the Monaco editor uses to mark the currently executing line.
export default function CodeField({ name, fieldType, id, ...inputProps }: CodeFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-mono text-[13px] text-steel">
        <span className="text-line">-</span> {name}: <span className="text-steel/70">{fieldType}</span>
      </label>
      <div className="group border-l-2 border-line pl-3 transition-colors focus-within:border-ignition">
        <input
          id={id}
          className="w-full bg-transparent py-2.5 font-mono text-[15px] text-paper outline-none placeholder:text-steel/40"
          {...inputProps}
        />
      </div>
    </div>
  );
}
