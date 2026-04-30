export function hashString(str) {
    if (!str || typeof str !== 'string') return '0'

    var hash = 0
    for (var i = 0; i < str.length; i++) {
        var chr = str.charCodeAt(i)
        hash = (hash << 5) - hash + chr
        hash |= 0
    }

    return String(hash >>> 0)
}