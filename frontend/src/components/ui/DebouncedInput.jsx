import { useEffect, useState } from "react";

// PRD section 12 checklist: "Debounce search/filter inputs (300ms) to avoid
// excessive API calls." Typing stays instant (local state); onChange only
// fires — and only triggers a URL/query update — after the user pauses.
export default function DebouncedInput({ value, onChange, delay = 300, ...props }) {
  const [localValue, setLocalValue] = useState(value ?? "");

  useEffect(() => {
    setLocalValue(value ?? "");
  }, [value]);

  useEffect(() => {
    if (localValue === (value ?? "")) return;
    const timer = setTimeout(() => onChange(localValue), delay);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localValue]);

  return <input {...props} value={localValue} onChange={(e) => setLocalValue(e.target.value)} />;
}
