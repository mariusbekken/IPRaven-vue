<template>
    <header class="header">
        <div class="header-wrapper" v-if="!errorMessage && dataLoaded">
            <div class="header-logo">
                <img src="@/assets/images/ipraven-logo.png" alt="IPRaven logo">
            </div>
            <div class="header-desc">
                <h1>IPRaven.com</h1>
                <p><fa icon="fa-shoe-prints" fixed-width></fa> Know your digital footprint</p>
            </div>
        </div>
    </header>

    <div class="main">
        <div class="error" v-if="errorMessage">
            <p>{{ errorMessage }}</p>

            <button class="retry-btn" @click="reload">Reload</button>
        </div>

        <div class="main-content" v-else-if="dataLoaded">
            <!-- IP & Network -->
            <section class="card">
                <div class="card-header">
                    <h2>IP & Network</h2>
                </div>
                <div class="card-body">
                    <div class="row">
                        <span class="label">IP address</span>
                        <span class="value copyable" @click="copy(safeInfo.ip.address, 'IP address')">{{ safeInfo.ip.address || 'Unknown' }}</span>
                    </div>

                    <div class="row">
                        <span class="label">Hostname</span>
                        <span class="value copyable" @click="copy(safeInfo.ip.hostname, 'Hostname')">{{ safeInfo.ip.hostname  || 'Unknown' }}</span>
                    </div>

                    <div class="row">
                        <span class="label">IP version</span>
                        <span class="value">{{ safeInfo.ip.version ? `IPv${safeInfo.ip.version}` : 'Unknown' }}</span>
                    </div>

                    <div class="row">
                        <span class="label">Public IP</span>
                        <span class="value">{{ safeInfo.ip.address ? (safeInfo.ip.is_private ? 'No (private)' : 'Yes (public)') : 'Unknown' }}</span>
                    </div>

                    <div class="row" v-if="safeInfo.network.asn || safeInfo.network.org">
                        <span class="label">ISP / ASN</span>
                        <span class="value">
                            <span v-if="safeInfo.network.asn">{{ safeInfo.network.asn }}</span>
                            <span v-if="safeInfo.network.asn && safeInfo.network.org"> - </span>
                            <span v-if="safeInfo.network.org">{{ safeInfo.network.org }}</span>
                        </span>
                    </div>

                    <div class="row">
                        <span class="label">Remote port</span>
                        <span class="value copyable" @click="copy(safeInfo.network.remote_port, 'Remote port')">{{ safeInfo.network.remote_port || 'Unknown' }}</span>
                    </div>
                </div>
            </section>

            <!-- Location -->
            <section class="card">
                <div class="card-header">
                    <h2>IP Location</h2>
                </div>
                <div class="card-body">
                    <div class="row" v-if="safeInfo.geo.country_code">
                        <span class="label">Country</span>
                        <span class="value"><img class="flag-icon" v-if="displayedFlagSrc" :src="displayedFlagSrc" :alt="`${countryCode || 'Country'} flag`" @error="onFlagError"> {{ safeInfo.geo.country_code }}</span>
                    </div>

                    <div class="row" v-if="safeInfo.geo.city || safeInfo.geo.region">
                        <span class="label">City / Region</span>
                        <span class="value">{{ [safeInfo.geo.city, safeInfo.geo.region].filter(Boolean).join(', ') || 'Unknown' }}</span>
                    </div>

                    <div class="row" v-if="safeInfo.geo.latitude && safeInfo.geo.longitude">
                        <span class="label">Coordinates</span>
                        <span class="value copyable" @click="copy(`${safeInfo.geo.latitude}, ${safeInfo.geo.longitude}`, 'Coordinates')">{{ safeInfo.geo.latitude }}, {{ safeInfo.geo.longitude }}</span>
                    </div>

                    <div class="row" v-if="safeInfo.geo.timezone">
                        <span class="label">Timezone (IP location)</span>
                        <span class="value">{{ safeInfo.geo.timezone }}</span>
                    </div>
                </div>
            </section>

            <!-- Device & Browser -->
            <section class="card">
                <div class="card-header">
                    <h2>Device & Browser (Server View)</h2>
                    <p class="card-desc">Information extracted from your HTTP request headers. This is what websites normally see.</p>
                </div>
                <div class="card-body">
                    <div class="row">
                        <span class="label">Operating System</span>
                        <span class="value">{{ safeInfo.client.os || 'Unknown' }}</span>
                    </div>

                    <div class="row">
                        <span class="label">Browser</span>
                        <span class="value">{{ safeInfo.client.browser || 'Unknown' }}</span>
                    </div>

                    <div class="row">
                        <span class="label">Device type</span>
                        <span class="value">{{ safeInfo.client.device || 'Unknown' }}</span>
                    </div>

                    <div class="row">
                        <span class="label">Language(s)</span>
                        <span class="value">{{ safeInfo.client.languages || 'Unknown' }}</span>
                    </div>

                    <div class="row">
                        <span class="label">User-Agent</span>
                        <span class="value copyable multiline" @click="copy(safeInfo.client.user_agent, 'User-Agent')">{{ safeInfo.client.user_agent || 'Unknown' }}</span>
                    </div>

                    <div class="row">
                        <span class="label">Bot detected</span>
                        <span class="value">{{ safeInfo.client.is_bot ? 'Yes' : 'No' }}</span>
                    </div>
                </div>
            </section>

             <!-- Security & Request -->
            <section class="card">
                <div class="card-header">
                    <h2>Security & Request</h2>
                </div>
                <div class="card-body">
                    <div class="row">
                        <span class="label">HTTPS</span>
                        <span class="value">{{ safeInfo.security.https ? 'Yes' : 'No' }}</span>
                    </div>

                    <div class="row">
                        <span class="label">TLS version</span>
                        <span class="value">{{ safeInfo.security.tls_version || 'Unknown' }}</span>
                    </div>

                    <div class="row">
                        <span class="label">DNT (Do not track)</span>
                        <span class="value">{{ safeInfo.security.dnt === '1' ? 'Enabled' : 'Disabled / Not sent' }}</span>
                    </div>

                    <div class="row">
                        <span class="label">HTTP method</span>
                        <span class="value">{{ safeInfo.request.method || 'Unknown' }}</span>
                    </div>

                    <div class="row">
                        <span class="label">Full URL</span>
                        <span class="value multiline">{{ safeInfo.request.full_url || 'Unknown' }}</span>
                    </div>

                    <div class="row">
                        <span class="label">Referrer</span>
                        <span class="value multiline">{{ safeInfo.request.referrer || 'Unknown' }}</span>
                    </div>
                </div>
            </section>

            <!-- Browser Fingerprint -->
            <section class="card" v-if="fingerprint && fingerprint.available">
                <div class="card-header">
                    <h2>Browser Fingerprint (JavaScript Runtime Data)</h2>
                    <p class="card-desc">Information obtained from your browser using JavaScript. This includes hardware, screen, APIs and real browser settings.</p>
                </div>
                <div class="card-body">
                    <div class="row">
                        <span class="label">Browser timezone</span>
                        <span class="value">{{ fingerprint.browser?.timezone || 'Unknown' }}</span>
                    </div>

                    <div class="row">
                        <span class="label">Platform / Vendor</span>
                        <span class="value">{{ [fingerprint.basic?.platform, fingerprint.basic?.vendor].filter(Boolean).join(' - ') || 'Unknown' }}</span>
                    </div>

                    <div class="row">
                        <span class="label">Screen</span>
                        <span class="value" v-if="fingerprint.screen">{{ fingerprint.screen.width }}x{{ fingerprint.screen.height }} @ {{ fingerprint.screen.pixelRatio }}x DPR</span>
                        <span class="value" v-else>Unknown</span>
                    </div>

                    <div class="row">
                        <span class="label">CPU cores</span>
                        <span class="value">{{ fingerprint.hardware?.cores ?? 'Unknown' }}</span>
                    </div>

                    <div class="row">
                        <span class="label">Approx. RAM (GB)</span>
                        <span class="value">{{ fingerprint.hardware?.memoryGB ?? 'Unknown' }}</span>
                    </div>

                    <div class="row">
                        <span class="label">Touch support</span>
                        <span class="value">{{ fingerprint.input?.touchSupport ? `Yes (${fingerprint.input.maxTouchPoints} touch points)` : 'No / Not reported' }}</span>
                    </div>

                    <div class="row">
                        <span class="label">Cookies</span>
                        <span class="value">{{ fingerprint.security?.cookiesEnabled === true ? 'Enabled' : fingerprint.security?.cookiesEnabled === false ? 'Disabled / Blocked' : 'Unknown'}}</span>
                    </div>

                    <div class="row">
                        <span class="label">Storage APIs</span>
                        <span class="value">LocalStorage: {{ fingerprint.security?.localStorage ? 'Yes' : 'No' }}, SessionStorage: {{ fingerprint.security?.sessionStorage ? 'Yes' : 'No' }},  IndexedDB: {{ fingerprint.security?.indexedDB ? 'Yes' : 'No' }}</span>
                    </div>

                    <div class="row">
                        <span class="label">Secure context</span>
                        <span class="value">{{ fingerprint.security?.secureContext === true ? 'Yes (HTTPS / secure)' : fingerprint.security?.secureContext === false ? 'No (insecure context)' : 'Unknown' }}</span>
                    </div>

                    <div class="row">
                        <span class="label">Network (browser view)</span>
                        <span class="value" v-if="fingerprint.network">Type: {{ fingerprint.network.effectiveType || 'Unknown' }}, Downlink: {{ fingerprint.network.downlinkMbps != null ? fingerprint.network.downlinkMbps + ' Mbps' : 'Unknown' }}, RTT: {{ fingerprint.network.rttMs != null ? fingerprint.network.rttMs + ' ms' : 'Unknown' }}, Data saver: {{ fingerprint.network.saveData === true ? 'On' : fingerprint.network.saveData === false ? 'Off' : 'Unknown' }}</span>
                        <span class="value" v-else>Not exposed by this browser</span>
                    </div>
                </div>
            </section>

            <!-- Advanced Fingerprints -->
            <section class="card" v-if="fingerprint && fingerprint.available">
                <div class="card-header">
                    <h2>Advanced Fingerprints (Canvas, WebGL, Audio)</h2>
                </div>
                <div class="card-body">
                    <div class="row">
                        <span class="label">Canvas fingerprint</span>
                        <span class="value" v-if="fingerprint.canvas && fingerprint.canvas.supported">Hash: {{ fingerprint.canvas.hash }} <span v-if="fingerprint.canvas.dataUrlLength">(data length: {{ fingerprint.canvas.dataUrlLength }})</span></span>
                        <span class="value" v-else>Not supported ({{ fingerprint.canvas && fingerprint.canvas.reason ? ' - ' + fingerprint.canvas.reason : '' }})</span>
                    </div>

                    <div class="row">
                        <span class="label">WebGL fingerprint</span>
                        <span class="value" v-if="fingerprint.webgl && fingerprint.webgl.supported">Vendor: {{ fingerprint.webgl.vendor || 'Unknown' }}, Renderer: {{ fingerprint.webgl.renderer || 'Unknown' }}, Hash: {{ fingerprint.webgl.hash }}, Extensions: {{ fingerprint.webgl.extensionsCount }}</span>
                        <span class="value" v-else>Not supported ({{ fingerprint.webgl && fingerprint.webgl.reason ? ' - ' + fingerprint.webgl.reason : '' }})</span>
                    </div>

                    <div class="row">
                        <span class="label">Audio fingerprint</span>
                        <span class="value" v-if="fingerprint.audio && fingerprint.audio.supported">Hash: {{ fingerprint.audio.hash }}</span>
                        <span class="value" v-else>Not supported ({{ fingerprint.audio && fingerprint.audio.reason ? ' - ' + fingerprint.audio.reason : '' }})</span>
                    </div>

                    <div class="row">
                        <span class="label">Fonts (sample)</span>
                        <span class="value" v-if="fingerprint.fonts && fingerprint.fonts.detected && fingerprint.fonts.detected.length">{{ fingerprint.fonts.detected.slice(0, 8).join(', ') }} <span v-if="fingerprint.fonts.detected.length > 8">(+ {{ fingerprint.fonts.detected.length - 8 }} more)</span></span>
                        <span class="value" v-else>Not detected (blocked or none of the tested fonts installed)</span>
                    </div>

                    <div class="row">
                        <span class="label">Advanced features</span>
                        <span class="value" v-if="fingerprint.features && fingerprint.features.supported">ServiceWorker: {{ fingerprint.features.serviceWorker ? 'Yes' : 'No' }}, WebRTC: {{ fingerprint.features.webRTC ? 'Yes' : 'No' }}, Gamepad: {{ fingerprint.features.gamepad ? 'Yes' : 'No' }}, Battery API: {{ fingerprint.features.battery ? 'Yes' : 'No' }}, WebSocket: {{ fingerprint.features.webSocket ? 'Yes' : 'No' }}, CSS Grid: {{ fingerprint.features.cssGrid === true ? 'Yes' : fingerprint.features.cssGrid === false ? 'No' : 'Unknown' }}</span>
                        <span class="label" v-else>Unknown</span>
                    </div>
                </div>
            </section>

            <!-- Security report -->
            <section class="card">
                <div class="card-header">
                    <h2>Security Report</h2>
                </div>
                <div class="card-body">
                    <div class="row">
                        <span class="label">Uniqueness Score <button class="info-btn" type="button" @click="toggleScoreInfo">?</button></span>
                        <span class="value" v-if="fingerprint.realismScore">{{ fingerprint.realismScore.total }} / 100 <span v-if="fingerprint.realismScore.label">({{ fingerprint.realismScore.label }})</span></span>
                        <span class="value" v-else>Unknown</span>
                    </div>

                    <div class="card-info-box" v-if="showScoreInfo && fingerprint.realismScore">
                        <p><strong>What this score means:</strong></p>
                        <p>Your <strong>Uniqueness Score</strong> estimates how easy it is to identify or track your browser based on its fingerprint. A higher score means your setup is more unique compared to other users, which makes you easier to recognize across different websites.</p>
                        <p>{{ fingerprint.realismScore.message }}</p>
                        <p>Approximate uniqueness entropy: <strong>{{ fingerprint.realismScore.bits }}</strong></p>
                        <p class="small">This is educational only. Real-world trackers combine many signals (screen size, hardware, fonts, WebGL, canvas, audio, performance, network features, and more) to create highly persistent identifiers, even without cookies.</p>
                    </div>
                </div>
            </section>
        </div>

        <div class="loader" v-else>
            <div class="loader-wrapper">
                <img class="loader-logo" :src="ipravenLogo" alt="IPRaven logo">
                <p class="loader-text">{{ loadingMessage }}</p>
                <div class="loader-bar">
                    <div class="loader-bar-fill"></div>
                </div>
            </div>
        </div>
    </div>

    <FooterComponent />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import FooterComponent from '@/components/FooterComponent.vue'
