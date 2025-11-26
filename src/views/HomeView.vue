<template>
  <div class="page">
    <!-- Error state (inkl. rate limit) -->
    <div v-if="errorMessage" class="loading">
      <p>{{ errorMessage }}</p>
      <button class="retry-btn" @click="reload">
        Reload
      </button>
    </div>

    <!-- Main content – rendres KUN når vi har lastet gyldig data -->
    <div v-else-if="dataLoaded" class="container">
      <header class="header">
        <div>
          <h1 class="title">
            Client Information
            <span v-if="safeInfo.ip.address">({{ safeInfo.ip.address }})</span>

            <!-- Flag -->
            <img
              v-if="displayedFlagSrc"
              :src="displayedFlagSrc"
              :alt="`${countryCode || 'Country'} flag`"
              class="flag-icon"
              @error="onFlagError"
            />
          </h1>
          <p class="subtitle">
            This is information your browser and connection reveal to the server.
          </p>
        </div>
        <p v-if="copyMessage" class="copy-message">
          {{ copyMessage }}
        </p>
      </header>

      <!-- IP & Network -->
      <section class="card">
        <div class="card-header">
          <h2>IP & Network</h2>
        </div>
        <div class="card-body">
          <div class="row">
            <span class="label">IP address</span>
            <span class="value">
              {{ safeInfo.ip.address || 'Unknown' }}
            </span>
            <button
              v-if="safeInfo.ip.address"
              class="copy-btn"
              @click="copy(safeInfo.ip.address, 'IP address')"
            >
              Copy
            </button>
          </div>

          <div class="row" v-if="safeInfo.ip.hostname">
            <span class="label">Hostname</span>
            <span class="value">
              {{ safeInfo.ip.hostname }}
            </span>
            <button class="copy-btn" @click="copy(safeInfo.ip.hostname, 'Hostname')">
              Copy
            </button>
          </div>

          <div class="row">
            <span class="label">IP version</span>
            <span class="value">
              {{ safeInfo.ip.version ? `IPv${safeInfo.ip.version}` : 'Unknown' }}
            </span>
          </div>

          <div class="row">
            <span class="label">Public IP</span>
            <span class="value">
              {{
                safeInfo.ip.address
                  ? (safeInfo.ip.is_private ? 'No (private)' : 'Yes (public)')
                  : 'Unknown'
              }}
            </span>
          </div>

          <div class="row" v-if="safeInfo.network.asn || safeInfo.network.org">
            <span class="label">ISP / ASN</span>
            <span class="value">
              <span v-if="safeInfo.network.asn">{{ safeInfo.network.asn }}</span>
              <span v-if="safeInfo.network.asn && safeInfo.network.org"> – </span>
              <span v-if="safeInfo.network.org">{{ safeInfo.network.org }}</span>
            </span>
            <button
              class="copy-btn"
              @click="copy(`${safeInfo.network.asn ?? ''} ${safeInfo.network.org ?? ''}`.trim(), 'ISP / ASN')"
            >
              Copy
            </button>
          </div>

          <div class="row">
            <span class="label">Remote port</span>
            <span class="value">{{ safeInfo.network.remote_port || 'Unknown' }}</span>
          </div>
        </div>
      </section>

      <!-- Location -->
      <section class="card">
        <div class="card-header">
          <h2>Location</h2>
        </div>
        <div class="card-body">
          <div class="row" v-if="safeInfo.geo.city || safeInfo.geo.region">
            <span class="label">City / Region</span>
            <span class="value">
              {{ [safeInfo.geo.city, safeInfo.geo.region].filter(Boolean).join(', ') || 'Unknown' }}
            </span>
          </div>

          <div class="row" v-if="safeInfo.geo.country_code">
            <span class="label">Country</span>
            <span class="value">
              {{ safeInfo.geo.country_code }}
            </span>
          </div>

          <div class="row" v-if="safeInfo.geo.postal">
            <span class="label">Postal code</span>
            <span class="value">{{ safeInfo.geo.postal }}</span>
          </div>

          <div class="row" v-if="safeInfo.geo.latitude && safeInfo.geo.longitude">
            <span class="label">Coordinates</span>
            <span class="value">
              {{ safeInfo.geo.latitude }}, {{ safeInfo.geo.longitude }}
            </span>
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
            <span class="label">Operating system</span>
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
            <span class="value value-multiline">
              {{ safeInfo.client.user_agent || 'Unknown' }}
            </span>
            <button
              v-if="safeInfo.client.user_agent"
              class="copy-btn"
              @click="copy(safeInfo.client.user_agent, 'User-Agent')"
            >
              Copy
            </button>
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
            <span class="value">
              {{ safeInfo.security.https ? 'Yes' : 'No' }}
            </span>
          </div>

          <div class="row">
            <span class="label">TLS version</span>
            <span class="value">{{ safeInfo.security.tls_version || 'Unknown' }}</span>
          </div>

          <div class="row">
            <span class="label">DNT (Do Not Track)</span>
            <span class="value">
              {{
                safeInfo.security.dnt === '1'
                  ? 'Enabled'
                  : 'Disabled / Not sent'
              }}
            </span>
          </div>

          <div class="row">
            <span class="label">HTTP method</span>
            <span class="value">{{ safeInfo.request.method || 'Unknown' }}</span>
          </div>

          <div class="row">
            <span class="label">Full URL</span>
            <span class="value value-multiline">
              {{ safeInfo.request.full_url || 'Unknown' }}
            </span>
            <button
              v-if="safeInfo.request.full_url"
              class="copy-btn"
              @click="copy(safeInfo.request.full_url, 'Full URL')"
            >
              Copy
            </button>
          </div>

          <div class="row" v-if="safeInfo.request.referrer">
            <span class="label">Referrer</span>
            <span class="value value-multiline">
              {{ safeInfo.request.referrer }}
            </span>
          </div>
        </div>
      </section>

      <!-- Raw data -->
      <section class="card">
        <div class="card-header">
          <h2>Raw data</h2>
        </div>
        <div class="card-body">
          <div class="raw-actions">
            <button
              class="copy-btn"
              @click="copy(prettyJson, 'JSON payload')"
              :disabled="!prettyJson"
            >
              Copy JSON
            </button>
          </div>
          <pre class="preformatted">{{ prettyJson }}</pre>
        </div>
      </section>
    </div>

    <!-- Initial loading -->
    <div v-else class="loading">
      Loading client information...
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { getFlagSrc } from '@/utils/flags.js'

