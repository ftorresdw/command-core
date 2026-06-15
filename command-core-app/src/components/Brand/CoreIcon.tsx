type CoreIconProps = {
  className?: string
}

export function CoreIcon(props: CoreIconProps) {
  return (
    <svg
      className={props.className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2.5" strokeDasharray="18 10" />
      <circle cx="20" cy="20" r="11" stroke="var(--ai-cyan)" strokeWidth="2.5" />
      <circle cx="20" cy="20" r="4.5" fill="var(--accent-orange)" />
    </svg>
  )
}