import axios from 'axios'
import { getFlagSrc } from '@/utils/flags'
import { collectFullFingerprint } from '@/utils/fingerprint/index.js'

let LOADING_TIME = 3000

const clientInfo = ref(null)
const dataLoaded = ref(false)
const loadingMessage = ref('Loading your data...')
const copyMessage = ref('')
const errorMessage = ref('')
const fingerprint = ref(null)
const showScoreInfo = ref(false)
const flagError = ref(false)

const ipravenLogo = new URL('@/assets/images/ipraven-logo.png', import.meta.url).href
const fallbackFlagSrc = new URL('@/assets/images/flags/unknown.png', import.meta.url).href
const prettyJson = computed(() => clientInfo.value ? JSON.stringify(clientInfo.value, null, 2) : '')
const countryCode = computed(() => safeInfo.value.geo.country_code || 'N/A')
const baseFlagSrc = computed(() => getFlagSrc(countryCode.value))

const displayedFlagSrc = computed(() => {
    if (!baseFlagSrc.value) return null
    return flagError.value ? fallbackFlagSrc : baseFlagSrc.value
})

const safeInfo = computed(() => {
    const ci = clientInfo.value ?? {}

    return {
        ip: {
            address: ci.ip?.address ?? 'N/A',
            hostname: ci.ip?.hostname ?? 'N/A',
            version: ci.ip?.version ?? 'N/A',
            is_private: ci.ip?.is_private ?? false
        },

        network: {
            asn: ci.network?.asn ?? 'N/A',
            org: ci.network?.org ?? 'N/A',
            remote_port: ci.network?.remote_port ?? 'N/A'
        },

        geo: {
            city: ci.geo?.city ?? 'N/A',
            region: ci.geo?.region ?? 'N/A',
            country_code: ci.geo?.country_code ?? 'N/A',
            latitude: ci.geo?.latitude ?? 'N/A',
            longitude: ci.geo?.longitude ?? 'N/A',
            timezone: ci.geo?.timezone ?? 'N/A'
        },

        client: {
            os: ci.client?.os ?? 'N/A',
            browser: ci.client?.browser ?? 'N/A',
            device: ci.client?.device ?? 'N/A',
            languages: ci.client?.languages ?? 'N/A',
            user_agent: ci.client?.user_agent ?? 'N/A',
            is_bot: ci.client?.is_bot ?? false
        },

        security: {
            https: ci.security?.https ?? false,
            tls_version: ci.security?.tls_version ?? 'N/A',
            dnt: ci.security?.dnt ?? null
        },

        request: {
            method: ci.request?.method ?? 'N/A',
            full_url: ci.request?.full_url ?? 'N/A',
            referrer: ci.request?.referrer ?? 'N/A'
        }
    }
})

