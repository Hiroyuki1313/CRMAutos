import { LucideIcon } from "lucide-react";

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon?: LucideIcon;
  isLoading?: boolean;
}

/**
 * @name AuthButton
 * @description A high-impact button for authentication actions.
 * Implements premium hover states and loading transitions.
 */
export const AuthButton = ({ label, icon: Icon, isLoading, ...props }: AuthButtonProps) => {
  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={`
        font-bold rounded-xl bg-[var(--color-primary)] 
        hover:bg-[var(--color-primary)]/90 hover:shadow-[0_0_20px_rgba(203,213,225,0.1)]
        active:scale-[0.98] disabled:opacity-50 transition-all duration-300 
        text-[var(--color-primary-dark)] text-lg flex items-center justify-center gap-3 p-5 w-full 
        shadow-xl shadow-[var(--color-primary)]/10
        ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="size-5 border-2 border-[var(--color-primary-dark)] border-t-transparent rounded-full animate-spin" />
          <span>Validando...</span>
        </div>
      ) : (
        <>
          {Icon && <Icon className="size-6 transition-transform group-hover:translate-x-1" />}
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
