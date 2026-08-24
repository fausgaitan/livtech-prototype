import { createContext, useContext, useState, type ReactNode } from 'react'

/**
 * Prototype visual variants, driven by the Prototype Options switcher.
 * A - High Contrast (the original purple-shell skin)
 * B - Minimalistic (light shell, subtle purple sidebar gradient, thin charts)
 * C - Subtle Gradient (light floating shell on a blue→purple gradient)
 */
export type VariantKey = 'A' | 'B' | 'C'

export const variantLabels: Record<VariantKey, string> = {
  A: 'Option A - High Contrast',
  B: 'Option B - Minimalistic',
  C: 'Option C - Subtle Gradient',
}

type VariantContextValue = {
  variant: VariantKey
  setVariant: (v: VariantKey) => void
  /** True when the Subtle Gradient skin is active. */
  isGradient: boolean
  /** True when the Minimalistic skin is active. */
  isMinimal: boolean
}

const VariantContext = createContext<VariantContextValue | null>(null)

export function VariantProvider({ children }: { children: ReactNode }) {
  const [variant, setVariant] = useState<VariantKey>('A')
  return (
    <VariantContext.Provider
      value={{
        variant,
        setVariant,
        isGradient: variant === 'C',
        isMinimal: variant === 'B',
      }}
    >
      {children}
    </VariantContext.Provider>
  )
}

export function useVariant() {
  const ctx = useContext(VariantContext)
  if (!ctx) throw new Error('useVariant must be used within VariantProvider')
  return ctx
}
