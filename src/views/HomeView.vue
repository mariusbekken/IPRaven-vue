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
              {{
                [safeInfo.geo.city, safeInfo.geo.region]
                  .filter(Boolean)
                  .join(', ') || 'Unknown'
              }}
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

      <!-- Browser Fingerprint (client-side & security) -->
      <section class="card" v-if="fingerprint && fingerprint.available">
        <div class="card-header">
          <h2>Browser Fingerprint (client-side & security)</h2>
        </div>
        <div class="card-body">
          <!-- Basic -->
          <div class="row">
            <span class="label">Browser timezone</span>
            <span class="value">
              {{ fingerprint.browser?.timezone || 'Unknown' }}
            </span>
          </div>

          <div class="row">
            <span class="label">Browser language(s)</span>
            <span class="value">
              {{
                (fingerprint.basic?.languages || []).join(', ') || 'Unknown'
              }}
            </span>
          </div>

          <div class="row">
            <span class="label">Platform / Vendor</span>
            <span class="value">
              {{
                [fingerprint.basic?.platform, fingerprint.basic?.vendor]
                  .filter(Boolean)
                  .join(' – ') || 'Unknown'
              }}
            </span>
          </div>

          <!-- Screen & hardware -->
          <div class="row">
            <span class="label">Screen</span>
            <span class="value">
              <span v-if="fingerprint.screen">
                {{ fingerprint.screen.width }}×{{ fingerprint.screen.height }}
                @ {{ fingerprint.screen.pixelRatio }}x DPR
              </span>
              <span v-else>Unknown</span>
            </span>
          </div>

          <div class="row">
            <span class="label">CPU cores</span>
            <span class="value">
              {{ fingerprint.hardware?.cores ?? 'Unknown' }}
            </span>
          </div>

          <div class="row">
            <span class="label">Approx. RAM (GB)</span>
            <span class="value">
              {{ fingerprint.hardware?.memoryGB ?? 'Unknown' }}
            </span>
          </div>

          <div class="row">
            <span class="label">Touch support</span>
            <span class="value">
              {{
                fingerprint.input?.touchSupport
                  ? `Yes (${fingerprint.input.maxTouchPoints} touch points)`
                  : 'No / Not reported'
              }}
            </span>
          </div>

          <!-- SECURITY-RELEVANT -->
          <div class="row">
            <span class="label">Security – Do Not Track</span>
            <span class="value">
              {{
                fingerprint.security?.doNotTrack === '1'
                  ? 'Enabled (DNT=1)'
                  : fingerprint.security?.doNotTrack === '0'
                    ? 'Disabled (DNT=0)'
                    : 'Not provided'
              }}
            </span>
          </div>

          <div class="row">
            <span class="label">Security – Cookies</span>
            <span class="value">
              {{
                fingerprint.security?.cookiesEnabled === true
                  ? 'Enabled'
                  : fingerprint.security?.cookiesEnabled === false
                    ? 'Disabled / Blocked'
                    : 'Unknown'
              }}
            </span>
          </div>

          <div class="row">
            <span class="label">Security – Storage APIs</span>
            <span class="value">
              LocalStorage:
              {{ fingerprint.security?.localStorage ? 'Yes' : 'No' }},
              SessionStorage:
              {{ fingerprint.security?.sessionStorage ? 'Yes' : 'No' }},
              IndexedDB:
              {{ fingerprint.security?.indexedDB ? 'Yes' : 'No' }}
            </span>
          </div>

          <div class="row">
            <span class="label">Security – Secure context</span>
            <span class="value">
              {{
                fingerprint.security?.secureContext === true
                  ? 'Yes (HTTPS / secure)'
                  : fingerprint.security?.secureContext === false
                    ? 'No (insecure context)'
                    : 'Unknown'
              }}
            </span>
          </div>

          <div class="row">
            <span class="label">Network (browser view)</span>
            <span class="value">
              <span v-if="fingerprint.network">
                Type: {{ fingerprint.network.effectiveType || 'Unknown' }},
                Downlink:
                {{
                  fingerprint.network.downlinkMbps != null
                    ? fingerprint.network.downlinkMbps + ' Mbps'
                    : 'Unknown'
                }},
                RTT:
                {{
                  fingerprint.network.rttMs != null
                    ? fingerprint.network.rttMs + ' ms'
                    : 'Unknown'
                }},
                Data saver:
                {{
                  fingerprint.network.saveData === true
                    ? 'On'
                    : fingerprint.network.saveData === false
                      ? 'Off'
                      : 'Unknown'
                }}
              </span>
              <span v-else>Not exposed by this browser</span>
            </span>
          </div>
        </div>
      </section>

            <!-- Advanced Fingerprints (Canvas / WebGL / Audio) -->
      <section class="card" v-if="fingerprint && fingerprint.available">
        <div class="card-header">
          <h2>Advanced Fingerprints (Canvas, WebGL, Audio)</h2>
        </div>
        <div class="card-body">
          <!-- REALISM SCORE -->
          <div class="row">
            <span class="label">
              Realism score
              <button
                type="button"
                class="info-btn"
                @click="toggleScoreInfo"
              >
                ?
              </button>
            </span>
            <span class="value">
              <span v-if="fingerprint.realismScore">
                {{ fingerprint.realismScore.total }} / 100
                <span v-if="fingerprint.realismScore.label">
                  ({{ fingerprint.realismScore.label }})
                </span>
              </span>
              <span v-else>Unknown</span>
            </span>
          </div>

          <div
            v-if="showScoreInfo && fingerprint.realismScore"
            class="score-info-box"
          >
            <p><strong>What this score means:</strong></p>
            <p>{{ fingerprint.realismScore.message }}</p>
            <p>
              Approximate "uniqueness bits":
              <strong>{{ fingerprint.realismScore.bits }}</strong>
            </p>
            <p class="small">
              This is an educational estimate of how unique your browser
              fingerprint is. Real trackers combine similar signals (screen,
              hardware, fonts, WebGL, canvas, audio, features…) to recognize you
              across sites even without cookies.
            </p>
          </div>

          <!-- Canvas fingerprint -->
          <div class="row">
            <span class="label">Canvas fingerprint</span>
            <span class="value">
              <span v-if="fingerprint.canvas && fingerprint.canvas.supported">
                Hash: {{ fingerprint.canvas.hash }}
                <span v-if="fingerprint.canvas.dataUrlLength">
                  (data length: {{ fingerprint.canvas.dataUrlLength }})
                </span>
              </span>
              <span v-else>
                Not supported{{
                  fingerprint.canvas && fingerprint.canvas.reason
                    ? ' – ' + fingerprint.canvas.reason
                    : ''
                }}
              </span>
            </span>
          </div>

          <!-- WebGL -->
          <div class="row">
            <span class="label">WebGL fingerprint</span>
            <span class="value">
              <span v-if="fingerprint.webgl && fingerprint.webgl.supported">
                Vendor: {{ fingerprint.webgl.vendor || 'Unknown' }},
                Renderer: {{ fingerprint.webgl.renderer || 'Unknown' }},
                Hash: {{ fingerprint.webgl.hash }},
                Extensions: {{ fingerprint.webgl.extensionsCount }}
              </span>
              <span v-else>
                Not supported{{
                  fingerprint.webgl && fingerprint.webgl.reason
                    ? ' – ' + fingerprint.webgl.reason
                    : ''
                }}
              </span>
            </span>
          </div>

          <!-- Audio -->
          <div class="row">
            <span class="label">Audio fingerprint</span>
            <span class="value">
              <span v-if="fingerprint.audio && fingerprint.audio.supported">
                Hash: {{ fingerprint.audio.hash }}
              </span>
              <span v-else>
                Not supported{{
                  fingerprint.audio && fingerprint.audio.reason
                    ? ' – ' + fingerprint.audio.reason
                    : ''
                }}
              </span>
            </span>
          </div>

          <!-- Fonts -->
          <div class="row">
            <span class="label">Fonts (sample)</span>
            <span class="value">
              <span
                v-if="
                  fingerprint.fonts &&
                  fingerprint.fonts.detected &&
                  fingerprint.fonts.detected.length
                "
              >
                {{
                  fingerprint.fonts.detected.slice(0, 8).join(', ')
                }}
                <span
                  v-if="fingerprint.fonts.detected.length > 8"
                >
                  (+ {{ fingerprint.fonts.detected.length - 8 }} more)
                </span>
              </span>
              <span v-else>
                Not detected (blocked or none of the tested fonts installed)
              </span>
            </span>
          </div>

          <!-- Feature support -->
          <div class="row">
            <span class="label">Advanced features</span>
            <span class="value">
              <span v-if="fingerprint.features && fingerprint.features.supported">
                ServiceWorker:
                {{ fingerprint.features.serviceWorker ? 'Yes' : 'No' }},
                WebRTC:
                {{ fingerprint.features.webRTC ? 'Yes' : 'No' }},
                Gamepad:
                {{ fingerprint.features.gamepad ? 'Yes' : 'No' }},
                Battery API:
                {{ fingerprint.features.battery ? 'Yes' : 'No' }},
                WebSocket:
                {{ fingerprint.features.webSocket ? 'Yes' : 'No' }},
                CSS Grid:
                {{
                  fingerprint.features.cssGrid === true
                    ? 'Yes'
                    : fingerprint.features.cssGrid === false
                      ? 'No'
                      : 'Unknown'
                }}
              </span>
              <span v-else>Unknown</span>
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
    <div v-else class="loader-wrapper">
    <div class="loader-inner">
      <img
        :src="ipravenLogo"
        alt="IPRaven logo"
        class="loader-logo"
      />
      <p class="loader-text">Analyzing your client fingerprint…</p>
      <div class="loader-bar">
        <div class="loader-bar-fill"></div>
      </div>
    </div>
  </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { getFlagSrc } from '@/utils/flags.js'
