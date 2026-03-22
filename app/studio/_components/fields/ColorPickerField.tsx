'use client'

const PRESET_COLORS = [
  { label: 'Indigo', value: '#4f46e5' },
  { label: 'Slate', value: '#1e293b' },
  { label: 'Emerald', value: '#059669' },
  { label: 'Rose', value: '#e11d48' },
  { label: 'Amber', value: '#d97706' },
  { label: 'White', value: '#ffffff' },
]

interface ColorPickerFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export function ColorPickerField({ label, value, onChange }: ColorPickerFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
        {PRESET_COLORS.map((color) => (
          <button
            key={color.value}
            title={color.label}
            onClick={() => onChange(color.value)}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: color.value,
              border: value === color.value ? '3px solid #4f46e5' : '2px solid #e2e8f0',
              cursor: 'pointer',
              padding: 0,
              transition: 'transform 0.1s',
              boxShadow: value === color.value ? '0 0 0 2px #fff inset' : 'none',
            }}
            aria-pressed={value === color.value}
            aria-label={color.label}
          />
        ))}
        {/* Freeform color input */}
        <input
          type="color"
          value={value ?? '#4f46e5'}
          onChange={(e) => onChange(e.target.value)}
          title="Custom color"
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: '2px solid #e2e8f0',
            cursor: 'pointer',
            padding: '1px',
            backgroundColor: 'transparent',
          }}
        />
      </div>
    </div>
  )
}
