export const successStyle = {
  style: {
    '--normal-bg': 'light-dark(var(--color-green-600), var(--color-green-400))',
    '--normal-text': 'var(--color-white)',
    '--normal-border': 'light-dark(var(--color-green-600), var(--color-green-400))'
  } as React.CSSProperties
}
export const warningStyle = {
  style: {
    '--normal-bg': 'light-dark(var(--color-sky-600), var(--color-sky-400))',
    '--normal-text': 'var(--color-white)',
    '--normal-border': 'light-dark(var(--color-sky-600), var(--color-sky-400))',
    fontSize: '14px',          // Varsayılan genelde 14px'dir, 16px veya 18px deneyebilirsin
    fontWeight: '600',         // Metni biraz daha kalın ve okunaklı yapar
    padding: '16px'
  } as React.CSSProperties,
  position:"top-right" as const
};