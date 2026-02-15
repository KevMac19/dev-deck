import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Terminal, Code, GitCompare, ChevronRight, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `nav-item flex items-center py-3 px-4 no-underline text-text-secondary rounded-md transition-all gap-3 ${isActive ? 'active' : ''}`
      }
      style={{}}
    >
      <Icon size={18} />
      <span style={{ fontWeight: 500 }}>{label}</span>
      <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />
    </NavLink>
  );

  return (

    <div className="flex h-screen flex-col">
        {/* Retro Header */}
        <header className="h-[60px] border-b border-border flex items-center px-6 bg-bg-primary justify-between z-[60] relative">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent-primary rounded-[2px] flex items-center justify-center text-bg-primary">
              <Terminal size={20} strokeWidth={3} />
            </div>
            <h1 className="text-xl font-extrabold m-0 tracking-tighter">
              DEV<span className="text-accent-primary">_DECK</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="btn-secondary flex items-center justify-center p-2 border border-border bg-transparent text-text-primary cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden btn-secondary p-2 flex items-center justify-center"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden relative">
          {/* Mobile Overlay */}
          <div
            className={`fixed top-[60px] left-0 right-0 bottom-0 bg-black/50 z-40 transition-opacity duration-300 pointer-events-none md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar */}
          <aside
            className={`fixed top-[60px] left-0 bottom-0 w-[260px] z-50 transition-transform duration-300 ease-in-out border-r border-border p-6 flex flex-col gap-2 bg-bg-secondary
            md:relative md:top-0 md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'}`}
          >
            <div className="text-xs font-bold text-text-secondary uppercase mb-2 tracking-wider">
              Utilities
            </div>
            <div onClick={() => setIsMobileMenuOpen(false)}>
              <NavItem to="/curl" icon={Code} label="cURL Editor" />
            </div>
            <div onClick={() => setIsMobileMenuOpen(false)}>
              <NavItem to="/json" icon={GitCompare} label="JSON Formatter" />
            </div>

            <div className="mt-auto p-4 bg-bg-tertiary rounded-md text-xs text-text-secondary">
              <div>Currently v1.0.0</div>
              <div className="mt-1">Status: <span className="text-green-500">● Online</span></div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-bg-primary">
            <Outlet />
          </main>
        </div>
    </div>
  );
}
