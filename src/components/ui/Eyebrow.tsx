interface EyebrowProps {
  children: React.ReactNode
  color?: string
}

export default function Eyebrow({ children, color = 'var(--gold-deep)' }: EyebrowProps) {
  return (
    <div style={{
      fontFamily: "var(--font-body)",
      fontSize: '0.7rem', fontWeight: 700,
      letterSpacing: '0.22em', textTransform: 'uppercase',
      color,
    }}>
      {children}
    </div>
  )
}
