export const DEFAULT_POOL_TARGETS = {
  freeChlorine: { min: 2, max: 4 },
  pH: { min: 7.4, max: 7.6 },
  alkalinity: { min: 80, max: 120 },
  cya: { min: 30, max: 50 },
  salt: { min: 3000, max: 3400 },
} as const;

export const DEFAULT_SPA_TARGETS = {
  freeChlorine: { min: 3, max: 5 },
  pH: { min: 7.2, max: 7.6 },
  alkalinity: { min: 80, max: 120 },
  cya: { min: 0, max: 30 },
  salt: { min: 0, max: 0 },
} as const;
