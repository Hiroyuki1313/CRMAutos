import { LucideIcon } from "lucide-react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  rightElement?: React.ReactNode;
}

/**
 * @name AuthInput
 * @description A premium input component for authentication forms.
 * Follows SRP by handling only the input representation and its localized labeling.
 */
export const AuthInput = ({ label, icon: Icon, rightElement, ...props }: AuthInputProps) => {
  return (
    <div className="flex flex-col gap-2 group">
      <label className="font-medium text-[var(--color-text-muted)] text-sm leading-5 transition-colors group-focus-within:text-[var(--color-primary)]">
        {label}
      </label>
      <div className="rounded-xl bg-[var(--color-card-bg)] border-white/10 border flex p-4 items-center gap-3 transition-all duration-300 focus-within:border-[var(--color-primary)] focus-within:bg-[var(--color-surface-bg)] focus-within:ring-4 focus-within:ring-[var(--color-primary)]/10">
        <Icon className="size-5 text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" />
        <input
          {...props}
          className="bg-transparent outline-none flex-1 text-[var(--color-text-main)] placeholder:text-zinc-700 w-full text-base"
        />
        {rightElement}
      </div>
    </div>
  );
};
