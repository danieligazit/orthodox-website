import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ANIMATION_CONFIG } from '../config/constants';

interface HeaderProps {
  opacity: number;
}

export function Header({ opacity }: HeaderProps) {
  return (
    <>
      {/* Header Curtain */}
      <div
        className="fixed top-0 w-full z-30 bg-[#e8e6df]"
        style={{
          height: `${ANIMATION_CONFIG.HEADER_HEIGHT}px`,
          opacity,
          willChange: 'opacity',
        }}
      />

      {/* Header Controls */}
      <div
        className="fixed top-0 w-full z-40 flex justify-between px-8 items-center mix-blend-difference text-white pointer-events-none"
        style={{
          height: `${ANIMATION_CONFIG.HEADER_HEIGHT}px`,
          opacity,
        }}
      >
        <div className="pointer-events-auto">
          <NavLink to="/about">ABOUT</NavLink>
        </div>
        <div className="pointer-events-auto">
          <NavLink to="/press">PRESS</NavLink>
        </div>
      </div>
    </>
  );
}

interface NavLinkProps {
  to?: string;
  href?: string;
  children: ReactNode;
}

function NavLink({ to, href, children }: NavLinkProps) {
  // Use React Router Link for internal routes, plain anchor for hash links
  if (to) {
    return (
      <Link
        to={to}
        className="relative text-sm font-im-fell uppercase tracking-widest cursor-pointer group"
      >
        {children}
        <span className="absolute left-0 top-1/2 w-full h-px bg-white transform -translate-y-1/2 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
      </Link>
    );
  }
  
  return (
    <a
      href={href}
      className="relative text-sm font-im-fell uppercase tracking-widest cursor-pointer group"
    >
      {children}
      <span className="absolute left-0 top-1/2 w-full h-px bg-white transform -translate-y-1/2 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
    </a>
  );
}

