import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const OPTIONS = [
  { value: "system", label: "System theme", icon: Monitor },
  { value: "light", label: "Light mode", icon: Sun },
  { value: "dark", label: "Dark mode", icon: Moon },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div role="radiogroup" aria-label="Theme" className="flex items-center rounded-full border border-slate-200 p-0.5">
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => setTheme(value)}
            className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
              active ? "bg-primary text-white" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
