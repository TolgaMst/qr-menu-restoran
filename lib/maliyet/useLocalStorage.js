import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  const prefixedKey = `maliyet_${key}`

  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const item = window.localStorage.getItem(prefixedKey)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(prefixedKey, JSON.stringify(storedValue))
    } catch {
      // ignore write errors
    }
  }, [prefixedKey, storedValue])

  return [storedValue, setStoredValue]
}
