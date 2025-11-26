export function getFlagSrc(countryCode) {
  if (!countryCode || typeof countryCode !== 'string') {
    return null
  }

  const code = countryCode.trim().toLowerCase()

  if (!code || code.length !== 2) {
    return null
  }

  return new URL(`/src/assets/images/flags/${code}.png`, import.meta.url).href
}