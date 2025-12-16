<template>
    <header class="header">
        <div class="header-wrapper">
            <nav class="header-nav">
                <RouterLink to="/">Home</RouterLink>
                <RouterLink to="/tools">Tools</RouterLink>
            </nav>

            <div class="header-brand">
                <div class="header-logo">
                    <img src="@/assets/images/ipraven-logo.png" alt="IPRaven logo">
                </div>
                <div class="header-desc">
                    <h1>IPRaven.com</h1>
                    <p><fa icon="fa-shoe-prints" fixed-width></fa> Know your digital footprint</p>
                </div>
            </div>
        </div>
    </header>

    <main class="main" data-nosnippet>
        <div class="main-content">
            <!-- Encoding / Decoding -->
            <section class="card">
                <header class="card-header">
                    <h2>Encoding &amp; Decoding</h2>
                    <p class="card-desc">
                        Base64 and URL encoding/decoding, plus JWT decoding (header/payload). All processing is local in your browser.
                    </p>
                </header>

                <div class="card-body">
                    <div class="ed-grid">
                        <!-- Left: input -->
                        <div class="ed-panel">
                            <div class="ed-panel-head">
                                <div class="label">Input</div>
                                <div class="ed-actions">
                                    <button class="ed-btn" type="button" @click="swapInputOutput" :disabled="!outputText">
                                        Swap
                                    </button>
                                    <button class="ed-btn" type="button" @click="clearAll" :disabled="!inputText && !outputText">
                                        Clear
                                    </button>
                                </div>
                            </div>

                            <textarea
                                class="ed-textarea"
                                v-model="inputText"
                                placeholder="Paste text here..."
                                spellcheck="false"
                                rows="10"
                            ></textarea>

                            <div class="ed-meta">
                                <span class="small">Chars: {{ inputText.length }}</span>
                                <span class="small" v-if="activeMode === 'jwt'">Tip: paste a full JWT (header.payload.signature)</span>
                            </div>
                        </div>

                        <!-- Right: output -->
                        <div class="ed-panel">
                            <div class="ed-panel-head">
                                <div class="label">Output</div>
                                <div class="ed-actions">
                                    <button class="ed-copy-btn" type="button" @click="copyOutput" :disabled="!outputText">
                                        {{ copied ? "Copied" : "Copy output" }}
                                    </button>
                                </div>
                            </div>

                            <textarea
                                class="ed-textarea"
                                :value="outputText"
                                readonly
                                spellcheck="false"
                                rows="10"
                                placeholder="Output will appear here..."
                            ></textarea>

                            <div class="ed-meta">
                                <span class="small">Chars: {{ outputText.length }}</span>
                                <span class="small" v-if="errorText" style="color:#ff6b6b;">{{ errorText }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Mode selector -->
                    <div class="row">
                        <div class="label">Tool</div>

                        <div class="value ed-modes">
                            <button
                                class="ed-mode"
                                type="button"
                                :data-active="activeMode === 'base64'"
                                @click="setMode('base64')"
                            >
                                Base64
                            </button>

                            <button
                                class="ed-mode"
                                type="button"
                                :data-active="activeMode === 'url'"
                                @click="setMode('url')"
                            >
                                URL
                            </button>

                            <button
                                class="ed-mode"
                                type="button"
                                :data-active="activeMode === 'jwt'"
                                @click="setMode('jwt')"
                            >
                                JWT decoder
                            </button>

                            <button
                                class="ed-mode"
                                type="button"
                                :data-active="activeMode === 'hash'"
                                @click="setMode('hash')"
                            >
                                Hash generator
                            </button>
                        </div>

                        <button class="info-btn" type="button" @click="showInfo = !showInfo" aria-label="Info">
                            i
                        </button>
                    </div>

                    <!-- Base64 controls -->
                    <div v-if="activeMode === 'base64'" class="row">
                        <div class="label">Action</div>
                        <div class="value ed-actions-row">
                            <button class="ed-primary" type="button" @click="base64Encode" :disabled="!inputText">
                                Encode
                            </button>
                            <button class="ed-primary" type="button" @click="base64Decode" :disabled="!inputText">
                                Decode
                            </button>

                            <label class="ed-check">
                                <input type="checkbox" v-model="base64UrlSafe" @change="runModeDefault()" />
                                <span>URL-safe Base64</span>
                            </label>
                        </div>
                        <span class="small ed-right-note">Uses UTF-8 for input text</span>
                    </div>

                    <!-- URL controls -->
                    <div v-if="activeMode === 'url'" class="row">
                        <div class="label">Action</div>
                        <div class="value ed-actions-row">
                            <button class="ed-primary" type="button" @click="urlEncode" :disabled="!inputText">
                                Encode
                            </button>
                            <button class="ed-primary" type="button" @click="urlDecode" :disabled="!inputText">
                                Decode
                            </button>

                            <label class="ed-check">
                                <input type="checkbox" v-model="urlUsePlusForSpace" />
                                <span>Use + for spaces</span>
                            </label>
                        </div>
                        <span class="small ed-right-note">encodeURIComponent / decodeURIComponent</span>
                    </div>

                    <!-- JWT decoder -->
                    <div v-if="activeMode === 'jwt'" class="row">
                        <div class="label">Action</div>
                        <div class="value ed-actions-row">
                            <button class="ed-primary" type="button" @click="jwtDecode" :disabled="!inputText">
                                Decode JWT
                            </button>

                            <label class="ed-check">
                                <input type="checkbox" v-model="jwtPretty" @change="jwtDecode()" />
                                <span>Pretty JSON</span>
                            </label>
                        </div>
                        <span class="small ed-right-note">No signature verification</span>
                    </div>

                    <!-- Hash generator -->
                    <div v-if="activeMode === 'hash'" class="row">
                        <div class="label">Algorithm</div>
                        <div class="value ed-actions-row">
                            <button
                                class="ed-mode"
                                type="button"
                                :data-active="hashAlg === 'SHA-256'"
                                @click="hashAlg = 'SHA-256'; hashGenerate()"
                            >
                                SHA-256
                            </button>

                            <button
                                class="ed-mode"
                                type="button"
                                :data-active="hashAlg === 'SHA-512'"
                                @click="hashAlg = 'SHA-512'; hashGenerate()"
                            >
                                SHA-512
                            </button>

                            <button class="ed-primary" type="button" @click="hashGenerate" :disabled="!inputText">
                                Generate
                            </button>
                        </div>
                        <span class="small ed-right-note">Web Crypto API (digest)</span>
                    </div>

                    <!-- Info box -->
                    <div v-if="showInfo" class="card-info-box">
                        <p><strong>Base64:</strong> encodes binary/text into ASCII. It is not encryption.</p>
                        <p><strong>URL encoding:</strong> makes text safe for URLs and query strings.</p>
                        <p><strong>JWT decoder:</strong> decodes header/payload only. Do not trust decoded claims unless the signature is verified server-side.</p>
                        <p>
                            <strong>Hashes (SHA-256/SHA-512):</strong> one-way digests; good for integrity checks, not for password storage.
                        </p>
                        <p class="small">
                            <strong>bcrypt info:</strong> bcrypt is designed for password hashing (slow + salted). In browsers, bcrypt typically requires a library
                            (e.g., bcryptjs) and can be expensive on weak devices. For password storage, prefer bcrypt/argon2/scrypt on the server with proper cost factors.
                        </p>
                        <p class="small">
                            Everything here runs locally in the browser; no input is sent to a server.
                        </p>
                    </div>
                </div>
            </section>

            <!-- JWT structured output (bonus card) -->
            <section v-if="activeMode === 'jwt' && jwtParts" class="card">
                <header class="card-header">
                    <h2>JWT details</h2>
                    <p class="card-desc">Decoded header and payload (signature not verified).</p>
                </header>

                <div class="card-body">
                    <div class="ed-jwt">
                        <div class="ed-jwt-block">
                            <div class="ed-jwt-title">Header</div>
                            <pre class="ed-pre">{{ jwtParts.header }}</pre>
                        </div>
                        <div class="ed-jwt-block">
                            <div class="ed-jwt-title">Payload</div>
                            <pre class="ed-pre">{{ jwtParts.payload }}</pre>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </main>

    <FooterComponent />
</template>

<script setup>
import { computed, ref, watch } from "vue"
import FooterComponent from "@/components/FooterComponent.vue"

/**
 * State
 */
const inputText = ref("")
const outputText = ref("")
const errorText = ref("")
const copied = ref(false)
const showInfo = ref(false)

const activeMode = ref("base64") // base64 | url | jwt | hash

// Base64 options
const base64UrlSafe = ref(false)

// URL options
const urlUsePlusForSpace = ref(false)

// JWT options
const jwtPretty = ref(true)
const jwtParts = ref(null) // { header: string, payload: string } | null

// Hash options
const hashAlg = ref("SHA-256") // SHA-256 | SHA-512

/**
 * Helpers
 */
function setMode(mode) {
    activeMode.value = mode
    errorText.value = ""
    copied.value = false
    jwtParts.value = null
    // Optionally auto-run something when switching modes:
    runModeDefault()
}

function clearAll() {
    inputText.value = ""
    outputText.value = ""
    errorText.value = ""
    copied.value = false
    jwtParts.value = null
}

function swapInputOutput() {
    const tmp = inputText.value
    inputText.value = outputText.value
    outputText.value = tmp
    errorText.value = ""
    copied.value = false
    jwtParts.value = null
    runModeDefault()
}

async function copyOutput() {
    if (!outputText.value) return
    try {
        await navigator.clipboard.writeText(outputText.value)
        copied.value = true
        setTimeout(() => (copied.value = false), 1200)
    } catch {
        const el = document.createElement("textarea")
        el.value = outputText.value
        el.setAttribute("readonly", "true")
        el.style.position = "absolute"
        el.style.left = "-9999px"
        document.body.appendChild(el)
        el.select()
        document.execCommand("copy")
        document.body.removeChild(el)
        copied.value = true
        setTimeout(() => (copied.value = false), 1200)
    }
}

function setError(msg) {
    errorText.value = msg
    outputText.value = ""
    copied.value = false
}

/**
 * Base64 (UTF-8 safe)
 */
function utf8ToBytes(str) {
    return new TextEncoder().encode(str)
}

function bytesToUtf8(bytes) {
    return new TextDecoder().decode(bytes)
}

function bytesToBase64(bytes) {
    // Convert bytes -> binary string -> btoa
    let bin = ""
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
    return btoa(bin)
}

function base64ToBytes(b64) {
    const bin = atob(b64)
    const bytes = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
    return bytes
}

function toUrlSafeBase64(b64) {
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

function fromUrlSafeBase64(b64url) {
    let b64 = b64url.replace(/-/g, "+").replace(/_/g, "/")
    const pad = b64.length % 4
    if (pad) b64 += "=".repeat(4 - pad)
    return b64
}

function base64Encode() {
    errorText.value = ""
    jwtParts.value = null
    try {
        const bytes = utf8ToBytes(inputText.value)
        let b64 = bytesToBase64(bytes)
        if (base64UrlSafe.value) b64 = toUrlSafeBase64(b64)
        outputText.value = b64
    } catch {
        setError("Base64 encode failed. Please check the input.")
    }
}

function base64Decode() {
    errorText.value = ""
    jwtParts.value = null
    try {
        const src = base64UrlSafe.value ? fromUrlSafeBase64(inputText.value.trim()) : inputText.value.trim()
        const bytes = base64ToBytes(src)
        outputText.value = bytesToUtf8(bytes)
    } catch {
        setError("Base64 decode failed. Input is not valid Base64.")
    }
}

/**
 * URL encode/decode
 */
function urlEncode() {
    errorText.value = ""
    jwtParts.value = null
    try {
        let encoded = encodeURIComponent(inputText.value)
        if (urlUsePlusForSpace.value) encoded = encoded.replace(/%20/g, "+")
        outputText.value = encoded
    } catch {
        setError("URL encode failed.")
    }
}

function urlDecode() {
    errorText.value = ""
    jwtParts.value = null
    try {
        let src = inputText.value
        if (urlUsePlusForSpace.value) src = src.replace(/\+/g, "%20")
        outputText.value = decodeURIComponent(src)
    } catch {
        setError("URL decode failed. Input contains invalid escape sequences.")
    }
}

/**
 * JWT decoder (header/payload only; no verification)
 */
function decodeJwtPart(part) {
    // JWT uses Base64URL without padding
    const b64 = fromUrlSafeBase64(part)
    const bytes = base64ToBytes(b64)
    return bytesToUtf8(bytes)
}

function prettyJson(str) {
    try {
        const obj = JSON.parse(str)
        return JSON.stringify(obj, null, 2)
    } catch {
        return str
    }
}

function jwtDecode() {
    errorText.value = ""
    jwtParts.value = null
    try {
        const token = inputText.value.trim()
        const parts = token.split(".")
        if (parts.length < 2) {
            setError("JWT decode failed. Paste a token in the format: header.payload.signature")
            return
        }

        const headerRaw = decodeJwtPart(parts[0])
        const payloadRaw = decodeJwtPart(parts[1])

        const header = jwtPretty.value ? prettyJson(headerRaw) : headerRaw
        const payload = jwtPretty.value ? prettyJson(payloadRaw) : payloadRaw

        jwtParts.value = { header, payload }
        outputText.value = `Header:\n${header}\n\nPayload:\n${payload}`
    } catch {
        setError("JWT decode failed. Token is not valid Base64URL or is malformed.")
    }
}

/**
 * Hash generator (SHA-256 / SHA-512)
 */
function toHex(buffer) {
    const bytes = new Uint8Array(buffer)
    let hex = ""
    for (const b of bytes) hex += b.toString(16).padStart(2, "0")
    return hex
}

async function hashGenerate() {
    errorText.value = ""
    jwtParts.value = null
    try {
        const alg = hashAlg.value
        const data = new TextEncoder().encode(inputText.value)
        const digest = await crypto.subtle.digest(alg, data)
        outputText.value = toHex(digest)
    } catch {
        setError("Hash generation failed. Your browser may not support Web Crypto (crypto.subtle).")
    }
}

/**
 * Default action per mode (optional convenience)
 */
function runModeDefault() {
    if (!inputText.value) {
        outputText.value = ""
        errorText.value = ""
        jwtParts.value = null
        return
    }
    // Conservative: do not auto-decode; only auto-hash in hash mode.
    if (activeMode.value === "hash") hashGenerate()
    if (activeMode.value === "jwt") jwtDecode()
}

watch(activeMode, () => {
    copied.value = false
})

watch(inputText, () => {
    copied.value = false
    errorText.value = ""
    if (activeMode.value === "hash") hashGenerate()
    if (activeMode.value === "jwt") jwtDecode()
})
</script>

<style scoped>
/* Layout helpers consistent with your existing .main-content card styles */
.ed-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    padding: 15px;
    border-bottom: 1px solid rgba(31, 41, 55, 0.5);
}

.ed-panel {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.ed-panel-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

.ed-actions {
    display: inline-flex;
    gap: 8px;
}

.ed-textarea {
    width: 100%;
    min-height: 220px;
    resize: vertical;
    background-color: rgba(0, 0, 0, 0.18);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 5px;
    color: #e5e7eb;
    padding: 12px;
    font-size: 13px;
    line-height: 1.4;
}

.ed-textarea:focus {
    border-color: rgba(96, 165, 250, 0.55);
}

.ed-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

.ed-btn {
    background-color: rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #e5e7eb;
    border-radius: 5px;
    height: 30px;
    padding: 0 10px;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;
}

.ed-btn:hover {
    background-color: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.2);
}

.ed-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.ed-copy-btn {
    background: linear-gradient(90deg, #dc2626, #e11d48);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: #fff;
    border-radius: 5px;
    height: 30px;
    padding: 0 10px;
    font-size: 12px;
    cursor: pointer;
    transition: filter 0.2s ease, opacity 0.2s ease;
}

.ed-copy-btn:hover {
    filter: brightness(1.05);
}

.ed-copy-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Mode selector buttons */
.ed-modes {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
}

.ed-mode {
    background-color: rgba(0, 0, 0, 0.10);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #d1d5db;
    border-radius: 5px;
    height: 30px;
    padding: 0 10px;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.ed-mode:hover {
    background-color: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.2);
    color: #e5e7eb;
}

.ed-mode[data-active="true"] {
    border-color: rgba(96, 165, 250, 0.45);
    background-color: rgba(96, 165, 250, 0.10);
    color: #dbeafe;
}

/* Action row */
.ed-actions-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 14px;
    align-items: center;
}

.ed-primary {
    background-color: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #e5e7eb;
    border-radius: 5px;
    height: 30px;
    padding: 0 12px;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;
}

.ed-primary:hover {
    background-color: rgba(30, 41, 59, 0.65);
    border-color: rgba(255, 255, 255, 0.2);
}

.ed-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.ed-check {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    user-select: none;
    cursor: pointer;
    color: #d1d5db;
}

.ed-check input {
    width: 16px;
    height: 16px;
    cursor: pointer;
    accent-color: #60a5fa;
}

.ed-right-note {
    text-align: right;
    white-space: nowrap;
}

/* JWT details */
.ed-jwt {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    padding: 15px;
}

.ed-jwt-block {
    border: 1px solid rgba(255, 255, 255, 0.10);
    background-color: rgba(0, 0, 0, 0.12);
    border-radius: 5px;
    padding: 12px;
}

.ed-jwt-title {
    font-weight: 700;
    color: #e5e7eb;
    margin-bottom: 8px;
}

.ed-pre {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
    font-size: 12px;
    line-height: 1.45;
    color: #d1d5db;
}

/* Responsive */
@media (max-width: 800px) {
    .ed-grid {
        grid-template-columns: 1fr;
    }
    .ed-right-note {
        display: none;
    }
    .ed-jwt {
        grid-template-columns: 1fr;
    }
}
</style>
