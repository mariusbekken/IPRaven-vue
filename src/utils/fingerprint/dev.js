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

// src/utils/fingerprint/base.js
export function collectBaseFingerprint() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      available: false,
      reason: 'Not running in a browser environment'
    }
  }

  var ua = navigator.userAgent || null
  var platform = navigator.platform || null
  var vendor = navigator.vendor || null

  var languages = []
  if (navigator.languages && navigator.languages.length) {
    languages = navigator.languages.slice()
  } else if (navigator.language) {
    languages = [navigator.language]
  }

  var timezone = null
  try {
    var opts = Intl.DateTimeFormat().resolvedOptions()
    timezone = opts.timeZone || null
  } catch (e) {
    timezone = null
  }

  var screenInfo = null
  if (typeof screen !== 'undefined') {
    screenInfo = {
      width: typeof screen.width === 'number' ? screen.width : null,
      height: typeof screen.height === 'number' ? screen.height : null,
      availWidth:
        typeof screen.availWidth === 'number' ? screen.availWidth : null,
      availHeight:
        typeof screen.availHeight === 'number' ? screen.availHeight : null,
      colorDepth:
        typeof screen.colorDepth === 'number' ? screen.colorDepth : null,
      pixelRatio:
        typeof window.devicePixelRatio === 'number'
          ? window.devicePixelRatio
          : 1
    }
  }

  function testLocalStorage() {
    try {
      var key = '__fp_test_ls__'
      window.localStorage.setItem(key, '1')
      window.localStorage.removeItem(key)
      return true
    } catch (e) {
      return false
    }
  }

  function testSessionStorage() {
    try {
      var key = '__fp_test_ss__'
      window.sessionStorage.setItem(key, '1')
      window.sessionStorage.removeItem(key)
      return true
    } catch (e) {
      return false
    }
  }

  function testIndexedDB() {
    try {
      return typeof window.indexedDB !== 'undefined'
    } catch (e) {
      return false
    }
  }

  var hasTouch =
    'ontouchstart' in window ||
    (navigator.maxTouchPoints && navigator.maxTouchPoints > 0)

  var connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection ||
    null

  var dnt =
    navigator.doNotTrack ||
    window.doNotTrack ||
    navigator.msDoNotTrack ||
    null

  var secureContext = null
  if (typeof window.isSecureContext === 'boolean') {
    secureContext = window.isSecureContext
  }

  var online = null
  if (typeof navigator.onLine === 'boolean') {
    online = navigator.onLine
  }

  var hwCores =
    typeof navigator.hardwareConcurrency === 'number'
      ? navigator.hardwareConcurrency
      : null

  var memGB =
    typeof navigator.deviceMemory === 'number'
      ? navigator.deviceMemory
      : null

  var maxTouchPoints =
    typeof navigator.maxTouchPoints === 'number' ? navigator.maxTouchPoints : 0

  var networkInfo = null
  if (connection) {
    networkInfo = {
      effectiveType: connection.effectiveType || null,
      downlinkMbps:
        typeof connection.downlink === 'number' ? connection.downlink : null,
      rttMs: typeof connection.rtt === 'number' ? connection.rtt : null,
      saveData:
        typeof connection.saveData === 'boolean' ? connection.saveData : null
    }
  }

  return {
    available: true,
    basic: {
      userAgent: ua,
      platform: platform,
      vendor: vendor,
      languages: languages
    },
    browser: {
      timezone: timezone,
      online: online
    },
    screen: screenInfo,
    hardware: {
      cores: hwCores,
      memoryGB: memGB
    },
    input: {
      touchSupport: hasTouch,
      maxTouchPoints: maxTouchPoints
    },
    security: {
      doNotTrack: dnt,
      cookiesEnabled:
        typeof navigator.cookieEnabled === 'boolean'
          ? navigator.cookieEnabled
          : null,
      localStorage: testLocalStorage(),
      sessionStorage: testSessionStorage(),
      indexedDB: testIndexedDB(),
      secureContext: secureContext
    },
    network: networkInfo
  }
}

// src/utils/fingerprint/canvas.js
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

  return {
    supported: true,
    hash: hash,
    dataUrlLength: dataUrl.length
  }
}

export function getWebglFingerprint() {
  if (typeof document === 'undefined') {
    return { supported: false, reason: 'No document' }
  }

  var canvas = document.createElement('canvas')
  var gl =
    canvas.getContext('webgl') ||
    canvas.getContext('experimental-webgl')

  if (!gl) {
    return { supported: false, reason: 'WebGL not supported' }
  }

  // TRY MODERN APPROACH FIRST (no extension)
  let vendor = null
  let renderer = null

  try {
    vendor = gl.getParameter(gl.VENDOR) || null
    renderer = gl.getParameter(gl.RENDERER) || null
  } catch (e) {
    vendor = null
    renderer = null
  }

  // WebGL version
  let version = null
  let shadingLang = null
  try {
    version = gl.getParameter(gl.VERSION) || null
    shadingLang = gl.getParameter(gl.SHADING_LANGUAGE_VERSION) || null
  } catch (e) {
    version = null
    shadingLang = null
  }

  // Extensions
  let extensions = []
  try {
    extensions = gl.getSupportedExtensions() || []
  } catch {
    extensions = []
  }

  const fingerprintString =
    'v=' + (version || '') +
    ';sl=' + (shadingLang || '') +
    ';ven=' + (vendor || '') +
    ';ren=' + (renderer || '') +
    ';ext=' + extensions.join(',')

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

// src/utils/fingerprint/features.js
import { hashString } from './hash.js'

function detectFonts() {
  if (typeof document === 'undefined') {
    return {
      supported: false,
      reason: 'No document',
      detected: [],
      testedCount: 0
    }
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

  var baseFonts = ['monospace', 'serif', 'sans-serif']
  var text = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
  var size = '72px'

  var canvas = document.createElement('canvas')
  var ctx = canvas.getContext('2d')
  if (!ctx) {
    return {
      supported: false,
      reason: 'Canvas 2D not available',
      detected: [],
      testedCount: 0
    }
  }

  function getWidth(font) {
    ctx.font = size + ' ' + font
    return ctx.measureText(text).width
  }

  // baseline widths for generic families
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
        found = true
        break
      }
    }

    if (found) {
      detected.push(fontName)
    }
  }

  return {
    supported: true,
    detected: detected,
    testedCount: testFonts.length,
    hash: hashString(detected.join('|'))
  }
}

function detectFeatures() {
  if (typeof window === 'undefined') {
    return {
      supported: false,
      reason: 'No window'
    }
  }

  var cssSupports =
    typeof window.CSS !== 'undefined' && typeof window.CSS.supports === 'function'

  function css(prop, value) {
    if (!cssSupports) return null
    try {
      return window.CSS.supports(prop, value)
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

  var hasWebRTC =
    typeof window.RTCPeerConnection === 'function' ||
    typeof window.webkitRTCPeerConnection === 'function'

  var hasWebSocket = typeof window.WebSocket === 'function'
  var hasServiceWorker =
    typeof navigator.serviceWorker !== 'undefined' &&
    typeof navigator.serviceWorker.register === 'function'

  var hasDeviceMemory = typeof navigator.deviceMemory === 'number'
  var hasPerformanceNow =
    typeof window.performance !== 'undefined' &&
    typeof window.performance.now === 'function'

  return {
    supported: true,
    cssGrid: css('display', 'grid'),
    cssBackdropFilter: css('backdrop-filter', 'blur(1px)'),
    cssSubgrid: css('grid-template-columns', 'subgrid'),
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
