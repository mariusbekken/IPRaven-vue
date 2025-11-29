// FERDIG: src/utils/fingerprint/features.js
import { hashString } from './hash.js'

function detectFonts() {
    if (typeof document === 'undefined') {
        return { supported: false, reason: 'No document', detected: [], testedCount: 0}
    }

    var testFonts = [
        'Arial',
        'Verdana',
        'Times New Roman',
        'Courier New',
        'Georgia',
        'Trebuchet MS',
        'Comic Sans MS',
        'Impact',
        'Segoe UI',
        'Roboto',
        'Open Sans',
        'Helvetica'
    ]

    var baseFonts = ['monospace', 'sans-serif', 'serif']
    var text = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
    var size = '72px'

    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')

    if (!ctx) {
        return { supported: false, reason: 'Canvas 2D not available', detected: [], testedCount: 0}
    }

    function getWidth(font) {
        ctx.font = size + ' ' + font
        return ctx.measureText(text).width
    }

    var baseWidths = {}
    for (var i = 0; i < baseFonts.length; i++) {
        var bf = baseFonts[i]
        baseWidths[bf] = getWidth(bf)
    }

    var detected = []
    for (var j = 0; j < testFonts.length; j++) {
        var fontName = testFonts[j]
        var found = false

        for (var k = 0; k < baseFonts.length; k++) {
            var base = baseFonts[k]
            var baseWidth = baseWidths[base]
            var w = getWidth('"' + fontName + '",' + base)

            if (w !== baseWidth) {
                detected.push(fontName)
                found = true
                break
            }
        }

        if (found) {
            detected.push(fontName)
        }
    }

    return { supported: true, detected: detected, testedCount: testFonts.length, hash: hashString(detected.join('|')) }
}

function detectFeatures() {
    if (typeof window === 'undefined') {
        return { supported: false, reason: 'No window' }
    }

    var cssSupports = typeof window.CSS !== 'undefined' && typeof window.CSS.supports === 'function'

    function css(prop, valye) {
        if (!cssSupports) return null

        try {
            return window.CSS.supports(prop, valye)
        } catch (e) {
            return null
        }
    }

    var hasBattery = false
    try {
        hasBattery = !!navigator.getBattery
    } catch (e) {
        hasBattery = false
    }

    var hasGamepad = false
    try {
        hasGamepad = typeof navigator.getGamepads === 'function'
    } catch (e) {
        hasGamepad = false
    }

    var hasWebRTC = typeof window.RTCPeerConnection === 'function' || typeof window.webkitRTCPeerConnection === 'function' || typeof window.mozRTCPeerConnection === 'function'
    var hasWebSocket = typeof window.WebSocket === 'function'
    var hasServiceWorker = typeof navigator.serviceWorker !== 'undefined' && typeof navigator.serviceWorker.register === 'function'
    var hasDeviceMemory = typeof navigator.hasDeviceMemory === 'number'
    var hasPerformanceNow = typeof window.performance !== 'undefined' && typeof window.performance.now === 'function'

    return {
        supported: true,
        cssGrid: css('display', 'grid'),
        cssBackdropFilter: css('backdrop-filter', 'blur(1px)'),
        cssSubgrid: css('grid-template-rows', 'subgrid'),
        battery: hasBattery,
        gamepad: hasGamepad,
        webRTC: hasWebRTC,
        webSocket: hasWebSocket,
        serviceWorker: hasServiceWorker,
        deviceMemory: hasDeviceMemory,
        performanceNow: hasPerformanceNow
    }
}

export function detectFontsAndFeatures() {
    var fonts = detectFonts()
    var features = detectFeatures()

    return {
        fonts: fonts,
        features: features
    }
}