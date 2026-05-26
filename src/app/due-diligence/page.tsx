'use client'
import { useState } from 'react'
import Eyebrow from '@/components/ui/Eyebrow'
import Btn from '@/components/ui/Btn'
import { createClient } from '@/lib/supabase/client'

type Cert = {
  id: string; nome: string; para: string;
  sobre: 'vendedor' | 'imovel'; categoria: string;
  gratis: boolean; essencial: boolean;
  link: string; instrucao: string;
  custo?: string; cartorio?: string;
}

const CERTIDOES: Cert[] = [
  { id:'cnd-pf', nome:'CND Federal — Pessoa Física', para:'Débitos com Receita Federal, IR, ITR e Dívida Ativa da União.',
    sobre:'vendedor', categoria:'fiscal', gratis:true, essencial:true,
    link:'https://solucoes.receita.fazenda.gov.br/Servicos/certidaointernet/PF/Emitir',
    instrucao:'Informe CPF e data de nascimento. PDF gerado na hora. Válida 180 dias.' },
  { id:'cnd-pj', nome:'CND Federal — Pessoa Jurídica (CNPJ)', para:'Regularidade fiscal federal de empresa vendedora ou incorporadora.',
    sobre:'vendedor', categoria:'fiscal', gratis:true, essencial:false,
    link:'https://solucoes.receita.fazenda.gov.br/Servicos/certidaointernet/PJ/Emitir',
    instrucao:'Informe o CNPJ da empresa. Emissão imediata em PDF. Válida 180 dias.' },
  { id:'cndt', nome:'CNDT — Débitos Trabalhistas (TST)', para:'Condenações trabalhistas não pagas em nome do vendedor.',
    sobre:'vendedor', categoria:'trabalhista', gratis:true, essencial:true,
    link:'https://cndt.tst.jus.br/',
    instrucao:'Informe CPF (PF) ou CNPJ. Emissão em segundos pelo site do TST.' },
  { id:'crf', nome:'CRF — Regularidade FGTS (Caixa)', para:'Recolhimento regular do FGTS — obrigatório para empresas com empregados.',
    sobre:'vendedor', categoria:'trabalhista', gratis:true, essencial:false,
    link:'https://consulta-crf.caixa.gov.br/',
    instrucao:'Informe o CNPJ da incorporadora ou empresa vendedora. Aplicável apenas a PJ.' },
  { id:'iptu-pbh', nome:'Certidão Negativa de IPTU (PBH)', para:'Ausência de débitos de IPTU junto à Prefeitura de BH.',
    sobre:'imovel', categoria:'municipal', gratis:true, essencial:true,
    link:'https://tributacao.pbh.gov.br/',
    instrucao:'Acesse o portal da PBH, seção "Certidões". Informe o número do imóvel (IPTU) ou CPF do proprietário.' },
  { id:'sefaz-mg', nome:'Certidão Negativa Estadual (SEFAZ-MG)', para:'Ausência de débitos com a Fazenda do Estado de MG.',
    sobre:'vendedor', categoria:'estadual', gratis:true, essencial:true,
    link:'https://cnd.fazenda.mg.gov.br/',
    instrucao:'Informe CPF ou CNPJ do vendedor. Emissão online e gratuita.' },
  { id:'matricula', nome:'Matrícula Atualizada do Imóvel', para:'Documento principal: histórico de proprietários, ônus, hipotecas, penhoras e todas as averbações.',
    sobre:'imovel', categoria:'cartorio', gratis:false, essencial:true,
    link:'https://onsv.registradores.org.br/', custo:'R$ 30–80',
    instrucao:'Acesse o portal ONR ou e-Cartório (ecartorio.org.br). Selecione "Certidão de Matrícula". Informe o número da matrícula ou o endereço completo. Pagamento por Pix ou cartão.',
    cartorio:'Preciso de uma certidão de matrícula atualizada do imóvel situado em [endereço completo], matrícula nº [X], do Cartório de Registro de Imóveis. Preciso com ônus e averbações atualizados.' },
  { id:'onus', nome:'Certidão de Inteiro Teor / Ônus Reais', para:'Versão completa da matrícula com todos os registros históricos — necessário quando há muitas averbações.',
    sobre:'imovel', categoria:'cartorio', gratis:false, essencial:false,
    link:'https://onsv.registradores.org.br/', custo:'R$ 30–80',
    instrucao:'Mesmo portal ONR ou presencialmente no Cartório de Registro de Imóveis da comarca.',
    cartorio:'Preciso de uma certidão de inteiro teor do imóvel com matrícula nº [X] para instrução de processo de compra e venda.' },
  { id:'protestos', nome:'Certidão de Protestos', para:'Títulos protestados (cheques, notas promissórias) em nome do vendedor — sinal de inadimplência.',
    sobre:'vendedor', categoria:'cartorio', gratis:false, essencial:true,
    link:'https://idcartorio.com.br/', custo:'R$ 15–50',
    instrucao:'Acesse iDCartório (idcartorio.com.br) ou ANOREG-MG. Informe CPF/CNPJ. Cobertura estadual ou nacional.',
    cartorio:'Preciso de uma certidão de protestos em nome de [Nome completo], CPF nº [xxx.xxx.xxx-xx], nos cartórios de protesto de [cidade/comarca].' },
  { id:'acoes-civeis', nome:'Certidão de Ações Cíveis (TJMG)', para:'Processos cíveis em nome do vendedor no Tribunal de Justiça de MG.',
    sobre:'vendedor', categoria:'judicial', gratis:false, essencial:true,
    link:'https://www.tjmg.jus.br/portal-tjmg/servicos/certidoes.htm', custo:'R$ 4,77',
    instrucao:'Acesse o portal do TJMG, seção "Certidões". Selecione "Distribuidor Cível". Informe CPF/CNPJ. Pagamento via GRU (Guia de Recolhimento). Download imediato após pagamento.' },
  { id:'acoes-penais', nome:'Certidão de Ações Penais (TJMG)', para:'Processos criminais em nome do vendedor no âmbito estadual de MG.',
    sobre:'vendedor', categoria:'judicial', gratis:false, essencial:false,
    link:'https://www.tjmg.jus.br/portal-tjmg/servicos/certidoes.htm', custo:'R$ 4,77',
    instrucao:'Mesmo portal TJMG, seção "Distribuidor Criminal". Pagamento via GRU.' },
  { id:'habite-se', nome:'Habite-se / Certidão de Conclusão de Obra', para:'Confirma que a construção foi concluída e aprovada pela Prefeitura. Obrigatório para imóveis construídos.',
    sobre:'imovel', categoria:'municipal', gratis:false, essencial:true,
    link:'https://prefeitura.pbh.gov.br/obras-e-infraestrutura/servicos/habite-se', custo:'Variável',
    instrucao:'Acesse o portal da PBH ou compareça na SMARU. Informe o endereço e o número do alvará de construção.',
    cartorio:'Preciso verificar se o imóvel no endereço [endereço completo] possui Habite-se emitido e se está em conformidade com o projeto aprovado pela Prefeitura.' },
]

