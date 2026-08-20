import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/books', label: 'My Books', icon: '📚' },
  { to: '/gameboard', label: 'Gameboard', icon: '🗺️' },
  { to: '/shop', label: 'Shop', icon: '🛍️' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

export default function Nav() {
  return (
    <>
      {/* Side nav for tablet/desktop */}
      <nav
        aria-label="Main navigation"
        className="fixed left-0 top-0 z-40 hidden h-screen w-24 flex-col items-center gap-2 border-r border-violet-100 bg-white/80 py-6 backdrop-blur md:flex lg:w-56 lg:items-stretch lg:px-4"
      >
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 rounded-2xl px-3 py-3 text-sm font-bold transition-colors lg:flex-row lg:justify-start lg:gap-3 lg:text-base ${
                isActive
                  ? 'bg-quest-purple text-white shadow-pop'
                  : 'text-ink-900/70 hover:bg-violet-50'
              }`
            }
          >
            <span aria-hidden="true" className="text-xl">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom nav for mobile */}
      <nav
        aria-label="Main navigation"
        className="fixed bottom-0 left-0 z-40 flex w-full items-stretch justify-around border-t border-violet-100 bg-white/95 py-1.5 backdrop-blur md:hidden"
      >
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-xs font-bold ${
                isActive ? 'text-quest-purple' : 'text-ink-900/60'
              }`
            }
          >
            <span aria-hidden="true" className="text-xl">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
