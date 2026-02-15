import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Terminal, Code, GitCompare, ChevronRight, Menu, X } from 'lucide-react';

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `nav-item ${isActive ? 'active' : ''}`
      }
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0.75rem 1rem',
        textDecoration: 'none',
        color: 'var(--text-secondary)',
        borderRadius: 'var(--radius-md)',
        transition: 'all 0.2s',
        gap: '0.75rem'
      }}
    >
      <Icon size={18} />
      <span style={{ fontWeight: 500 }}>{label}</span>
      <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />
    </NavLink>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
        {/* Retro Header */}
        <header style={{
          height: 'var(--header-height)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 1.5rem',
          background: 'var(--bg-primary)',
          justifyContent: 'space-between',
          zIndex: 60,
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '32px', height: '32px', background: 'var(--accent-primary)',
              borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#000'
            }}>
              <Terminal size={20} strokeWidth={3} />
            </div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              DEV<span style={{ color: 'var(--accent-primary)' }}>_DECK</span>
            </h1>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-only btn-secondary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ padding: '0.5rem', display: 'none' }} /* display none overridden by css class on mobile */
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
          {/* Mobile Overlay */}
          <div
            className={`app-overlay ${isMobileMenuOpen ? 'visible' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar */}
          <aside
            className={`app-sidebar ${isMobileMenuOpen ? 'open' : ''}`}
            style={{
            width: '260px',
            borderRight: '1px solid var(--border-color)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            background: 'var(--bg-secondary)'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
              Utilities
            </div>
            <div onClick={() => setIsMobileMenuOpen(false)}>
              <NavItem to="/curl" icon={Code} label="cURL Editor" />
            </div>
            <div onClick={() => setIsMobileMenuOpen(false)}>
              <NavItem to="/json" icon={GitCompare} label="JSON Formatter" />
            </div>

            <div style={{ marginTop: 'auto', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <div>Currently v1.0.0</div>
              <div style={{ marginTop: '0.25rem' }}>Status: <span style={{ color: '#22c55e' }}>● Online</span></div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main style={{ flex: 1, overflowY: 'auto', padding: '2rem', background: 'var(--bg-primary)' }}>
            <Outlet />
          </main>
        </div>
    </div>
  );
}
