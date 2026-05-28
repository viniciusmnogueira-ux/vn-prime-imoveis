// Usage: node scripts/set-admin.mjs <email>
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
const email = process.argv[2]

if (!url || !key || !email) {
  console.error('Missing env vars or email arg')
  process.exit(1)
}

const headers = {
  'apikey': key,
  'Authorization': `Bearer ${key}`,
  'Content-Type': 'application/json',
}

// 1. Find user by email via admin API
const usersRes = await fetch(`${url}/auth/v1/admin/users?per_page=1000`, { headers })
const usersData = await usersRes.json()
const user = usersData.users?.find(u => u.email === email)
if (!user) { console.error(`No user found: ${email}`); process.exit(1) }

// 2. Upsert profile with tipo=admin
const upsertRes = await fetch(`${url}/rest/v1/profiles`, {
  method: 'POST',
  headers: { ...headers, 'Prefer': 'resolution=merge-duplicates' },
  body: JSON.stringify({ id: user.id, email: user.email, tipo: 'admin', plano_ativo: true }),
})

if (!upsertRes.ok) {
  const err = await upsertRes.text()
  console.error('Upsert failed:', err)
  process.exit(1)
}

console.log(`✅ ${email} (${user.id}) is now admin`)
