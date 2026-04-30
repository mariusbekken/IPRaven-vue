import { hashString } from './hash.js'

export function getCanvasFingerprint() {
    if (typeof document === 'undefined') {
        return { supported: false, reason: 'No document' }
    }

    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')

    if (!ctx) {
        return { supported: false, reason: '2D context not available' }
    }

    canvas.width = 240
    canvas.height = 60

    ctx.textBaseline = 'top'
    ctx.font = "16px 'Arial'"
    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = '#f60'
    ctx.fillRect(0, 0, 240, 60)

    ctx.fillStyle = '#069'
    ctx.fillText('Outcast Fingerprint Demo', 4, 17)
    ctx.strokeStyle = '#ff0'
    ctx.arc(120, 30, 20, 0, Math.PI * 2)
    ctx.stroke()

    var dataUrl = ''
    try {
        dataUrl = canvas.toDataURL()
    } catch (e) {
        return { supported: false, reason: 'Canvas toDataURL blocked' }
    }

    var hash = hashString(dataUrl)
    return { supported: true, hash: hash, dataUrlLength: dataUrl.length }
}

export function getWebglFingerprint() {
    if (typeof document === 'undefined') {
        return { supported: false, reason: 'No document' }
    }

    var canvas = document.createElement('canvas')
    var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

    if (!gl) {
        return { supported: false, reason: 'WebGL not supported' }
    }

    let vendor = null
    let renderer = null

    try {
        vendor = gl.getParameter(gl.VENDOR) || null
        renderer = gl.getParameter(gl.RENDERER) || null
    } catch (e) {
        vendor = null
        renderer = null
    }

    let version = null
    let shadingLang = null

    try {
        version = gl.getParameter(gl.VERSION) || null
        shadingLang = gl.getParameter(gl.SHADING_LANGUAGE_VERSION) || null
    } catch (e) {
        version = null
        shadingLang = null
    }

    let extensions = []

    try {
        extensions = gl.getSupportedExtensions() || []
    } catch (e) {
        extensions = []
    }

    const fingerprintString = 'v=' + (version || '') + ';sl=' + (shadingLang || '') + ';ven=' + (vendor || '') + ';ren=' + (renderer || '') + ';ext=' + extensions.join(',')
    const hash = hashString(fingerprintString)

    return {
        supported: true,
        vendor,
        renderer,
        version,
        shadingLanguageVersion: shadingLang,
        extensionsCount: extensions.length,
        hash
    }
}