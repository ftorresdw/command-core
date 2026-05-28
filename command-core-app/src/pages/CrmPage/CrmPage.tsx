import styles from './CrmPage.module.css'

const demoLeads = [
  { id: 'L-1001', company: 'Acme Co', contact: 'Jamie Rivera', status: 'New' },
  { id: 'L-1002', company: 'Northwind', contact: 'Sam Lee', status: 'Contacted' },
  { id: 'L-1003', company: 'Blue Sky Dental', contact: 'Taylor Morgan', status: 'Qualified' },
]

export function CrmPage() {
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>CRM</div>
          <div className={styles.subtitle}>
            Leads will be ingested via API from the Digital Weave website.
          </div>
        </div>
        <div className={styles.actions}>
          <button className={styles.ghostButton} type="button">
            Import
          </button>
          <button className={styles.primaryButton} type="button">
            Add Lead
          </button>
        </div>
      </div>

      <section className={styles.card}>
        <div className={styles.cardTitle}>Leads</div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Company</th>
                <th>Contact</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {demoLeads.map((l) => (
                <tr key={l.id}>
                  <td className={styles.mono}>{l.id}</td>
                  <td>{l.company}</td>
                  <td>{l.contact}</td>
                  <td>
                    <span className={styles.pill}>{l.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

