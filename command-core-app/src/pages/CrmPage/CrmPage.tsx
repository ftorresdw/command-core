import { useState, type FormEvent } from 'react'
import styles from './CrmPage.module.css'

type LeadChannel = 'Manual' | 'Website'

type Lead = {
  id: string
  company: string
  contact: string
  status: string
  projectType: string
  leadType: string
  channel: LeadChannel
}

type LeadFormState = {
  company: string
  contact: string
  status: string
  projectType: string
  leadType: string
}

const STATUS_OPTIONS = ['New', 'Contacted', 'Qualified', 'Proposal', 'Closed']
const PROJECT_TYPE_OPTIONS = ['Website', 'IT Support', 'Consulting', 'Managed Services', 'Other']
const LEAD_TYPE_OPTIONS = ['Inbound', 'Outbound', 'Referral', 'Partner', 'Other']

const initialLeads: Lead[] = [
  {
    id: 'L-1001',
    company: 'Acme Co',
    contact: 'Jamie Rivera',
    status: 'New',
    projectType: 'Website',
    leadType: 'Inbound',
    channel: 'Website',
  },
  {
    id: 'L-1002',
    company: 'Northwind',
    contact: 'Sam Lee',
    status: 'Contacted',
    projectType: 'IT Support',
    leadType: 'Referral',
    channel: 'Website',
  },
  {
    id: 'L-1003',
    company: 'Blue Sky Dental',
    contact: 'Taylor Morgan',
    status: 'Qualified',
    projectType: 'Managed Services',
    leadType: 'Inbound',
    channel: 'Manual',
  },
]

const emptyForm: LeadFormState = {
  company: '',
  contact: '',
  status: 'New',
  projectType: 'Website',
  leadType: 'Inbound',
}

function nextLeadId(leads: Lead[]) {
  const max = leads.reduce((current, lead) => {
    const numeric = Number(lead.id.replace('L-', ''))
    return Number.isFinite(numeric) ? Math.max(current, numeric) : current
  }, 1000)
  return `L-${max + 1}`
}

export function CrmPage() {
  const [leads, setLeads] = useState(initialLeads)
  const [showAddLead, setShowAddLead] = useState(false)
  const [form, setForm] = useState<LeadFormState>(emptyForm)

  function updateForm<K extends keyof LeadFormState>(key: K, value: LeadFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function openAddLead() {
    setForm(emptyForm)
    setShowAddLead(true)
  }

  function closeAddLead() {
    setShowAddLead(false)
    setForm(emptyForm)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const company = form.company.trim()
    const contact = form.contact.trim()
    if (!company || !contact) return

    const newLead: Lead = {
      id: nextLeadId(leads),
      company,
      contact,
      status: form.status,
      projectType: form.projectType,
      leadType: form.leadType,
      channel: 'Manual',
    }

    setLeads((current) => [newLead, ...current])
    closeAddLead()
  }

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
          <button className={styles.primaryButton} type="button" onClick={openAddLead}>
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
                <th>Type of Project</th>
                <th>Type of Lead</th>
                <th>Channel</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className={styles.mono}>{lead.id}</td>
                  <td>{lead.company}</td>
                  <td>{lead.contact}</td>
                  <td>
                    <span className={styles.pill}>{lead.status}</span>
                  </td>
                  <td>{lead.projectType}</td>
                  <td>{lead.leadType}</td>
                  <td>
                    <span
                      className={`${styles.channelPill} ${
                        lead.channel === 'Website' ? styles.channelWebsite : styles.channelManual
                      }`}
                    >
                      {lead.channel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {showAddLead && (
        <div className={styles.overlay} onClick={closeAddLead}>
          <div
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-lead-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.panelHeader}>
              <div>
                <div className={styles.panelTitle} id="add-lead-title">
                  Add Lead
                </div>
                <div className={styles.panelSubtitle}>
                  Manually added leads are tagged with the Manual channel.
                </div>
              </div>
              <button className={styles.closeButton} type="button" onClick={closeAddLead} aria-label="Close">
                ×
              </button>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <label className={styles.field}>
                <span className={styles.label}>Company Name</span>
                <input
                  className={styles.input}
                  value={form.company}
                  onChange={(event) => updateForm('company', event.target.value)}
                  required
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Contact</span>
                <input
                  className={styles.input}
                  value={form.contact}
                  onChange={(event) => updateForm('contact', event.target.value)}
                  required
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Status</span>
                <select
                  className={styles.input}
                  value={form.status}
                  onChange={(event) => updateForm('status', event.target.value)}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Type of Project</span>
                <select
                  className={styles.input}
                  value={form.projectType}
                  onChange={(event) => updateForm('projectType', event.target.value)}
                >
                  {PROJECT_TYPE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Type of Lead</span>
                <select
                  className={styles.input}
                  value={form.leadType}
                  onChange={(event) => updateForm('leadType', event.target.value)}
                >
                  {LEAD_TYPE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <div className={styles.channelNote}>
                Channel: <strong>Manual</strong>
              </div>

              <div className={styles.formActions}>
                <button className={styles.ghostButton} type="button" onClick={closeAddLead}>
                  Cancel
                </button>
                <button className={styles.primaryButton} type="submit">
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
