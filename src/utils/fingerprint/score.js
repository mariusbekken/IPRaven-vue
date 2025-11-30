// FERDIG: src/utils/fingerprint/score.js
export function computeRealismScore(fp) {
    if (!fp || !fp.available) {
        return { total: 0, bits: 0, level: 'unknown', label: 'Unknown', message: 'No fingerprint data available.', breakdown: {} }
    }

    var score = 0
    var bits = 0
    var breakdown = {}

    var cores = fp.hardware && fp.hardware.cores
    if (cores) {
        var sCores = cores >= 16 ? 12 : cores >= 8 ? 9 : cores >= 4 ? 6 : 3
        score += sCores
        bits += sCores
        breakdown.cores = sCores
    }

    var w = fp.screen && fp.screen.width
    var h = fp.screen && fp.screen.height
    if (w && h) {
        var pixels = w * h
        var sScreen = pixels >= 3840 * 2160 ? 12 : pixels >= 2560 * 1440 ? 10 : pixels >= 1920 * 1080 ? 8 : 6
        score += sScreen
        bits += sScreen
        breakdown.screen = sScreen
    }

    var langs = (fp.basic && fp.basic.languages) || []
    if (langs.length > 0) {
        var sLangs = langs.length >= 3 ? 10 : langs.length === 3 ? 8 : langs.length === 2 ? 6 : 4
        score += sLangs
        bits += sLangs
        breakdown.languages = sLangs
    }

    if (fp.browser && fp.browser.timezone) {
        var sTz = 6
        score += sTz
        bits += sTz
        breakdown.timezone = sTz
    }

    var fontCount = fp.fonts && fp.fonts.detected && fp.fonts.detected.length ? fp.fonts.detected.length : 0
    if (fontCount > 0) {
        var sFonts = fontCount >= 15 ? 16 : fontCount >= 8 ? 12 : fontCount >= 4 ? 8 : 4
        score += sFonts
        bits += sFonts
        breakdown.fonts = sFonts
    }

    if (fp.canvas && fp.canvas.supported) {
        score += 8
        bits += 8
        breakdown.canvas = 8
    }

    if (fp.webgl && fp.webgl.supported) {
        score += 8
        bits += 8
        breakdown.webgl = 8
    }

    if (fp.audio && fp.audio.supported) {
        score += 8
        bits += 8
        breakdown.audio = 8
    }

    var feat = fp.features || {}
    var featCount = 0
    var featKeys = ['cssGrid', 'cssBackdropFilter', 'cssSubgrid', 'battery', 'gamepad', 'webRTC', 'webSocket', 'serviceWorker', 'deviceMemory', 'performanceNow']

    for (var i = 0; i < featKeys.length; i++) {
        var k = featKeys[i]
        if (feat[k]) featCount++
    }

    if (featCount > 0) {
        var sFeat = featCount >= 7 ? 10 : featCount >= 4 ? 7 : 4
        score += sFeat
        bits += sFeat
        breakdown.features = sFeat
    }

    var dnt = fp.security && fp.security.doNotTrack
    if (dnt === '1') {
        score += 2
        bits += 2
        breakdown.doNotTrack = 2
    }

    if (fp.security && fp.security.cookiesEnabled === false) {
        score += 4
        bits += 4
        breakdown.cookiesDisabled = 4
    }

    if (score > 100) score = 100

    var level = 'low'
    var label = 'Low uniqueness'
    var message = ''
    if (score < 30) {
        level = 'low'
        label = 'Low uniqueness'
        message = 'Your browser fingerprint looks fairly generic. Websites will still be able to recognize you, but many other users share similar hardware and browser traits.'
    } else if (score < 60) {
        level = 'medium'
        label = 'Moderate uniqueness'
        message = 'Your browser fingerprint is somewhat unique. Trackers can likely distinguish you from most users, especially if they combine this with IP, cookies or login data.'
    } else if (score < 80) {
        level = 'high'
        label = 'High uniqueness'
        message = 'Your browser fingerprint is highly unique. Things like your hardware, screen, fonts and WebGL/audio characteristics make you stand out from the crowd.'
    } else {
        level = 'very_high'
        label = 'Extremely fingerprintable'
        message = 'Your browser fingerprint is extremely unique. Even without cookies, long-lived trackers could reliably recognize this device across many different websites.'
    }

    var extras = []
    if (cores && cores >= 12) extras.push('many CPU cores')
    if (fontCount >= 10 ) extras.push('a distinctive set of fonts installed')
    if (featCount >= 7) extras.push('lots of advanced browser APIs enabled')
    if (extras.length) {
        message += ' In your case this is mostly driven by ' + extras.join(' and ') + '.'
    }

    return { total: score, bits: bits, level: level, label: label, message: message, breakdown: breakdown }
}