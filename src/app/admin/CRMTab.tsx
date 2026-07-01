'use client'
import { useState, useMemo, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

type Temp = 'quente' | 'morno' | 'frio'
type Stage = 'novo' | 'qualificado' | 'visita' | 'proposta' | 'fechado'

interface Lead {
  id: string; nome: string; email: string; telefone?: string
  mensagem?: string; origem?: string; lido?: boolean
  temperatura?: Temp; crm_status?: Stage; notas?: string
  criado_em: string; atualizado_em?: string
}

/* ── config ── */
const TEMP: Record<Temp, { label: string; icon: string; color: string; bg: string; border: string }> = {
  quente: { label: 'Quente', icon: '🔥', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
  morno:  { label: 'Morno',  icon: '🌡', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  frio:   { label: 'Frio',   icon: '❄️', color: '#475569', bg: '#F1F5F9', border: '#CBD5E1' },
}

const STAGE: Record<Stage, { label: string; color: string; bg: string }> = {
  novo:        { label: 'Novo',        color: '#6366F1', bg: '#EEF2FF' },
  qualificado: { label: 'Qualificado', color: '#0369A1', bg: '#EFF8FF' },
  visita:      { label: 'Visita',      color: '#7C3AED', bg: '#F5F3FF' },
  proposta:    { label: 'Proposta',    color: '#D97706', bg: '#FFFBEB' },
  fechado:     { label: 'Fechado',     color: '#059669', bg: '#ECFDF5' },
}

const STAGES: Stage[] = ['novo', 'qualificado', 'visita', 'proposta', 'fechado']

function autoTemp(msg?: string): Temp {
  if (!msg) return 'frio'
  const m = msg.toLowerCase()
  if (['urgente', 'urgência', 'asap', 'comprar', 'fechar', 'proposta', 'disponível'].some(w => m.includes(w))) return 'quente'
  if (['interesse', 'interessado', 'quero', 'gostei', 'visitar', 'agendar', 'mais info'].some(w => m.includes(w))) return 'morno'
  return 'frio'
}

function timeAgo(s: string) {
  const diff = (Date.now() - new Date(s).getTime()) / 1000
  if (diff < 60) return 'agora'
  if (diff < 3600) return `${Math.floor(diff / 60)}min`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`
  return new Date(s).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

function fmtFull(s: string) {
  return new Date(s).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

/* ── sub-components ── */
function TempPill({ t, size = 'sm' }: { t: Temp; size?: 'sm' | 'md' }) {
  const c = TEMP[t]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      padding: size === 'md' ? '5px 12px' : '2px 7px',
      borderRadius: 99, fontSize: size === 'md' ? 13 : 10.5, fontWeight: 700,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      whiteSpace: 'nowrap',
    }}>
      {c.icon} {c.label}
    </span>
  )
}

function StagePill({ s }: { s: Stage }) {
  const c = STAGE[s]
  return <span style={{ padding: '2px 8px', borderRadius: 99, fontSize: 10.5, fontWeight: 700, background: c.bg, color: c.color }}>{c.label}</span>
}

/* ── drawer ── */
function LeadDrawer({ lead, onClose, onUpdate }: {
  lead: Lead
  onClose: () => void
  onUpdate: (id: string, fields: Partial<Lead>) => void
}) {
  const sb = createClient()
  const [nota, setNota] = useState(lead.notas ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const t = lead.temperatura ?? autoTemp(lead.mensagem)

  const save = async (fields: Partial<Lead>) => {
    setSaving(true)
    await sb.from('leads').update({ ...fields, atualizado_em: new Date().toISOString() }).eq('id', lead.id)
    onUpdate(lead.id, fields)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 1600)
  }

  const saveNota = async () => {
    await save({ notas: nota })
  }

  return (
    <>
      {/* overlay */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 998, background: 'rgba(15,24,36,0.35)', backdropFilter: 'blur(2px)' }} />

      {/* drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(480px,96vw)',
        background: '#fff', zIndex: 999, boxShadow: '-8px 0 48px rgba(15,24,36,0.16)',
        display: 'flex', flexDirection: 'column', overflowY: 'auto',
      }}>
        {/* header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--navy)', marginBottom: 4 }}>{lead.nome}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <TempPill t={t} size="md" />
              <StagePill s={lead.crm_status ?? 'novo'} />
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#94A3B8', padding: '2px 6px', lineHeight: 1, flexShrink: 0 }}>✕</button>
        </div>

        <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* contact */}
          <div style={{ background: '#F8FAFC', borderRadius: 12, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 2 }}>Contato</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 2 }}>E-mail</div>
                <a href={`mailto:${lead.email}`} style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy)', textDecoration: 'none' }}>{lead.email}</a>
              </div>
              <a href={`mailto:${lead.email}`} style={{ padding: '6px 14px', borderRadius: 8, background: '#EFF8FF', color: '#0369A1', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>✉ Email</a>
            </div>
            {lead.telefone && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 2 }}>WhatsApp</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy)' }}>{lead.telefone}</div>
                </div>
                <a href={`https://wa.me/55${lead.telefone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                  style={{ padding: '6px 14px', borderRadius: 8, background: '#DCFCE7', color: '#166534', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                  WhatsApp →
                </a>
              </div>
            )}
          </div>

          {/* temperatura picker */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 10 }}>Temperatura</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {(Object.keys(TEMP) as Temp[]).map(tp => {
                const c = TEMP[tp]
                const active = (lead.temperatura ?? autoTemp(lead.mensagem)) === tp
                return (
                  <button key={tp} onClick={() => save({ temperatura: tp })}
                    style={{
                      flex: 1, padding: '10px 0', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
                      border: `2px solid ${active ? c.color : '#E2E8F0'}`,
                      background: active ? c.bg : '#fff',
                      color: active ? c.color : '#94A3B8',
                      fontSize: 13, fontWeight: active ? 700 : 500,
                      transition: 'all 0.15s',
                    }}>
                    {c.icon} {c.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* stage picker */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 10 }}>Pipeline</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {STAGES.map(st => {
                const c = STAGE[st]
                const active = (lead.crm_status ?? 'novo') === st
                return (
                  <button key={st} onClick={() => save({ crm_status: st })}
                    style={{
                      padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
                      border: `2px solid ${active ? c.color : '#E2E8F0'}`,
                      background: active ? c.bg : '#fff',
                      color: active ? c.color : '#94A3B8',
                      fontSize: 12, fontWeight: active ? 700 : 500,
                      transition: 'all 0.15s',
                    }}>
                    {c.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* mensagem original */}
          {lead.mensagem && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 8 }}>Mensagem</div>
              <div style={{ background: '#F8FAFC', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#475569', lineHeight: 1.6, fontStyle: 'italic', border: '1px solid #E2E8F0' }}>
                "{lead.mensagem}"
              </div>
            </div>
          )}

          {/* notas */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 8 }}>Notas internas</div>
            <textarea
              value={nota}
              onChange={e => setNota(e.target.value)}
              rows={4}
              placeholder="Adicione observações, histórico de contato, próximos passos..."
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 10,
                border: '1px solid #E2E8F0', fontSize: 13, fontFamily: 'inherit',
                outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                color: 'var(--navy)', lineHeight: 1.5, background: '#FAFAFA',
              }}
            />
            <button onClick={saveNota} disabled={saving}
              style={{
                marginTop: 8, padding: '8px 20px', borderRadius: 8,
                background: saved ? '#059669' : 'var(--navy)',
                color: '#fff', border: 'none', fontSize: 12, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s',
              }}>
              {saving ? 'Salvando…' : saved ? '✓ Salvo' : 'Salvar nota'}
            </button>
          </div>

          {/* meta */}
          <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: '#94A3B8' }}>Origem</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>{lead.origem ?? '—'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: '#94A3B8' }}>Recebido</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>{fmtFull(lead.criado_em)}</span>
            </div>
            {lead.atualizado_em && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: '#94A3B8' }}>Atualizado</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>{fmtFull(lead.atualizado_em)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

/* ── kanban card ── */
function KanbanCard({ lead, onOpen, onDragStart }: {
  lead: Lead
  onOpen: () => void
  onDragStart: (e: React.DragEvent) => void
}) {
  const t = lead.temperatura ?? autoTemp(lead.mensagem)
  const tc = TEMP[t]
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onOpen}
      style={{
        background: '#fff', borderRadius: 10, border: '1px solid #E2E8F0',
        borderLeft: `3px solid ${tc.color}`,
        padding: '12px 14px', cursor: 'pointer',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.15s, transform 0.15s',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; (e.currentTarget as HTMLDivElement).style.transform = '' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', lineHeight: 1.3 }}>{lead.nome}</div>
        <TempPill t={t} />
      </div>
      {lead.mensagem && (
        <div style={{ fontSize: 11.5, color: '#64748B', lineHeight: 1.4, marginBottom: 8, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {lead.mensagem}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
        <span style={{ fontSize: 10.5, color: '#94A3B8' }}>{lead.origem ?? '—'}</span>
        <span style={{ fontSize: 10.5, color: '#94A3B8' }}>{timeAgo(lead.criado_em)}</span>
      </div>
      {lead.notas && (
        <div style={{ marginTop: 8, padding: '6px 8px', background: '#FFFBEB', borderRadius: 6, fontSize: 11, color: '#92400E', borderLeft: '2px solid #FDE68A' }}>
          {lead.notas.slice(0, 80)}{lead.notas.length > 80 ? '…' : ''}
        </div>
      )}
    </div>
  )
}

/* ── main CRM tab ── */
export default function CRMTab({ initialLeads }: { initialLeads: Lead[] }) {
  const sb = createClient()
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [view, setView] = useState<'kanban' | 'lista'>('kanban')
  const [selected, setSelected] = useState<Lead | null>(null)
  const [search, setSearch] = useState('')
  const [filterTemp, setFilterTemp] = useState<'' | Temp>('')
  const [filterStage, setFilterStage] = useState<'' | Stage>('')
  const [dragId, setDragId] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<Stage | null>(null)

  const updateLead = useCallback((id: string, fields: Partial<Lead>) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...fields } : l))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, ...fields } : null)
  }, [selected])

  const moveLead = useCallback(async (id: string, stage: Stage) => {
    updateLead(id, { crm_status: stage, atualizado_em: new Date().toISOString() })
    await sb.from('leads').update({ crm_status: stage, atualizado_em: new Date().toISOString() }).eq('id', id)
  }, [updateLead, sb])

  const filtered = useMemo(() => {
    return leads.filter(l => {
      if (filterTemp && (l.temperatura ?? autoTemp(l.mensagem)) !== filterTemp) return false
      if (filterStage && (l.crm_status ?? 'novo') !== filterStage) return false
      if (search) {
        const q = search.toLowerCase()
        return (l.nome ?? '').toLowerCase().includes(q) || (l.email ?? '').toLowerCase().includes(q) || (l.telefone ?? '').includes(q)
      }
      return true
    })
  }, [leads, filterTemp, filterStage, search])

  // stats
  const stats = useMemo(() => {
    const total = leads.length
    const quentes = leads.filter(l => (l.temperatura ?? autoTemp(l.mensagem)) === 'quente').length
    const mornos  = leads.filter(l => (l.temperatura ?? autoTemp(l.mensagem)) === 'morno').length
    const frios   = leads.filter(l => (l.temperatura ?? autoTemp(l.mensagem)) === 'frio').length
    const byCols = STAGES.reduce((acc, s) => ({ ...acc, [s]: leads.filter(l => (l.crm_status ?? 'novo') === s).length }), {} as Record<Stage, number>)
    return { total, quentes, mornos, frios, byCols }
  }, [leads])

  // drag & drop handlers
  const handleDrop = async (stage: Stage) => {
    if (dragId && stage !== (leads.find(l => l.id === dragId)?.crm_status ?? 'novo')) {
      await moveLead(dragId, stage)
    }
    setDragId(null)
    setDragOver(null)
  }

  return (
    <div>
      {/* Stats strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total leads', value: stats.total, color: 'var(--navy)', bg: '#F8FAFC' },
          { label: '🔥 Quentes', value: stats.quentes, color: '#DC2626', bg: '#FEF2F2' },
          { label: '🌡 Mornos', value: stats.mornos, color: '#D97706', bg: '#FFFBEB' },
          { label: '❄️ Frios', value: stats.frios, color: '#475569', bg: '#F1F5F9' },
          { label: 'Propostas', value: stats.byCols.proposta, color: '#7C3AED', bg: '#F5F3FF' },
          { label: '✓ Fechados', value: stats.byCols.fechado, color: '#059669', bg: '#ECFDF5' },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: '14px 16px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', padding: '14px 18px', marginBottom: 16, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome, e-mail, telefone…"
          style={{ flex: '1 1 220px', padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13, fontFamily: 'inherit', outline: 'none', minWidth: 0 }}
        />

        {/* Temperatura filter */}
        <div style={{ display: 'flex', gap: 4 }}>
          {(['', 'quente', 'morno', 'frio'] as const).map(t => {
            const label = t === '' ? 'Todas' : TEMP[t].icon + ' ' + TEMP[t].label
            const active = filterTemp === t
            return (
              <button key={t} onClick={() => setFilterTemp(t)}
                style={{
                  padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
                  border: '1px solid', borderColor: active ? (t === '' ? 'var(--navy)' : TEMP[t as Temp]?.color ?? '#E2E8F0') : '#E2E8F0',
                  background: active ? (t === '' ? 'var(--navy)' : TEMP[t as Temp]?.bg ?? '#fff') : '#fff',
                  color: active ? (t === '' ? '#fff' : TEMP[t as Temp]?.color ?? '#64748B') : '#64748B',
                  fontSize: 12, fontWeight: active ? 700 : 500, transition: 'all 0.12s',
                }}>
                {label}
              </button>
            )
          })}
        </div>

        <div style={{ height: 28, width: 1, background: '#E2E8F0', flexShrink: 0 }} />

        {/* View toggle */}
        <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: 8, padding: 3, gap: 2, flexShrink: 0 }}>
          {(['kanban', 'lista'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              style={{
                padding: '6px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                background: view === v ? '#fff' : 'transparent',
                color: view === v ? 'var(--navy)' : '#94A3B8',
                fontSize: 12, fontWeight: view === v ? 700 : 500,
                boxShadow: view === v ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.12s',
              }}>
              {v === 'kanban' ? '⊞ Kanban' : '☰ Lista'}
            </button>
          ))}
        </div>

        <div style={{ fontSize: 12, color: '#94A3B8', flexShrink: 0, marginLeft: 'auto' }}>
          {filtered.length} de {leads.length} leads
        </div>
      </div>

      {/* KANBAN */}
      {view === 'kanban' && (
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16, alignItems: 'flex-start', minHeight: 400 }}>
          {STAGES.map(stage => {
            const c = STAGE[stage]
            const colLeads = filtered.filter(l => (l.crm_status ?? 'novo') === stage)
            const isOver = dragOver === stage
            return (
              <div key={stage}
                style={{ minWidth: 240, flex: '1 0 240px', display: 'flex', flexDirection: 'column', gap: 0 }}
                onDragOver={e => { e.preventDefault(); setDragOver(stage) }}
                onDragLeave={() => setDragOver(null)}
                onDrop={() => handleDrop(stage)}
              >
                {/* col header */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
                  padding: '10px 12px', borderRadius: 10,
                  background: isOver ? c.bg : '#fff',
                  border: `1.5px solid ${isOver ? c.color : '#E2E8F0'}`,
                  transition: 'all 0.15s',
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: c.color, textTransform: 'uppercase', letterSpacing: '0.07em', flex: 1 }}>{c.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, background: c.bg, color: c.color, padding: '1px 7px', borderRadius: 99 }}>{colLeads.length}</span>
                </div>

                {/* cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 80 }}>
                  {colLeads.map(l => (
                    <KanbanCard key={l.id} lead={l}
                      onOpen={() => setSelected(l)}
                      onDragStart={e => { e.dataTransfer.effectAllowed = 'move'; setDragId(l.id) }}
                    />
                  ))}
                  {colLeads.length === 0 && (
                    <div style={{
                      borderRadius: 10, border: `2px dashed ${isOver ? c.color : '#E2E8F0'}`,
                      padding: '24px 12px', textAlign: 'center',
                      fontSize: 12, color: isOver ? c.color : '#94A3B8',
                      background: isOver ? c.bg : 'transparent',
                      transition: 'all 0.15s',
                    }}>
                      {isOver ? 'Solte aqui' : 'Sem leads'}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* LISTA */}
      {view === 'lista' && (
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          {/* stage filter pills */}
          <div style={{ padding: '12px 18px', borderBottom: '1px solid #F1F5F9', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {(['', ...STAGES] as const).map(s => {
              const active = filterStage === s
              const c = s ? STAGE[s] : null
              return (
                <button key={s} onClick={() => setFilterStage(s as '' | Stage)}
                  style={{
                    padding: '4px 12px', borderRadius: 99, cursor: 'pointer', fontFamily: 'inherit',
                    border: '1px solid', borderColor: active ? (c?.color ?? 'var(--navy)') : '#E2E8F0',
                    background: active ? (c?.bg ?? 'var(--navy)') : '#fff',
                    color: active ? (c?.color ?? '#fff') : '#64748B',
                    fontSize: 11.5, fontWeight: active ? 700 : 500,
                  }}>
                  {s === '' ? 'Todos' : STAGE[s].label}
                  <span style={{ marginLeft: 5, opacity: 0.7 }}>{s === '' ? leads.length : stats.byCols[s]}</span>
                </button>
              )
            })}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  {['Nome', 'Temperatura', 'Status', 'Contato', 'Mensagem', 'Origem', 'Há quanto tempo'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10.5, fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => {
                  const t = l.temperatura ?? autoTemp(l.mensagem)
                  return (
                    <tr key={l.id}
                      onClick={() => setSelected(l)}
                      style={{ borderTop: '1px solid #F1F5F9', cursor: 'pointer', transition: 'background 0.1s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#FAFBFF'}
                      onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = ''}
                    >
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>{l.nome}</div>
                        {l.notas && <div style={{ fontSize: 10.5, color: '#D97706', marginTop: 2 }}>📝 tem notas</div>}
                      </td>
                      <td style={{ padding: '12px 14px' }}><TempPill t={t} /></td>
                      <td style={{ padding: '12px 14px' }}><StagePill s={l.crm_status ?? 'novo'} /></td>
                      <td style={{ padding: '12px 14px', fontSize: 12, color: '#64748B' }}>
                        <div>{l.email}</div>
                        {l.telefone && (
                          <a href={`https://wa.me/55${l.telefone.replace(/\D/g,'')}`} onClick={e => e.stopPropagation()}
                            target="_blank" rel="noopener noreferrer"
                            style={{ color: '#25D366', fontWeight: 700, textDecoration: 'none', fontSize: 11 }}>
                            {l.telefone}
                          </a>
                        )}
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: 12, color: '#64748B', maxWidth: 220 }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.mensagem || '—'}</div>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: 11 }}>
                        <span style={{ background: '#F1F5F9', color: '#64748B', padding: '2px 8px', borderRadius: 99, fontWeight: 600 }}>{l.origem || '—'}</span>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: 11, color: '#94A3B8', whiteSpace: 'nowrap' }}>{timeAgo(l.criado_em)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div style={{ padding: '60px 24px', textAlign: 'center', fontSize: 13, color: '#94A3B8' }}>Nenhum lead encontrado.</div>
            )}
          </div>
        </div>
      )}

      {/* Drawer */}
      {selected && (
        <LeadDrawer
          lead={selected}
          onClose={() => setSelected(null)}
          onUpdate={updateLead}
        />
      )}
    </div>
  )
}
