interface Props {
  className?: string;
  withWordmark?: boolean;
}

export default function BookItLogo({ className = 'h-10 w-10', withWordmark = false }: Props) {
  return (
    <div className="flex items-center gap-2">
      <svg
        viewBox="0 0 64 64"
        className={className}
        role="img"
        aria-label="BookIt logo"
      >
        <defs>
          <linearGradient id="bookitGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="55%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#f5b62e" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="56" height="56" rx="18" fill="url(#bookitGrad)" />
        <path
          d="M18 20c0-1.7 1.3-3 3-3h9c1.7 0 3 1.3 3 3v24l-7.5-4.2L18 44V20z"
          fill="#fff"
          opacity="0.95"
        />
        <path
          d="M46 20c0-1.7-1.3-3-3-3h-2c-1.7 0-3 1.3-3 3v24l4-2.4 4 2.4V20z"
          fill="#fff"
          opacity="0.8"
        />
        <circle cx="47" cy="17" r="4" fill="#fde68a" />
      </svg>
      {withWordmark && (
        <span className="font-display text-2xl font-extrabold tracking-tight text-ink-900">
          Book<span className="text-quest-purple">It</span>
        </span>
      )}
    </div>
  );
}