const clientInfo = ref(null)   // rå respons (for raw JSON-visning)
const dataLoaded = ref(false)
const copyMessage = ref('')
const errorMessage = ref('')

// flagg-state
const flagError = ref(false)

const prettyJson = computed(() =>
  clientInfo.value ? JSON.stringify(clientInfo.value, null, 2) : ''
)

// safeInfo bygger alltid en komplett struktur av clientInfo
const safeInfo = computed(() => {
  const ci = clientInfo.value ?? {}

  return {
    ip: {
      address: ci.ip?.address ?? '',
      hostname: ci.ip?.hostname ?? '',
      version: ci.ip?.version ?? '',
      is_private: ci.ip?.is_private ?? false
    },
    network: {
      asn: ci.network?.asn ?? '',
      org: ci.network?.org ?? '',
      remote_port: ci.network?.remote_port ?? ''
    },
    geo: {
      city: ci.geo?.city ?? '',
      region: ci.geo?.region ?? '',
      country_code: ci.geo?.country_code ?? '',
      postal: ci.geo?.postal ?? '',
      latitude: ci.geo?.latitude ?? '',
      longitude: ci.geo?.longitude ?? '',
      timezone: ci.geo?.timezone ?? ''
    },
    client: {
      os: ci.client?.os ?? '',
      browser: ci.client?.browser ?? '',
      device: ci.client?.device ?? '',
      languages: ci.client?.languages ?? '',
      user_agent: ci.client?.user_agent ?? '',
      is_bot: ci.client?.is_bot ?? false
    },
    security: {
      https: ci.security?.https ?? false,
      tls_version: ci.security?.tls_version ?? '',
      dnt: ci.security?.dnt ?? null
    },
    request: {
      method: ci.request?.method ?? '',
      full_url: ci.request?.full_url ?? '',
      referrer: ci.request?.referrer ?? ''
    }
  }
})

// country code og flagg-URL
const countryCode = computed(() => safeInfo.value.geo.country_code || '')

// base flagg-URL (kan være null hvis countryCode ikke er gyldig)
const baseFlagSrc = computed(() => getFlagSrc(countryCode.value))

