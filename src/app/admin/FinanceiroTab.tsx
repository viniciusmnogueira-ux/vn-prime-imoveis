'use client'
import { useState, useMemo } from 'react'

const fmt = (n: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n)
const fmtDate = (s: string) => new Date(s).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })

const SETORES = [
  { id: 'proprietario_direto', label: 'Proprietário Direto', color: '#D4A857', desc: 'Taxa fixa R$ 297 por anúncio' },
  { id: 'venda_assistida',    label: 'Venda Assistida',    color: '#6366F1', desc: '3% sobre o valor de venda' },
  { id: 'venda_completa',     label: 'Venda Completa',     color: '#0F1824', desc: '6% sobre o valor de venda' },
  { id: 'corretor',           label: 'Corretor Parceiro',  color: '#2F8674', desc: 'Comissão compartilhada' },
  { id: 'consorcio',          label: 'Consórcio',          color: '#059669', desc: 'Parceria com administradora' },
  { id: 'fotografo',          label: 'Fotógrafo',          color: '#7C3AED', desc: 'R$390–R$1.190 por sessão' },
  { id: 'due_diligence',      label: 'Due Diligence',      color: '#DC2626', desc: 'Análise jurídica + técnica' },
  { id: 'indicacao',          label: 'Indicações',         color: '#94A3B8', desc: 'Controle de indicadores' },
]

type SubTab = 'overview' | 'transacoes' | 'setores' | 'indicacoes'

interface Props {
  imoveis: any[]
  leads: any[]
}

