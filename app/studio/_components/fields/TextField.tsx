'use client'
interface TextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function TextField({ label, value, onChange, placeholder }: TextFieldProps) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </span>
      <input
        type="text"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          padding: '0.5rem 0.75rem',
          borderRadius: '6px',
          border: '1px solid #e2e8f0',
          fontSize: '0.9375rem',
          color: '#0f172a',
          backgroundColor: '#fff',
          outline: 'none',
          transition: 'border-color 0.15s',
          width: '100%',
        }}
        onFocus={(e) => (e.target.style.borderColor = '#4f46e5')}
        onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
      />
    </label>
  )
}