// fallback-flagg (lag f.eks. unknown.png i flags-mappa)
const fallbackFlagSrc = new URL(
  '/src/assets/images/flags/unknown.png',
  import.meta.url
).href

// endelig URL som brukes i <img>
const displayedFlagSrc = computed(() => {
  if (!baseFlagSrc.value) return null
  return flagError.value ? fallbackFlagSrc : baseFlagSrc.value
})

function onFlagError() {
  // første gang bildet feiler, bytt til fallback
  if (!flagError.value) {
    flagError.value = true
  }
}

async function copy(text, label) {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    copyMessage.value = `${label} copied to clipboard`
    setTimeout(() => {
      copyMessage.value = ''
    }, 2000)
  } catch (e) {
    console.error('Clipboard error:', e)
    copyMessage.value = 'Could not copy to clipboard'
    setTimeout(() => {
      copyMessage.value = ''
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
    console.log('Raw API response:', data)

    // Forventet shape: { client_info: { success: true/false, ... } }
    const ci = data?.client_info

    if (!ci) {
      errorMessage.value = 'API did not return client_info payload'
      clientInfo.value = null
      return
    }

    if (ci.success === false) {
      // Rate limit / feil → vis bare feilmelding og reload-knapp
      errorMessage.value = ci.error || ci.message || 'Request failed'
      clientInfo.value = null
      return
    }

    // success === true → render hele UI
    clientInfo.value = ci
    dataLoaded.value = true
  } catch (error) {
    console.error('Error fetching client info:', error)
    errorMessage.value = 'Could not load client information'
  }
}

function reload() {
  loadClientInfo()
}

onMounted(() => {
  loadClientInfo()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #0f172a;
  color: #e5e7eb;
  padding: 2rem 1rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #f9fafb;
  margin: 0 0 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.flag-icon {
  width: 24px;
  height: 16px;
  object-fit: cover;
  border-radius: 2px;
  border: 1px solid rgba(15, 23, 42, 0.8);
}

.subtitle {
  margin: 0;
  color: #9ca3af;
  font-size: 0.95rem;
}

.copy-message {
  font-size: 0.85rem;
  color: #a5b4fc;
  align-self: center;
}

.card {
  background: #020617;
  border-radius: 0.75rem;
  border: 1px solid #1f2937;
  margin-bottom: 1.25rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
}

.card-header {
  padding: 0.85rem 1.2rem;
  border-bottom: 1px solid #1f2937;
}

.card-header h2 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: #e5e7eb;
}

.card-body {
  padding: 0.75rem 1.2rem 1rem;
}

.row {
  display: grid;
  grid-template-columns: minmax(120px, 160px) 1fr auto;
  gap: 0.5rem 1rem;
  align-items: center;
  padding: 0.35rem 0;
  border-bottom: 1px solid rgba(31, 41, 55, 0.7);
}

.row:last-child {
  border-bottom: none;
}

.label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #9ca3af;
}

.value {
  font-size: 0.9rem;
  color: #e5e7eb;
  word-break: break-all;
}

.value-multiline {
  white-space: normal;
}

.copy-btn {
  border: none;
  font-size: 0.8rem;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  cursor: pointer;
  background: #1d4ed8;
  color: #e5e7eb;
  transition: background 0.15s ease, transform 0.08s ease;
}

.copy-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.copy-btn:active {
  transform: translateY(0);
}

.raw-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
}

.preformatted {
  background: #020617;
  border-radius: 0.5rem;
  padding: 0.75rem;
  font-size: 0.8rem;
  max-height: 350px;
  overflow: auto;
  border: 1px solid #1f2937;
}

.loading {
  max-width: 1100px;
  margin: 0 auto;
  color: #9ca3af;
  font-size: 1rem;
}

.retry-btn {
  margin-top: 0.75rem;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  background: #1d4ed8;
  color: #e5e7eb;
  font-size: 0.9rem;
  transition: background 0.15s ease, transform 0.08s ease;
}

.retry-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.retry-btn:active {
  transform: translateY(0);
}

/* Responsive tweaks */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .row {
    grid-template-columns: minmax(110px, 150px) 1fr;
  }

  .copy-btn {
    justify-self: flex-start;
    margin-left: 120px;
    margin-top: -0.25rem;
  }
}
</style>