const loadingMessages = [
    'Analyzing your browser...',
    'Calculating fingerprint entropy...',
    'Collection client metadata...',
    'Measuring browser uniqueness...',
    'Scanning request headers...',
    'Evaulating privcacy exposure...',
    'Inspecting device characteristics...',
    'Reading environmental signals...',
    'Gathering network information...',
    'Preparing your security report...'
]

function startLoadingRotation() {
    const interval = LOADING_TIME / loadingMessages.length
    let index = 0

    loadingMessage.value = loadingMessages[index]

    const timer = setInterval(() => {
        index ++

        if (index >= loadingMessages.length) {
            clearInterval(timer)
            return
        }

        loadingMessage.value = loadingMessages[index]
    }, interval)
}

function onFlagError() {
    if (!flagError.value) {
        flagError.value = true
    }
}

function fakeDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function toggleScoreInfo() {
    showScoreInfo.value = !showScoreInfo.value
}

async function copy(text, label) {
    if (!text) return

    try {
        await navigator.clipboard.writeText(text)
        copyMessage.value = `${label} copied to clipboard!`
        setTimeout(() => {
            copyMessage.value = ''
        }, 2000)
    } catch (err) {
        errorMessage.value = `Failed to copy ${label}.`
        setTimeout(() => {
            errorMessage.value = ''
        }, 2000)
    }
}

async function loadClientInfo() {
    dataLoaded.value = false
    errorMessage.value = ''
    clientInfo.value = null
    flagError.value = false

    try {
        const response = await axios.get('https://api.ipraven.com/clientinfo', {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = response.data
        const ci = data?.client_info

        // FJERN FØR RELEASE
        console.log('Raw API response:', data)

        if (!ci) {
            errorMessage.value = 'API did not return client_info payload'
            clientInfo.value = null
            return
        }

        if (ci.success === false) {
            errorMessage.value = ci.error || ci.message || 'Request failed'
            clientInfo.value = null
            return
        }

        clientInfo.value = ci
        await fakeDelay(LOADING_TIME)
        dataLoaded.value = true
    } catch (error) {
        errorMessage.value = 'Error fetching client info'
    }
}

function reload() {
    loadClientInfo()
}

onMounted(async () => {
    startLoadingRotation()
    loadClientInfo()
    fingerprint.value = await collectFullFingerprint()
})
</script>