const CAT_LABELS = [
  { key: 'todas', label: 'Todas' },
  { key: 'fiscal', label: 'Fiscal' },
  { key: 'trabalhista', label: 'Trabalhista' },
  { key: 'judicial', label: 'Judicial' },
  { key: 'cartorio', label: 'Cartório' },
  { key: 'municipal', label: 'Municipal' },
  { key: 'estadual', label: 'Estadual' },
]

const CHECKS = [
  { area: 'Jurídico', itens: ['Matrícula do imóvel atualizada', 'Ônus, hipotecas e penhoras', 'Certidões do vendedor (cível, criminal, trabalhista)', 'Protestos e processos em curso', 'Inventário e sucessão (quando aplicável)'] },
  { area: 'Fiscal', itens: ['IPTU em dia · histórico de 5 anos', 'Taxa de condomínio em dia', 'Débitos com concessionárias', 'ITBI e imposto de transmissão'] },
  { area: 'Técnico', itens: ['Habite-se e regularidade na prefeitura', 'Conformidade com projeto aprovado', 'Vistoria estrutural · vícios construtivos', 'Memorial descritivo vs entregue', 'Confrontações e averbações'] },
  { area: 'Documental', itens: ['Análise de minuta de compra e venda', 'Negociação de cláusulas críticas', 'Distrato e direito de arrependimento', 'Procurações e poderes especiais'] },
]

