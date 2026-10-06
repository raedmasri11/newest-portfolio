export function CalendarIcon({ className = "calendar-icon" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="4.25" y="5.75" width="15.5" height="14" rx="3.25" />
      <path d="M8 3.75v4M16 3.75v4M4.75 10h14.5" />
    </svg>
  );
}
