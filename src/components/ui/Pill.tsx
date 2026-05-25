type Tone = 'featured' | 'new' | 'default'

const tones: Record<Tone, React.CSSProperties> = {
  featured: { background: 'var(--gold)',  color: 'var(--navy-deep)', border: 'none' },
  new:      { background: 'var(--navy)',  color: '#fff',             border: 'none' },
  default:  { background: 'rgba(255,255,255,0.9)', color: 'var(--navy)', border: '1px solid var(--border)' },
}

export default function Pill({ children, tone = 'default' }: { children: React.ReactNode; tone?: Tone }) {
  return (
    <span style={{
      ...tones[tone],
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 10px', borderRadius: 999,
      fontSize: 10.5, fontWeight: 700,
      letterSpacing: '0.06em', textTransform: 'uppercase',
      backdropFilter: 'blur(6px)',
    }}>
      {children}
    </span>
  )
}
