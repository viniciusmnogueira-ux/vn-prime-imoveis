// Script para executar SQL no Supabase via pg direto
// Usage: node scripts/run-sql.mjs

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing env vars')
  process.exit(1)
}

const { createClient } = await import('@supabase/supabase-js')
const { default: ws } = await import('ws')

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  realtime: { transport: ws },
})

// Verifica profiles existentes
const { data: profiles, error: pe } = await supabase
  .from('profiles')
  .select('id, email, tipo, plano')
  .order('criado_em', { ascending: false })
  .limit(10)

if (pe) {
  console.error('Error reading profiles:', pe.message)
} else {
  console.log('\n=== Profiles (últimos 10) ===')
  profiles.forEach(p => {
    console.log(`  ${p.email} | tipo: ${p.tipo} | plano: ${p.plano ?? 'null'}`)
  })
}

// Verifica imoveis
const { data: imoveis, error: ie } = await supabase
  .from('imoveis')
  .select('id, titulo, status, proprietario_id, plano_label')
  .order('criado_em', { ascending: false })
  .limit(5)

if (ie) {
  console.error('Error reading imoveis:', ie.message)
} else {
  console.log('\n=== Imóveis (últimos 5) ===')
  imoveis.forEach(i => {
    console.log(`  ${i.titulo} | status: ${i.status} | plano: ${i.plano_label ?? 'null'}`)
  })
}

// Verifica leads
const { data: leads, error: le } = await supabase
  .from('leads')
  .select('id, nome, email, criado_em')
  .order('criado_em', { ascending: false })
  .limit(5)

if (le) {
  console.error('Error reading leads:', le.message)
} else {
  console.log('\n=== Leads (últimos 5) ===')
  leads.forEach(l => {
    console.log(`  ${l.nome} | ${l.email} | ${new Date(l.criado_em).toLocaleDateString('pt-BR')}`)
  })
}

// Fix: garantir que todos os users sem plano recebam 'direta'
console.log('\n=== Corrigindo profiles sem plano ===')
const { data: semPlano } = await supabase
  .from('profiles')
  .select('id, email')
  .is('plano', null)

if (semPlano?.length) {
  for (const p of semPlano) {
    const { error: ue } = await supabase
      .from('profiles')
      .update({ plano: 'direta' })
      .eq('id', p.id)
    if (ue) {
      console.log(`  ERRO ${p.email}: ${ue.message}`)
    } else {
      console.log(`  ✅ ${p.email} → plano: direta`)
    }
  }
} else {
  console.log('  Todos os profiles já têm plano definido.')
}

console.log('\n✅ Diagnóstico e correção concluídos.')
console.log('\n⚠️  ATENÇÃO: Execute o SQL abaixo no Supabase Dashboard → SQL Editor:')
console.log(`
-- Copie e cole no SQL Editor do Supabase:
DROP POLICY IF EXISTS "admin manages all profiles" ON public.profiles;
CREATE POLICY "admin manages all profiles"
  ON public.profiles FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
`)
