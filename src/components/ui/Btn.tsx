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
  gap: 8, fontFamily: "var(--font-body)", fontWeight: 600,
  borderRadius: 999, border: 'none', cursor: 'pointer',
  transition: 'opacity 0.15s, transform 0.15s', textDecoration: 'none',
  whiteSpace: 'nowrap',
}

const variants: Record<Variant, React.CSSProperties> = {
  primary:      { background: 'var(--navy)',                                      color: 'var(--cream)',  boxShadow: '0 4px 18px rgba(27,39,51,0.18)' },
  accent:       { background: 'linear-gradient(135deg,#D4A857 0%,#B8862E 100%)', color: 'var(--navy)',   boxShadow: '0 4px 18px rgba(212,168,87,0.32)' },
  ghost:        { background: 'transparent',                                      color: 'var(--navy)',   border: '1px solid var(--border-strong)' },
  'ghost-light':{ background: 'rgba(255,255,255,0.04)',                           color: '#F5F8FA',       border: '1px solid rgba(245,248,250,0.32)' },
  danger:       { background: '#DC2626',                                          color: '#fff' },
}

const sizes: Record<Size, React.CSSProperties> = {
  sm: { padding: '7px 18px',  fontSize: 13 },
  md: { padding: '10px 22px', fontSize: 14 },
  lg: { padding: '13px 30px', fontSize: 15 },
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
