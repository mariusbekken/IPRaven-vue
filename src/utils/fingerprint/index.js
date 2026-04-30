import { collectBaseFingerprint } from './base.js'
import { getCanvasFingerprint, getWebglFingerprint } from './canvas.js'
import { getAudioFingerprint } from './audio.js'
import { detectFontsAndFeatures } from './features.js'
import { computeRealismScore } from './score.js'

export async function collectFullFingerprint() {
    var base = collectBaseFingerprint()

    if (!base.available) {
        return base
    }

    var canvasFp = getCanvasFingerprint()
    var webglFp = getWebglFingerprint()
    var extra = detectFontsAndFeatures()

    var audioFp
    try {
        audioFp = await getAudioFingerprint()
    } catch (e) {
        audioFp = { available: false, reason: 'Audio fingerprint failed' }
    }

    base.canvas = canvasFp
    base.webgl = webglFp
    base.audio = audioFp
    base.fonts = extra.fonts
    base.features = extra.features

    var realism = computeRealismScore(base)
    base.realismScore = realism
    base.score = { total: realism.total, breakdown: realism.breakdown }

    return base
}