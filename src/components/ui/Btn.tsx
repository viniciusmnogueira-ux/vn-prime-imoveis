'use client'
import { type ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'accent' | 'ghost' | 'ghost-light' | 'danger'
type Size    = 'sm' | 'md' | 'lg'

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  loading?: boolean
  href?: string
}

const base: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  gap: 8, fontFamily: "var(--font-body)", fontWeight: 700,
  borderRadius: 10, border: 'none', cursor: 'pointer',
  transition: 'opacity 0.15s, transform 0.15s', textDecoration: 'none',
  whiteSpace: 'nowrap',
}

const variants: Record<Variant, React.CSSProperties> = {
  primary:      { background: 'var(--navy)',      color: '#fff' },
  accent:       { background: 'var(--gold)',       color: 'var(--navy-deep)' },
  ghost:        { background: 'transparent',       color: 'var(--navy)',     border: '1.5px solid var(--border)' },
  'ghost-light':{ background: 'rgba(255,255,255,0.12)', color: '#fff',       border: '1.5px solid rgba(255,255,255,0.25)' },
  danger:       { background: '#DC2626',           color: '#fff' },
}

const sizes: Record<Size, React.CSSProperties> = {
  sm: { padding: '7px 16px',  fontSize: 13 },
  md: { padding: '10px 20px', fontSize: 14 },
  lg: { padding: '13px 28px', fontSize: 15 },
}

export default function Btn({ variant = 'primary', size = 'md', fullWidth, loading, children, style, ...props }: BtnProps) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      style={{ ...base, ...variants[variant], ...sizes[size], width: fullWidth ? '100%' : undefined, opacity: (loading || props.disabled) ? 0.6 : 1, ...style }}
      onMouseEnter={e => { if (!loading && !props.disabled) (e.currentTarget as HTMLButtonElement).style.opacity = '0.85' }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = (loading || props.disabled) ? '0.6' : '1' }}
    >
      {loading ? <span className="animate-spin" style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', display: 'inline-block' }} /> : null}
      {children}
    </button>
  )
}
