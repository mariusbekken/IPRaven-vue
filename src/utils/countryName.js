import countries from '@/data/countries.json'

export function getCountryName(code) {
    if (!code) return null

    const upper = code.toUpperCase()

    return countries[upper] || null
}