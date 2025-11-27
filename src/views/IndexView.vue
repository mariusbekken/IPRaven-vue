<template>
    <header class="header">

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
                        <span class="label">Timezone</span>
                        <span class="value">{{ safeInfo.geo.timezone }}</span>
                    </div>
                </div>
            </section>

            <!-- Device & Browser -->
             <section class="card">
                <div class="card-header">
                    <h2>Device & Browser</h2>
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
                </div>
             </section>
        </div>

        <div class="loader" v-else>
            <div class="loader-wrapper">
                <img class="loader-logo" :src="ipravenLogo" alt="IPRaven logo">
                <p class="loader-text">Loading data...</p>
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
import axios from 'axios'
import FooterComponent from '@/components/FooterComponent.vue'
import { getFlagSrc } from '@/utils/flags'
import { collectFullFingerprint } from '@/utils/fingerprint/index.js'

const clientInfo = ref(null)
const dataLoaded = ref(false)
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

function onFlagError() {
    if (!flagError.value) {
        flagError.value = true
    }
}

function fakeDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
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
        await fakeDelay(5000)
        dataLoaded.value = true
    } catch (error) {
        errorMessage.value = 'Error fetching client info'
    }
}

function reload() {
    loadClientInfo()
}

onMounted(async () => {
    loadClientInfo()
    fingerprint.value = await collectFullFingerprint()
})

</script>