export default function DueDiligencePage() {
  const [tab, setTab] = useState<'diligencia' | 'certidoes'>('diligencia')
  const [certFilter, setCertFilter] = useState({ cat: 'todas', sobre: 'todos', search: '' })
  const [expandedCert, setExpandedCert] = useState<string | null>(null)

  // Lead form state
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [imovel, setImovel] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.from('leads').insert({
      nome, telefone, email,
      mensagem: `Due Diligence — Imóvel: ${imovel}`,
      origem: 'due-diligence',
    })
    setEnviado(true)
    setLoading(false)
  }

  const essenciais = CERTIDOES.filter(c => c.essencial)

  const filteredCerts = CERTIDOES.filter(c => {
    if (certFilter.cat !== 'todas' && c.categoria !== certFilter.cat) return false
    if (certFilter.sobre !== 'todos' && c.sobre !== certFilter.sobre) return false
    if (certFilter.search) {
      const q = certFilter.search.toLowerCase()
      if (!c.nome.toLowerCase().includes(q) && !c.para.toLowerCase().includes(q)) return false
    }
    return true
  })

  function handlePrint() {
    const rows = CERTIDOES.map(c => `
      <tr>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;">
          <label style="display:flex;gap:10px;align-items:flex-start;cursor:pointer;">
            <input type="checkbox" style="margin-top:3px;flex-shrink:0;" />
            <span>
              <strong>${c.nome}</strong><br/>
              <small style="color:#6b7280;">${c.para}</small><br/>
              <small><a href="${c.link}" target="_blank" style="color:#1d4ed8;">${c.link}</a></small>
            </span>
          </label>
        </td>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;white-space:nowrap;">
          ${c.gratis ? '<span style="background:#dcfce7;color:#166534;padding:2px 8px;border-radius:99px;font-size:12px;font-weight:600;">Grátis</span>' : `<span style="background:#fee2e2;color:#991b1b;padding:2px 8px;border-radius:99px;font-size:12px;font-weight:600;">Paga · ${c.custo || ''}</span>`}
        </td>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;">
          <span style="background:#f3f4f6;color:#374151;padding:2px 8px;border-radius:99px;font-size:11px;">${c.categoria}</span>
          <span style="background:#eff6ff;color:#1e40af;padding:2px 8px;border-radius:99px;font-size:11px;margin-left:4px;">${c.sobre}</span>
          ${c.essencial ? '<span style="background:#fef3c7;color:#92400e;padding:2px 8px;border-radius:99px;font-size:11px;margin-left:4px;">Essencial</span>' : ''}
        </td>
      </tr>`).join('')
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"/><title>Checklist de Certidões — VN Prime Imóveis</title>
<style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:32px;color:#111827;}h1{font-size:22px;margin-bottom:4px;}.sub{color:#6b7280;font-size:14px;margin-bottom:24px;}table{width:100%;border-collapse:collapse;font-size:13px;}th{background:#1e293b;color:#fff;padding:10px 8px;text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;}@media print{.no-print{display:none;}}</style>
</head><body>
<h1>Checklist de Certidões Imobiliárias</h1>
<p class="sub">VN Prime Imóveis · Due Diligence · Gerado em ${new Date().toLocaleDateString('pt-BR')}</p>
<button class="no-print" onclick="window.print()" style="margin-bottom:20px;padding:8px 20px;background:#1e293b;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:13px;">Imprimir / Salvar PDF</button>
<table><thead><tr><th>Certidão</th><th>Custo</th><th>Categoria / Sobre</th></tr></thead><tbody>${rows}</tbody></table>
</body></html>`
    const w = window.open('', '_blank')
    if (w) { w.document.write(html); w.document.close(); w.print() }
  }

  return (
    <main style={{ background: 'var(--cream)' }}>
      {/* Hero */}
      <section style={{
        position: 'relative',
        background: `linear-gradient(180deg, rgba(15,22,32,0.65) 0%, rgba(15,22,32,0.92) 100%), url(https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1900&q=85)`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        color: '#fff', padding: 'clamp(80px,12vw,140px) 0 clamp(60px,9vw,100px)',
      }}>
        <div style={{ width: 'min(1180px,92vw)', margin: '0 auto', maxWidth: 720 }}>
          <Eyebrow>Due Diligence Imobiliária</Eyebrow>
          <h1 style={{ color: '#fff', margin: '12px 0 18px', fontSize: 'clamp(2.4rem,5vw,3.6rem)', lineHeight: 1.05 }}>
            Compre com <em style={{ fontStyle: 'italic', color: 'var(--gold-soft)' }}>segurança jurídica</em> total.
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(245,248,250,0.88)', maxWidth: 560, marginBottom: 28 }}>
            Análise completa de matrícula, certidões, ônus, regularidade técnica e fiscal antes de você assinar o contrato. Conduzido por advogados parceiros especialistas em direito imobiliário.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={() => window.dispatchEvent(new CustomEvent('vnprime:consultor'))}
              style={{ padding: '14px 28px', background: 'var(--gold)', color: 'var(--navy-deep)', border: 'none', borderRadius: 999, fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              Solicitar análise
            </button>
            <button onClick={() => window.dispatchEvent(new CustomEvent('vnprime:consultor'))}
              style={{ padding: '14px 28px', background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: 999, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              Ver relatório modelo
            </button>
          </div>
        </div>
      </section>

      {/* Tab switcher */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', position: 'sticky', top: 64, zIndex: 10 }}>
        <div style={{ width: 'min(1180px,92vw)', margin: '0 auto', display: 'flex', gap: 0 }}>
          {[{ key: 'diligencia', label: 'Due Diligence' }, { key: 'certidoes', label: 'Central de Certidões' }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as 'diligencia' | 'certidoes')}
              style={{
                padding: '14px 28px', border: 'none', background: 'none', cursor: 'pointer',
                fontSize: 15, fontWeight: 600, fontFamily: 'var(--font-body)',
                color: tab === t.key ? 'var(--navy)' : 'var(--fg-3)',
                borderBottom: tab === t.key ? '2px solid var(--gold-deep)' : '2px solid transparent',
                transition: 'all 0.15s',
              }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* ── Due Diligence tab ── */}
      {tab === 'diligencia' && (
        <>
          {/* 4 áreas */}
          <section style={{ padding: 'clamp(50px,7vw,90px) 0' }}>
            <div style={{ width: 'min(1180px,92vw)', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', maxWidth: 580, margin: '0 auto 48px' }}>
                <Eyebrow color="var(--gold-deep)">Escopo da análise</Eyebrow>
                <h2 style={{ margin: '8px 0 12px' }}>4 frentes · 70+ itens verificados</h2>
                <p style={{ color: 'var(--fg-2)', fontSize: 15.5 }}>
                  Relatório consolidado em até 7 dias úteis com semáforo de risco e recomendações por item.
                </p>
              </div>
              <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
                {CHECKS.map(c => (
                  <div key={c.area} style={{ background: '#fff', padding: 26, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-deep)', marginBottom: 14 }}>{c.area}</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {c.itens.map(it => (
                        <li key={it} style={{ fontSize: 14, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          <span style={{ color: 'var(--gold-deep)', fontWeight: 700, fontSize: 15 }}>✓</span>
                          <span style={{ color: 'var(--fg-1)' }}>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Pacote + CTA */}
          <section style={{ padding: 'clamp(50px,7vw,90px) 0', background: '#fff' }}>
            <div style={{ width: 'min(900px,92vw)', margin: '0 auto',
              background: 'linear-gradient(135deg,#0F1824 0%,#1B2733 100%)', color: '#fff',
              padding: 'clamp(36px,5vw,56px)', borderRadius: 'var(--radius-xl)',
              textAlign: 'center', boxShadow: 'var(--shadow-soft)' }}>
              <Eyebrow>Pacote completo</Eyebrow>
              <div style={{ fontSize: 'clamp(2rem,4vw,2.6rem)', fontWeight: 800, fontFamily: 'var(--font-display)', margin: '14px 0 8px', letterSpacing: '-0.02em' }}>
                R$ 1.490 <span style={{ fontSize: 16, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>· por imóvel</span>
              </div>
              <p style={{ color: 'rgba(245,248,250,0.85)', fontSize: 16, maxWidth: 540, margin: '0 auto 28px' }}>
                Análise completa · 4 frentes · relatório com semáforo de risco · suporte do advogado durante toda a transação.
              </p>
              <button onClick={() => window.dispatchEvent(new CustomEvent('vnprime:consultor'))}
                style={{ padding: '14px 32px', background: 'var(--gold)', color: 'var(--navy-deep)', border: 'none', borderRadius: 999, fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                Contratar due diligence
              </button>
              <div style={{ marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                Cliente VN Prime · 20% de desconto na primeira análise
              </div>
            </div>
          </section>
        </>
      )}

      {/* ── Central de Certidões tab ── */}
      {tab === 'certidoes' && (
        <>
          {/* Essenciais strip */}
          <section style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '18px 0' }}>
            <div style={{ width: 'min(1180px,92vw)', margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--fg-3)', flexShrink: 0 }}>Essenciais:</span>
                {essenciais.map(c => (
                  <span key={c.id} style={{ background: '#F6D77A', color: 'var(--navy)', padding: '4px 12px', borderRadius: 99, fontSize: 13, fontWeight: 600, flexShrink: 0, whiteSpace: 'nowrap' }}>{c.nome}</span>
                ))}
              </div>
            </div>
          </section>

          {/* Filter bar */}
          <section style={{ background: 'var(--cream)', padding: '24px 0 0' }}>
            <div style={{ width: 'min(1180px,92vw)', margin: '0 auto' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: '1 1 auto' }}>
                  {CAT_LABELS.map(cat => (
                    <button key={cat.key} onClick={() => setCertFilter(f => ({ ...f, cat: cat.key }))}
                      style={{ padding: '6px 14px', borderRadius: 99, border: '1px solid', cursor: 'pointer', transition: 'all 0.15s', fontSize: 13, fontWeight: 600,
                        borderColor: certFilter.cat === cat.key ? 'var(--navy)' : 'var(--border)',
                        background: certFilter.cat === cat.key ? 'var(--navy)' : '#fff',
                        color: certFilter.cat === cat.key ? '#fff' : 'var(--fg-2)',
                      }}>{cat.label}</button>
                  ))}
                  {[['todos','Todos'],['vendedor','Vendedor'],['imovel','Imóvel']].map(([k, l]) => (
                    <button key={k} onClick={() => setCertFilter(f => ({ ...f, sobre: k }))}
                      style={{ padding: '6px 14px', borderRadius: 99, border: '1px solid', cursor: 'pointer', transition: 'all 0.15s', fontSize: 13, fontWeight: 600,
                        borderColor: certFilter.sobre === k ? '#3B82F6' : 'var(--border)',
                        background: certFilter.sobre === k ? '#3B82F6' : '#fff',
                        color: certFilter.sobre === k ? '#fff' : 'var(--fg-2)',
                      }}>{l}</button>
                  ))}
                </div>
                <input type="text" placeholder="Buscar certidão..."
                  value={certFilter.search}
                  onChange={e => setCertFilter(f => ({ ...f, search: e.target.value }))}
                  style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, outline: 'none', minWidth: 180 }} />
                <button onClick={handlePrint}
                  style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', color: 'var(--navy)', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  🖨️ Imprimir checklist
                </button>
              </div>

              {/* Cards grid */}
              <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fill,minmax(520px,1fr))', paddingBottom: 60 }}>
                {filteredCerts.length === 0 && (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '48px 0', color: 'var(--fg-3)' }}>
                    Nenhuma certidão encontrada para os filtros selecionados.
                  </div>
                )}
                {filteredCerts.map(c => {
                  const isExpanded = expandedCert === c.id
                  return (
                    <div key={c.id} style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: isExpanded ? '0 4px 20px rgba(0,0,0,0.08)' : 'none', transition: 'box-shadow 0.2s' }}>
                      <div style={{ display: 'flex', gap: 0, alignItems: 'stretch' }}>
                        <div style={{ flex: 1, padding: '18px 20px' }}>
                          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--navy)', marginBottom: 3 }}>{c.nome}</div>
                          <div style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.5 }}>{c.para}</div>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                            <span style={{ background: '#f3f4f6', color: '#374151', padding: '2px 9px', borderRadius: 99, fontSize: 11, fontWeight: 600 }}>
                              {CAT_LABELS.find(x => x.key === c.categoria)?.label || c.categoria}
                            </span>
                            <span style={{ background: '#eff6ff', color: '#1e40af', padding: '2px 9px', borderRadius: 99, fontSize: 11, fontWeight: 600 }}>
                              {c.sobre === 'vendedor' ? 'Vendedor' : 'Imóvel'}
                            </span>
                            {c.essencial && (
                              <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 9px', borderRadius: 99, fontSize: 11, fontWeight: 600 }}>Essencial</span>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '18px 20px', borderLeft: '1px solid var(--border)', minWidth: 150 }}>
                          {c.gratis
                            ? <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: 99, fontSize: 13, fontWeight: 700 }}>🟢 Grátis</span>
                            : <div style={{ textAlign: 'center' }}>
                                <span style={{ background: '#fee2e2', color: '#991b1b', padding: '4px 12px', borderRadius: 99, fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 4 }}>🔴 Paga</span>
                                <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>{c.custo}</span>
                              </div>
                          }
                          <a href={c.link} target="_blank" rel="noopener noreferrer"
                            style={{ display: 'block', textAlign: 'center', padding: '7px 14px', borderRadius: 8, background: 'var(--navy)', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                            Abrir portal →
                          </a>
                        </div>
                      </div>
                      <button onClick={() => setExpandedCert(isExpanded ? null : c.id)}
                        style={{ width: '100%', padding: '10px 20px', border: 'none', borderTop: '1px solid var(--border)', background: isExpanded ? '#f8fafc' : 'transparent', color: 'var(--fg-2)', fontSize: 13, fontWeight: 500, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ transition: 'transform 0.2s', display: 'inline-block', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
                        {isExpanded ? 'Ocultar detalhes' : 'Ver instruções de emissão'}
                      </button>
                      {isExpanded && (
                        <div style={{ padding: '16px 20px 20px', background: '#f8fafc', borderTop: '1px solid var(--border)' }}>
                          <p style={{ fontSize: 14, color: 'var(--fg-1)', lineHeight: 1.6, margin: '0 0 12px' }}>{c.instrucao}</p>
                          {c.cartorio && (
                            <div style={{ marginTop: 12 }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', marginBottom: 8 }}>💬 Como falar no cartório:</div>
                              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', position: 'relative' }}>
                                <p style={{ fontSize: 13, color: 'var(--fg-1)', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>"{c.cartorio}"</p>
                                <button
                                  onClick={() => { try { navigator.clipboard.writeText(c.cartorio!) } catch(e) {} }}
                                  style={{ position: 'absolute', top: 8, right: 8, padding: '3px 10px', borderRadius: 6, border: '1px solid var(--border)', background: '#fff', color: 'var(--fg-2)', fontSize: 11, cursor: 'pointer' }}>
                                  Copiar
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  )
}