import { collectFullFingerprint } from '@/utils/fingerprint/index.js'

const ipravenLogo = new URL(
  '/src/assets/images/ipraven-logo.png',
  import.meta.url
).href


const clientInfo = ref(null)
const dataLoaded = ref(false)
const copyMessage = ref('')
const errorMessage = ref('')

// fingerprint-state
const fingerprint = ref(null)
const showScoreInfo = ref(false)

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

    const ci = data?.client_info

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
    await fakeDelay(1000) // min 1s "fake" loading
    dataLoaded.value = true
  } catch (error) {
    console.error('Error fetching client info:', error)
    errorMessage.value = 'Could not load client information'
  }
}

function reload() {
  loadClientInfo()
}

onMounted(async () => {
  loadClientInfo()
  // samle full fingerprint (base + canvas + webgl + audio + score)
  fingerprint.value = await collectFullFingerprint()
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

.info-btn {
  margin-left: 0.4rem;
  border: 1px solid #4b5563;
  background: transparent;
  color: #e5e7eb;
  border-radius: 999px;
  width: 18px;
  height: 18px;
  font-size: 0.75rem;
  line-height: 1;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.info-btn:hover {
  background: #1f2937;
}

.score-info-box {
  grid-column: 1 / -1;
  margin: 0.5rem 0 0.8rem;
  padding: 0.6rem 0.8rem;
  border-radius: 0.5rem;
  border: 1px solid #1f2937;
  background: rgba(15, 23, 42, 0.9);
  font-size: 0.85rem;
  color: #d1d5db;
}

.score-info-box .small {
  font-size: 0.8rem;
  color: #9ca3af;
}

.loader-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e5e7eb;
}

.loader-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.loader-logo {
  width: 80px;
  height: auto;
  filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.7));
}

.loader-text {
  font-size: 0.95rem;
  color: #9ca3af;
}

.loader-bar {
  width: 160px;
  height: 4px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.9);
  overflow: hidden;
  margin-top: 0.25rem;
}

.loader-bar-fill {
  height: 100%;
  width: 40%;
  border-radius: inherit;
  background: linear-gradient(90deg, #6366f1, #22d3ee);
  animation: loaderBarSlide 1s ease-in-out infinite;
}

@keyframes loaderBarSlide {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(100%);
  }
}

</style>
