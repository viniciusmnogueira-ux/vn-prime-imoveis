// Usage: node scripts/set-admin.mjs vinicius.mnogueira@gmail.com
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kwdexcshqgekbhxaglsg.supabase.co'
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!key) {
  console.error('Set SUPABASE_SERVICE_ROLE_KEY env var first')
  process.exit(1)
}

const email = process.argv[2]
if (!email) {
  console.error('Usage: node scripts/set-admin.mjs <email>')
  process.exit(1)
}

const sb = createClient(url, key, { auth: { persistSession: false } })

// Find user by email in auth.users
const { data: users, error: e1 } = await sb.auth.admin.listUsers()
if (e1) { console.error(e1.message); process.exit(1) }

const user = users.users.find(u => u.email === email)
if (!user) { console.error(`No auth user found with email: ${email}`); process.exit(1) }

// Upsert profile with tipo = 'admin'
const { error: e2 } = await sb.from('profiles').upsert({
  id: user.id,
  email: user.email,
  tipo: 'admin',
  plano_ativo: true,
}, { onConflict: 'id' })

if (e2) { console.error(e2.message); process.exit(1) }

console.log(`✅ ${email} (${user.id}) is now admin`)
