import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { BrandLogo } from '../Brand/BrandLogo'
import styles from './AppShell.module.css'

function NavItem(props: { to: string; label: string; shortLabel: string; collapsed: boolean }) {
  return (
    <NavLink
      to={props.to}
      title={props.collapsed ? props.label : undefined}
      className={({ isActive }) =>
        `${styles.navItem} ${isActive ? styles.navItemActive : ''} ${props.collapsed ? styles.navItemCollapsed : ''}`
      }
    >
      <span className={styles.navShort} aria-hidden={!props.collapsed}>
        {props.shortLabel}
      </span>
      {!props.collapsed && <span className={styles.navLabel}>{props.label}</span>}
    </NavLink>
  )
}

export function AppShell() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, signOut, authRequired } = useAuth()
  const navigate = useNavigate()

  function handleSignOut() {
    signOut()
    navigate('/login')
  }

  return (
    <div className={`${styles.root} ${collapsed ? styles.rootCollapsed : ''}`}>
      <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''}`} aria-label="Primary">
        <div className={styles.brand}>
          <BrandLogo variant={collapsed ? 'icon' : 'sidebar'} />
        </div>

        <nav className={styles.nav}>
          {!collapsed && <div className={styles.navSectionLabel}>Workspace</div>}
          <NavItem to="/crm" label="CRM" shortLabel="C" collapsed={collapsed} />
          <NavItem to="/tickets" label="IT Ticketing" shortLabel="T" collapsed={collapsed} />
        </nav>

        <button
          className={styles.collapseButton}
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
        >
          <span className={styles.collapseIcon} aria-hidden="true">
            {collapsed ? '›' : '‹'}
          </span>
          {!collapsed && <span>Collapse</span>}
        </button>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.searchWrap}>
            <input
              className={styles.search}
              placeholder="Search"
              aria-label="Search"
            />
          </div>
          {user && (
            <div className={styles.topbarRight}>
              <div className={styles.userChip}>
                {user.picture && (
                  <img className={styles.userAvatar} src={user.picture} alt="" />
                )}
                <div className={styles.userMeta}>
                  <div className={styles.userName}>{user.name}</div>
                  <div className={styles.userEmail}>{user.email}</div>
                </div>
              </div>
              {authRequired && (
                <button className={styles.signOutButton} type="button" onClick={handleSignOut}>
                  Sign out
                </button>
              )}
            </div>
          )}
        </header>

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