export default function FinanceiroTab({ imoveis, leads }: Props) {
  const [sub, setSub] = useState<SubTab>('overview')
  const [filterSetor, setFilterSetor] = useState('todos')
  const [filterStatus, setFilterStatus] = useState('todos')

  // ── Cálculos financeiros derivados dos dados reais ──────────────────────
  const financeiro = useMemo(() => {
    const vendidos = imoveis.filter(i => i.status === 'vendido')
    const ativos   = imoveis.filter(i => i.status === 'ativo')
    const pendentes = imoveis.filter(i => i.status === 'pendente')

    // Receita realizada
    let receitaRealizada = 0
    let receitaPrevista = 0

    const transacoes: any[] = []

    imoveis.forEach(im => {
      const plano = im.plano_label ?? 'direta'
      let receita = 0
      let setor = 'proprietario_direto'

      if (plano === 'direta') {
        receita = 297
        setor = 'proprietario_direto'
      } else if (plano === 'assistida') {
        receita = (im.preco ?? 0) * 0.03
        setor = 'venda_assistida'
      } else if (plano === 'completa') {
        receita = (im.preco ?? 0) * 0.06
        setor = 'venda_completa'
      }

      transacoes.push({
        id: im.id,
        imovel: im.titulo ?? 'Sem título',
        bairro: im.bairro ?? '—',
        setor,
        valorImovel: im.preco ?? 0,
        receita,
        status: im.status,
        data: im.criado_em,
        proprietario: im.profiles?.nome || im.profiles?.email || '—',
      })

      if (im.status === 'vendido') receitaRealizada += receita
      else if (im.status === 'ativo') receitaPrevista += receita
    })

    // Leads por setor
    const leadsFoto = leads.filter(l => l.tipo === 'fotografo' || l.mensagem?.toLowerCase().includes('foto'))
    const leadsDue  = leads.filter(l => l.tipo === 'due-diligence' || l.mensagem?.toLowerCase().includes('due'))
    const leadsCons = leads.filter(l => l.tipo === 'newsletter' || l.origem === 'consorcio')

    // Receita por setor (mock estimada para fotógrafo/due diligence)
    const receitaFoto  = leadsFoto.length * 540   // média pacote Completo
    const receitaDue   = leadsDue.length  * 890   // due diligence padrão
    const receitaCons  = leadsCons.length * 200   // comissão parceria

    const totalRealizada = receitaRealizada + receitaFoto + receitaDue + receitaCons

    // Distribuição por setor para gráfico
    const porSetor = [
      { id: 'proprietario_direto', label: 'Prop. Direto', valor: imoveis.filter(i => (i.plano_label ?? 'direta') === 'direta').length * 297 },
      { id: 'venda_assistida', label: 'Assistida', valor: imoveis.filter(i => i.plano_label === 'assistida').reduce((a: number, i: any) => a + (i.preco ?? 0) * 0.03, 0) },
      { id: 'venda_completa', label: 'Completa', valor: imoveis.filter(i => i.plano_label === 'completa').reduce((a: number, i: any) => a + (i.preco ?? 0) * 0.06, 0) },
      { id: 'fotografo', label: 'Fotógrafo', valor: receitaFoto },
      { id: 'due_diligence', label: 'Due Dilig.', valor: receitaDue },
      { id: 'consorcio', label: 'Consórcio', valor: receitaCons },
    ]

    const totalDistrib = porSetor.reduce((a, s) => a + s.valor, 0) || 1

    return {
      receitaRealizada: totalRealizada,
      receitaPrevista,
      totalImoveis: imoveis.length,
      vendidos: vendidos.length,
      ativos: ativos.length,
      pendentes: pendentes.length,
      taxaConversao: imoveis.length ? Math.round((vendidos.length / imoveis.length) * 100) : 0,
      transacoes,
      porSetor: porSetor.map(s => ({ ...s, pct: Math.round((s.valor / totalDistrib) * 100) })),
      leadsFoto: leadsFoto.length,
      leadsDue: leadsDue.length,
      leadsCons: leadsCons.length,
    }
  }, [imoveis, leads])

  const transacoesFiltradas = financeiro.transacoes
    .filter(t => filterSetor === 'todos' || t.setor === filterSetor)
    .filter(t => filterStatus === 'todos' || t.status === filterStatus)

  const SUB_TABS: [SubTab, string][] = [
    ['overview', 'Visão Geral'],
    ['transacoes', 'Transações'],
    ['setores', 'Por Setor'],
    ['indicacoes', 'Indicações'],
  ]

  return (
    <div>
      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #E2E8F0', marginBottom: 24 }}>
        {SUB_TABS.map(([id, label]) => (
          <button key={id} onClick={() => setSub(id)}
            style={{ padding: '10px 20px', border: 'none', background: 'none', fontSize: 13, fontWeight: sub === id ? 700 : 500, color: sub === id ? 'var(--navy)' : '#64748B', borderBottom: `2px solid ${sub === id ? 'var(--gold)' : 'transparent'}`, marginBottom: -2, cursor: 'pointer', fontFamily: 'inherit', transition: 'color 0.15s' }}>
            {label}
          </button>
        ))}
      </div>

      {/* VISÃO GERAL */}
      {sub === 'overview' && (
        <div>
          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 28 }}>
            {[
              { label: 'Receita total', value: fmt(financeiro.receitaRealizada), color: '#059669', sub: 'realizada' },
              { label: 'Receita prevista', value: fmt(financeiro.receitaPrevista), color: '#D97706', sub: 'imóveis ativos' },
              { label: 'Imóveis ativos', value: financeiro.ativos, color: 'var(--navy)', sub: `${financeiro.pendentes} em análise` },
              { label: 'Taxa de conversão', value: `${financeiro.taxaConversao}%`, color: '#6366F1', sub: `${financeiro.vendidos} vendidos` },
            ].map(k => (
              <div key={k.label} style={{ background: '#fff', borderRadius: 14, padding: '20px 22px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: k.color, letterSpacing: '-0.03em' }}>{k.value}</div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 3 }}>{k.label}</div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{k.sub}</div>
              </div>
            ))}
          </div>

          {/* Distribuição por setor */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', marginBottom: 20 }}>Distribuição de receita por setor</div>
            {financeiro.porSetor.map(s => {
              const set = SETORES.find(x => x.id === s.id)
              return (
                <div key={s.id} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 5 }}>
                    <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{s.label}</span>
                    <span style={{ color: '#64748B' }}>{fmt(s.valor)} · {s.pct}%</span>
                  </div>
                  <div style={{ background: '#F1F5F9', borderRadius: 99, height: 8, overflow: 'hidden' }}>
                    <div style={{ width: `${Math.max(s.pct, 2)}%`, height: '100%', background: set?.color ?? '#94A3B8', borderRadius: 99, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Últimas transações */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>Últimas transações</div>
            {financeiro.transacoes.slice(0, 6).map(t => (
              <div key={t.id} style={{ padding: '12px 20px', borderBottom: '1px solid #F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>{t.imovel}</div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>{SETORES.find(s => s.id === t.setor)?.label ?? t.setor} · {t.proprietario}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#059669' }}>{fmt(t.receita)}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>{fmtDate(t.data)}</div>
                </div>
              </div>
            ))}
            {financeiro.transacoes.length === 0 && (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>Nenhuma transação ainda.</div>
            )}
          </div>
        </div>
      )}

      {/* TRANSAÇÕES */}
      {sub === 'transacoes' && (
        <div>
          {/* Filtros */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            <select value={filterSetor} onChange={e => setFilterSetor(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13, fontFamily: 'inherit', cursor: 'pointer', background: '#fff' }}>
              <option value="todos">Todos os setores</option>
              {SETORES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13, fontFamily: 'inherit', cursor: 'pointer', background: '#fff' }}>
              <option value="todos">Todos os status</option>
              {['pendente','ativo','vendido','pausado'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <div style={{ marginLeft: 'auto', fontSize: 13, color: '#64748B', display: 'flex', alignItems: 'center' }}>
              {transacoesFiltradas.length} transação(ões) · {fmt(transacoesFiltradas.reduce((a, t) => a + t.receita, 0))} receita
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['Imóvel','Proprietário','Setor','Valor imóvel','Receita VN','Status','Data'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transacoesFiltradas.length === 0 ? (
                    <tr><td colSpan={7} style={{ padding: '40px 20px', textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>Nenhuma transação encontrada.</td></tr>
                  ) : transacoesFiltradas.map(t => {
                    const set = SETORES.find(s => s.id === t.setor)
                    const STATUS_C: Record<string, string> = { pendente: '#D97706', ativo: '#059669', vendido: '#7C3AED', pausado: '#6B7280', rascunho: '#94A3B8' }
                    return (
                      <tr key={t.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>{t.imovel}</div>
                          <div style={{ fontSize: 11, color: '#94A3B8' }}>{t.bairro}</div>
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: 12, color: '#64748B' }}>{t.proprietario}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ padding: '3px 8px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: `${set?.color ?? '#94A3B8'}18`, color: set?.color ?? '#94A3B8' }}>{set?.label ?? t.setor}</span>
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: 'var(--navy)', whiteSpace: 'nowrap' }}>{t.valorImovel ? fmt(t.valorImovel) : '—'}</td>
                        <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 700, color: '#059669', whiteSpace: 'nowrap' }}>{fmt(t.receita)}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: `${STATUS_C[t.status] ?? '#94A3B8'}18`, color: STATUS_C[t.status] ?? '#94A3B8' }}>{t.status}</span>
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: 11, color: '#64748B', whiteSpace: 'nowrap' }}>{fmtDate(t.data)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* POR SETOR */}
      {sub === 'setores' && (
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
          {[
            { id: 'proprietario_direto', label: 'Proprietário Direto', color: '#D4A857', count: imoveis.filter(i => (i.plano_label ?? 'direta') === 'direta').length, receita: imoveis.filter(i => (i.plano_label ?? 'direta') === 'direta').length * 297, modelo: 'R$ 297 por anúncio', detalhes: ['Anúncio ativo 90 dias', 'Proprietário gerencia visitas', 'Lead direto para o proprietário'] },
            { id: 'venda_assistida', label: 'Venda Assistida', color: '#6366F1', count: imoveis.filter(i => i.plano_label === 'assistida').length, receita: imoveis.filter(i => i.plano_label === 'assistida').reduce((a: number, i: any) => a + (i.preco ?? 0) * 0.03, 0), modelo: '3% sobre valor de venda', detalhes: ['Curadoria VN Prime', 'Qualificação de compradores', 'Cobrado somente ao vender'] },
            { id: 'venda_completa', label: 'Venda Completa', color: '#0F1824', count: imoveis.filter(i => i.plano_label === 'completa').length, receita: imoveis.filter(i => i.plano_label === 'completa').reduce((a: number, i: any) => a + (i.preco ?? 0) * 0.06, 0), modelo: '6% sobre valor de venda', detalhes: ['Corretor dedicado', 'Fotos + mídia incluídas', 'Suporte jurídico até escritura'] },
            { id: 'corretor', label: 'Corretor Parceiro', color: '#2F8674', count: leads.filter(l => l.corretor_id).length, receita: 0, modelo: 'Comissão compartilhada', detalhes: ['3% do corretor parceiro', 'VN Prime distribui leads', 'Portfólio exclusivo em BH'] },
            { id: 'consorcio', label: 'Consórcio', color: '#059669', count: financeiro.leadsCons, receita: financeiro.leadsCons * 200, modelo: 'Parceria com administradora', detalhes: ['Sem juros para o cliente', 'Comissão de parceria', 'Contemplação por sorteio/lance'] },
            { id: 'fotografo', label: 'Fotógrafo', color: '#7C3AED', count: financeiro.leadsFoto, receita: financeiro.leadsFoto * 540, modelo: 'R$ 390–R$ 1.190 por sessão', detalhes: ['Pacote Essencial (R$390)', 'Pacote Completo (R$690)', 'Pacote Premium + Drone (R$1.190)'] },
            { id: 'due_diligence', label: 'Due Diligence', color: '#DC2626', count: financeiro.leadsDue, receita: financeiro.leadsDue * 890, modelo: 'Análise jurídica + técnica', detalhes: ['30+ itens verificados', 'Relatório em 48h', 'Parceiros jurídicos credenciados'] },
          ].map(s => (
            <div key={s.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <div style={{ height: 6, background: s.color }} />
              <div style={{ padding: '20px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)' }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>{s.count} registro(s)</div>
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: s.color, marginBottom: 4 }}>{fmt(s.receita)}</div>
                <div style={{ fontSize: 11, color: '#64748B', marginBottom: 14 }}>{s.modelo}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {s.detalhes.map(d => (
                    <li key={d} style={{ display: 'flex', gap: 8, fontSize: 12, color: '#64748B' }}>
                      <span style={{ color: s.color, fontWeight: 700, flexShrink: 0 }}>·</span>{d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* INDICAÇÕES */}
      {sub === 'indicacoes' && (
        <div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>Controle de Indicações</div>
            <div style={{ fontSize: 12, color: '#64748B' }}>Rastreie leads e vendas originados por indicação de clientes ou parceiros.</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Total indicações', value: leads.filter(l => l.origem === 'indicacao').length || 0, color: '#6366F1' },
              { label: 'Convertidas', value: 0, color: '#059669' },
              { label: 'Receita gerada', value: fmt(0), color: '#D4A857' },
              { label: 'Taxa conversão', value: '0%', color: '#64748B' },
            ].map(k => (
              <div key={k.label} style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: k.color }}>{k.value}</div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 3 }}>{k.label}</div>
              </div>
            ))}
          </div>
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', padding: '40px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)', marginBottom: 8 }}>Programa de indicações em breve</div>
            <div style={{ fontSize: 13, color: '#64748B', maxWidth: 400, margin: '0 auto', lineHeight: 1.6 }}>
              Registre indicações de clientes e parceiros. Cada indicação convertida gera comissão rastreável por este painel.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
