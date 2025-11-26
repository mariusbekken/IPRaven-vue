// src/utils/fingerprint/audio.js
import { hashString } from './hash.js'

export function getAudioFingerprint() {
  return new Promise(function (resolve) {
    if (typeof window === 'undefined') {
      resolve({ supported: false, reason: 'No window' })
      return
    }

    var OfflineAudioContext =
      window.OfflineAudioContext || window.webkitOfflineAudioContext

    if (!OfflineAudioContext) {
      resolve({ supported: false, reason: 'OfflineAudioContext not supported' })
      return
    }

    var context
    try {
      context = new OfflineAudioContext(1, 44100, 44100)
    } catch (e) {
      resolve({ supported: false, reason: 'Failed to create audio context' })
      return
    }

    var oscillator = context.createOscillator()
    var compressor = context.createDynamicsCompressor()

    oscillator.type = 'triangle'
    oscillator.frequency.value = 1000

    compressor.threshold && (compressor.threshold.value = -50)
    compressor.knee && (compressor.knee.value = 40)
    compressor.ratio && (compressor.ratio.value = 12)
    compressor.attack && (compressor.attack.value = 0)
    compressor.release && (compressor.release.value = 0.25)

    oscillator.connect(compressor)
    compressor.connect(context.destination)
    oscillator.start(0)

    context
      .startRendering()
      .then(function (buffer) {
        var channelData = buffer.getChannelData(0)
        var out = ''
        // sample litt ned for å få en kort hash-input
        for (var i = 0; i < channelData.length; i += 1000) {
          out += Math.abs(channelData[i]).toString()
        }
        var hash = hashString(out)
        resolve({
          supported: true,
          hash: hash
        })
      })
      .catch(function () {
        resolve({ supported: false, reason: 'Rendering failed' })
      })
  })
}
