function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function cloneDeep<T>(value: T): T {
  if (typeof value !== 'object' || value === null) {
    return value
  }

  if (Array.isArray(value)) {
    return value.map(cloneDeep) as unknown as T
  }

  const cloned: Record<string, unknown> = {}
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      cloned[key] = cloneDeep((value as Record<string, unknown>)[key])
    }
  }
  return cloned as T
}

function isMergeable(a: unknown, b: unknown): boolean {
  return (Array.isArray(a) && Array.isArray(b)) || (isPlainObject(a) && isPlainObject(b))
}

export function deepMerge<T, U>(target: T, source: U): T & U {
  if (Array.isArray(target) && Array.isArray(source)) {
    const merged: unknown[] = []
    const maxLength = Math.max(target.length, source.length)
    for (let i = 0; i < maxLength; i++) {
      const targetItem = i < target.length ? (target as unknown[])[i] : undefined
      const sourceItem = i < source.length ? (source as unknown[])[i] : undefined

      if (sourceItem !== undefined) {
        if (targetItem !== undefined && isMergeable(targetItem, sourceItem)) {
          merged[i] = deepMerge(targetItem, sourceItem)
        } else {
          merged[i] = cloneDeep(sourceItem)
        }
      } else {
        merged[i] = cloneDeep(targetItem)
      }
    }
    return merged as unknown as T & U
  }

  if (isPlainObject(target) && isPlainObject(source)) {
    const merged = { ...target } as Record<string, unknown>
    for (const key of Object.keys(source)) {
      const sourceValue = (source as Record<string, unknown>)[key]
      const targetValue = (target as Record<string, unknown>)[key]

      if (Object.prototype.hasOwnProperty.call(merged, key)) {
        if (isMergeable(targetValue, sourceValue)) {
          merged[key] = deepMerge(targetValue, sourceValue)
        } else {
          merged[key] = cloneDeep(sourceValue)
        }
      } else {
        merged[key] = cloneDeep(sourceValue)
      }
    }
    return merged as T & U
  }

  return cloneDeep(source) as T & U
}
