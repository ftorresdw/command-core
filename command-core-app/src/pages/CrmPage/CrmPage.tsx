import { useEffect, useState, type FormEvent } from 'react'
import {
  createManualLead,
  deleteLead,
  fetchLeads,
  updateLeadStatus,
} from '../../api/leadsClient'
import {
  LEAD_TYPE_OPTIONS,
  SERVICE_OPTIONS,
  LEAD_STATUS_OPTIONS,
  type Lead,
  type LeadStatus,
} from '../../../lib/lead'
import styles from './CrmPage.module.css'

type LeadFormState = {
  company: string
  contact: string
  status: LeadStatus
  projectType: (typeof SERVICE_OPTIONS)[number]
  leadType: (typeof LEAD_TYPE_OPTIONS)[number]
}

const emptyForm: LeadFormState = {
  company: '',
  contact: '',
  status: 'New',
  projectType: 'Website Development',
  leadType: 'Inbound',
}

function isLeadStatus(value: string): value is LeadStatus {
  return LEAD_STATUS_OPTIONS.includes(value as LeadStatus)
}

export function CrmPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddLead, setShowAddLead] = useState(false)
  const [saving, setSaving] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [form, setForm] = useState<LeadFormState>(emptyForm)

  useEffect(() => {
    let cancelled = false

    async function loadLeads() {
      setLoading(true)
      setError(null)

      try {
        const nextLeads = await fetchLeads()
        if (!cancelled) setLeads(nextLeads)
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load leads')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadLeads()
    return () => {
      cancelled = true
    }
  }, [])

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const company = form.company.trim()
    const contact = form.contact.trim()
    if (!company || !contact) return

    setSaving(true)
    setError(null)

    try {
      const lead = await createManualLead({ ...form, company, contact })
      setLeads((current) => [lead, ...current])
      closeAddLead()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save lead')
    } finally {
      setSaving(false)
    }
  }

  async function handleStatusChange(id: string, status: string) {
    if (!isLeadStatus(status)) return

    setUpdatingId(id)
    setError(null)

    try {
      const updated = await updateLeadStatus(id, status)
      setLeads((current) => current.map((lead) => (lead.id === id ? updated : lead)))
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleDelete(id: string, name: string) {
    const confirmed = window.confirm(`Delete lead ${id} (${name})? This cannot be undone.`)
    if (!confirmed) return

    setDeletingId(id)
    setError(null)

    try {
      await deleteLead(id)
      setLeads((current) => current.filter((lead) => lead.id !== id))
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete lead')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>CRM</div>
          <div className={styles.subtitle}>
            Leads are ingested from the Digital Weave website contact form and manual entry.
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

      {error && <div className={styles.errorBanner}>{error}</div>}

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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={8} className={styles.emptyState}>
                    Loading leads…
                  </td>
                </tr>
              )}
              {!loading && leads.length === 0 && (
                <tr>
                  <td colSpan={8} className={styles.emptyState}>
                    No leads yet. Submissions from the website will appear here.
                  </td>
                </tr>
              )}
              {!loading &&
                leads.map((lead) => (
                  <tr key={lead.id}>
                    <td className={styles.mono}>{lead.id}</td>
                    <td>{lead.company}</td>
                    <td>
                      <div>{lead.name}</div>
                      {lead.email && <div className={styles.contactEmail}>{lead.email}</div>}
                    </td>
                    <td>
                      <select
                        className={styles.statusSelect}
                        value={isLeadStatus(lead.status) ? lead.status : 'New'}
                        disabled={updatingId === lead.id}
                        onChange={(event) => void handleStatusChange(lead.id, event.target.value)}
                        aria-label={`Status for ${lead.name}`}
                      >
                        {LEAD_STATUS_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{lead.service}</td>
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
                    <td>
                      <button
                        className={styles.deleteButton}
                        type="button"
                        disabled={deletingId === lead.id}
                        onClick={() => void handleDelete(lead.id, lead.name)}
                      >
                        {deletingId === lead.id ? 'Deleting…' : 'Delete'}
                      </button>
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
                  onChange={(event) =>
                    updateForm('status', event.target.value as LeadFormState['status'])
                  }
                >
                  {LEAD_STATUS_OPTIONS.map((option) => (
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
                  onChange={(event) =>
                    updateForm('projectType', event.target.value as LeadFormState['projectType'])
                  }
                >
                  {SERVICE_OPTIONS.map((option) => (
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
                  onChange={(event) =>
                    updateForm('leadType', event.target.value as LeadFormState['leadType'])
                  }
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
                <button className={styles.primaryButton} type="submit" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
