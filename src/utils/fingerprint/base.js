// FERDIG: src/utils/fingerprint/base.js
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
            availWidth: typeof screen.availWidth === 'number' ? screen.availWidth : null,
            availHeight: typeof screen.availHeight === 'number' ? screen.availHeight : null,
            colorDepth: typeof screen.colorDepth === 'number' ? screen.colorDepth : null,
            pixelRatio: typeof window.devicePixelRatio === 'number' ? window.devicePixelRatio : 1
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

    var hasTouch =  'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoint > 0)
    var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection || null
    var dnt = navigator.doNotTrack || window.doNotTrack || navigator.webkitConnection ||null

    var secureContext = null
    if (typeof window.isSecureContext === 'boolean') {
        secureContext = window.isSecureContext
    }

    var online = null
    if (typeof window.navigator.onLine === 'boolean') {
        online = window.navigator.onLine
    }

    var hwCores = typeof navigator.hardwareConcurrency === 'number' ? navigator.hardwareConcurrency : null
    var memGB = typeof navigator.deviceMemory === 'number' ? navigator.deviceMemory : null
    var maxTouchPoints = typeof navigator.maxTouchPoints === 'number' ? navigator.maxTouchPoints : 0

    var networkInfo = null
    if (connection) {
        networkInfo = {
            effectiveType: connection.effectiveType || null,
            downlinkMbps: typeof connection.downlink === 'number' ? connection.downlink : null,
            rttMs: typeof connection.rtt === 'number' ? connection.rtt : null,
            saveData: typeof connection.saveData === 'boolean' ? connection.saveData : null
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
            cookiesEnabled: typeof navigator.cookieEnabled === 'boolean' ? navigator.cookieEnabled : null,
            localStorage: testLocalStorage(),
            sessionStorage: testSessionStorage(),
            indexedDB: testIndexedDB(),
            secureContext: secureContext
        },

        network: networkInfo
    }
}