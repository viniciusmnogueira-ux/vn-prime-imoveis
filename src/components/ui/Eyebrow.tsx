interface EyebrowProps {
  children: React.ReactNode
  color?: string
}

export default function Eyebrow({ children, color = 'var(--gold-deep)' }: EyebrowProps) {
  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 11, fontWeight: 700,
      letterSpacing: '0.14em', textTransform: 'uppercase',
      color,
    }}>
      {children}
    </div>
  )
}
