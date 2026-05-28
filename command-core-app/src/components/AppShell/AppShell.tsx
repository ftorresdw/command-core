import { NavLink, Outlet } from 'react-router-dom'
import styles from './AppShell.module.css'

function NavItem(props: { to: string; label: string }) {
  return (
    <NavLink
      to={props.to}
      className={({ isActive }) =>
        `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
      }
    >
      {props.label}
    </NavLink>
  )
}

export function AppShell() {
  return (
    <div className={styles.root}>
      <aside className={styles.sidebar} aria-label="Primary">
        <div className={styles.brand}>
          <div className={styles.brandMark} aria-hidden="true" />
          <div className={styles.brandText}>
            <div className={styles.brandName}>Command Core</div>
            <div className={styles.brandTagline}>Connect • Orchestrate • Transform</div>
          </div>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navSectionLabel}>Workspace</div>
          <NavItem to="/crm" label="CRM" />
          <NavItem to="/tickets" label="IT Ticketing" />
        </nav>
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
          <div className={styles.topbarRight}>
            <button className={styles.primaryButton} type="button">
              + Create
            </button>
          </div>
        </header>

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

