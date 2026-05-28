import styles from './TicketsPage.module.css'

const demoTickets = [
  { id: 'T-2001', title: 'Email not syncing', client: 'Acme Co', status: 'Open', priority: 'High' },
  { id: 'T-2002', title: 'VPN access request', client: 'Northwind', status: 'Open', priority: 'Normal' },
  { id: 'T-2003', title: 'New laptop setup', client: 'Blue Sky Dental', status: 'In progress', priority: 'Normal' },
]

export function TicketsPage() {
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>IT Ticketing</div>
          <div className={styles.subtitle}>
            Clients will submit tickets via their secure landing page; employees triage here.
          </div>
        </div>
        <div className={styles.actions}>
          <button className={styles.primaryButton} type="button">
            New Ticket
          </button>
        </div>
      </div>

      <section className={styles.card}>
        <div className={styles.cardTitle}>Tickets</div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Client</th>
                <th>Status</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {demoTickets.map((t) => (
                <tr key={t.id}>
                  <td className={styles.mono}>{t.id}</td>
                  <td>{t.title}</td>
                  <td>{t.client}</td>
                  <td>
                    <span className={styles.pill}>{t.status}</span>
                  </td>
                  <td>{t.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

