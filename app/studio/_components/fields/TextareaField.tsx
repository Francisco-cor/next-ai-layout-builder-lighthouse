'use client'
interface TextareaFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  rows?: number
  placeholder?: string
}

export function TextareaField({ label, value, onChange, rows = 4, placeholder }: TextareaFieldProps) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </span>
      <textarea
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        style={{
          padding: '0.5rem 0.75rem',
          borderRadius: '6px',
          border: '1px solid #e2e8f0',
          fontSize: '0.9375rem',
          color: '#0f172a',
          backgroundColor: '#fff',
          outline: 'none',
          resize: 'vertical',
          fontFamily: 'inherit',
          lineHeight: 1.6,
          width: '100%',
        }}
        onFocus={(e) => (e.target.style.borderColor = '#4f46e5')}
        onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
      />
    </label>
  )
}
