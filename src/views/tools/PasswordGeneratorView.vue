<template>
    <header class="header">
        <div class="header-wrapper">
            <nav class="header-nav">
                <RouterLink to="/">Home</RouterLink>
                <RouterLink to="/password-generator">Password generator</RouterLink>
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
            <section class="card">
                <div class="card-header">
                    <h2>Password Generator</h2>
                    <p class="card-desc">Generate strong passwords with the length and character sets you prefer.</p>
                </div>

                <div class="card-body">
                    <div class="pg-top">
                        <div class="pg-output">
                            <input class="pg-output-input" :type="revealPassword ? 'text' : 'password'" :value="password" aria-label="Generated password" readonly>
                            <button class="pg-icon-btn" type="button" @click="generate" title="Generate new password" aria-label="Generate new password"><span class="pg-icon"><fa icon="arrow-rotate-right" fixed-width></fa></span></button>
                            <button class="pg-reveal-btn" type="button" @click="revealPassword = !revealPassword" :disabled="!password" :title="revealPassword ? 'Hide password' : 'Show password'" :aria-label="revealPassword ? 'Hide password' : 'Show password'">{{ revealPassword ? 'Hide' : 'Show' }}</button>
                            <button class="pg-copy-btn" type="button" @click="copyPassword" :disabled="!password">{{ copied ? 'Copied' : 'Copy password' }}</button>
                        </div>

                        <div class="pg-strength">
                            <div class="pg-strength-bar" role="progressbar" :aria-valuenow="strengthScore" aria-valuemin="0" aria-valuemax="100">
                                <div class="pg-strength-fill" :style="{ width: strengthScore + '%'}"></div>
                            </div>
                            <div class="pg-strength-meta">
                                <span class="pg-strength-badge" :data-level="strengthLevel">{{ strengthLabel }}</span>
                                <span class="pg-strength-hint">{{ strengthHint }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="label">Password length</div>
                    <div class="value pg-length">
                        <input class="pg-range" type="range" :min="minLength" :max="maxLength" v-model.number="length" @input="generateDebounced()" aria-label="Password length">
                    </div>
                    <div class="pg-pill" aria-label="Selected length">{{ length }}</div>
                </div>

                <div class="row">
                    <div class="label">Characters used</div>

                    <div class="value pg-checks">
                        <label class="pg-check">
                            <input type="checkbox" v-model="useUppercase" @change="ensureAtLeastOne(); generate()">
                            <span>Uppercase</span>
                        </label>

                        <label class="pg-check">
                            <input type="checkbox" v-model="useLowercase" @change="ensureAtLeastOne(); generate()">
                            <span>Lowercase</span>
                        </label>

                        <label class="pg-check">
                            <input type="checkbox" v-model="useNumbers" @change="ensureAtLeastOne(); generate()">
                            <span>Numbers</span>
                        </label>

                        <label class="pg-check">
                            <input type="checkbox" v-model="useSymbols" @change="ensureAtLeastOne(); generate()">
                            <span>Symbols</span>
                        </label>
                    </div>

                    <button class="info-btn" type="button" @click="showInfo = !showInfo" aria-label="info">i</button>
                </div>

                <div class="row">
                    <div class="label">Options</div>

                    <div class="value pg-checks">
                        <label class="pg-check">
                            <input type="checkbox" v-model="safeSymbols" :disabled="!useSymbols" @change="generate()">
                            <span>Safe symbols</span>
                        </label>

                        <label class="pg-check">
                            <input type="checkbox" v-model="excludeAmbiguous" @change="generate()">
                            <span>Exclude ambiguous characters</span>
                        </label>
                    </div>

                    <span class="small pg-inline-note">Compatibility options</span>
                </div>

                <div class="card-info-box" v-if="showInfo">
                    <p>Tip: For high-value accounts, use 16+ characters and enable all character sets. Avoid reusing passwords.</p>
                    <p class="small">Passwords are generated locally in your browser. Nothing is sent to a server.</p>
                    <p class="small">“Safe symbols” uses a more compatible symbol set (useful for systems that reject some special characters).</p>
                    <p class="small">“Exclude ambiguous characters” removes look-alikes like I/l/1 and O/0 to reduce mistakes.</p>
                </div>
            </section>

            <section class="card">
                <div class="card-header">
                    <h2>Why strong passwords matter</h2>
                    <p class="card-desc">Passwords protect your identity, money, and private data.</p>
                </div>

                <div class="card-body">
                    <div class="card-info-box">
                        <p>Attackers often use leaked password databases and automated guessing to break into accounts. A long, unique password makes these attacks far less likely to succeed.</p>
                        <p>Store passwords safely by using a reputable password manager (so every account can have a unique password). Enable multi-factor authentication (MFA) where available, and avoid saving passwords in plain text notes or messages.</p>
                        <p class="small">If you must store a recovery copy, keep it offline and protected (for example, in a secure physical location).</p>
                    </div>
                </div>
            </section>
        </div>
    </main>

    <FooterComponent />
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import FooterComponent from '@/components/FooterComponent.vue'

const minLength = 8
const maxLength = 64
const length = ref(12)
const useUppercase = ref(true)
const useLowercase = ref(true)
const useNumbers = ref(true)
const useSymbols = ref(true)
const safeSymbols = ref(true)
const excludeAmbiguous = ref(false)
const revealPassword = ref(true)
const password = ref('')
const copied = ref(false)
const showInfo = ref(false)
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const NUMS = '0123456789'
const SYMS_SAFE = '!@#$%^&*_-+=?'
const SYMS_ALL = '!@#$%^&*()-_=+[]{};:,.?/|~'
const AMBIGUOUS = new Set(['l', 'I', '1', 'O', '0'])

function cryptoRandomInt(maxExclusive) {
    const c = globalThis.crypto
    if (c?.getRandomValues) {
        const arr = new Uint32Array(1)
        const limit = Math.floor(0x100000000 / maxExclusive) * maxExclusive
        let x = 0

        do {
            c.getRandomValues(arr)
            x = arr[0]
        } while (x >= limit)
        return x % maxExclusive
    }

    return Math.floor(Math.random() * maxExclusive)
}

function shuffleString(str) {
    const a = str.split('')
    for (let i = a.length - 1; i > 0; i--) {
        const j = cryptoRandomInt(i + 1)
        ;[a[i], a[j]] = [a[j], a[i]]
    }

    return a.join('')
}

function applyAmbiguousFilter(str) {
    if (!excludeAmbiguous.value) return str

    return str.split('').filter(ch => !AMBIGUOUS.has(ch)).join('')
}

function getSymbolSet() {
    return safeSymbols.value ? SYMS_SAFE : SYMS_ALL
}

function buildPool() {
    let pool = ''
    if (useUppercase.value) pool += UPPER
    if (useLowercase.value) pool += LOWER
    if (useNumbers.value) pool += NUMS
    if (useSymbols.value) pool += getSymbolSet()

    pool = applyAmbiguousFilter(pool)
    return pool
}

function ensureAtLeastOne() {
    if (!useUppercase.value && !useLowercase.value && !useNumbers.value && !useSymbols.value) {
        useLowercase.value = true
    }
}

function requireSets() {
    const sets = []
    if (useUppercase.value) sets.push(applyAmbiguousFilter(UPPER))
    if (useLowercase.value) sets.push(applyAmbiguousFilter(LOWER))
    if (useNumbers.value) sets.push(applyAmbiguousFilter(NUMS))
    if (useSymbols.value) sets.push(applyAmbiguousFilter(getSymbolSet()))
    return sets.filter(s => s.length > 0)
}

function generate() {
    ensureAtLeastOne()

    const pool = buildPool()
    if (!pool) {
        password.value = ''
        return
    }

    const req = requireSets()
    if (length.value < req.length) length.value = req.length

    let result = ''
    for (const set of req) {
        result += set[cryptoRandomInt(set.length)]
    }

    while (result.length < length.value) {
        result += pool[cryptoRandomInt(pool.length)]
    }

    password.value = shuffleString(result.slice(0, length.value))
    copied.value = false
}

let genTimer = null
function generateDebounced() {
    if (genTimer) clearTimeout(genTimer)
    genTimer = setTimeout(() => generate(), 60)
}

async function copyPassword() {
    if (!password.value) return

    try {
        await navigator.clipboard.writeText(password.value)
        copied.value = true
        setTimeout(() => (copied.value = false), 1200)
    } catch {
        const el = document.createElement('textarea')
        el.value = password.value
        el.setAttribute('readonly', 'true')
        el.style.position = 'absolute'
        el.style.left = '-9999px'
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
        copied.value = true
        setTimeout(() => (copied.value = false), 1200)
    }
}

const enableSetsCount = computed(() => {
    return [useUppercase.value, useLowercase.value, useNumbers.value, useSymbols.value].filter(Boolean).length
})

const approxPoolSize = computed(() => {
    let size = 0
    if (useUppercase.value) size += applyAmbiguousFilter(UPPER).length
    if (useLowercase.value) size += applyAmbiguousFilter(LOWER).length
    if (useNumbers.value) size += applyAmbiguousFilter(NUMS).length
    if (useSymbols.value) size += applyAmbiguousFilter(getSymbolSet()).length

    return Math.max(size, 1)
})

const entropyBits = computed(() => {
    const bits = length.value * Math.log(approxPoolSize.value) / Math.log(2)
    return Math.round(bits)
})

const strengthScore = computed(() => {
    const bits = entropyBits.value
    const score = Math.max(0, Math.min(100, Math.round((bits / 80) * 100)))
    return Math.max(0, Math.min(100, score + (enableSetsCount.value - 1) * 5))
})

const strengthLevel = computed(() => {
    const s = strengthScore.value
    if (s >= 80) return 'strong'
    if (s >= 55) return 'good'
    if (s >= 35) return 'ok'
    return 'weak'
})

const strengthLabel = computed(() => {
    switch (strengthLevel.value) {
        case 'strong': return 'Strong'
        case 'good': return 'Good'
        case 'ok': return 'OK'
        default: return 'Weak'
    }
})

const strengthHint = computed(() => {
    const lvl = strengthLevel.value
    if (lvl === 'strong') return `${entropyBits.value} bits - strong for most use cases`
    if (lvl === 'good') return `${entropyBits.value} bits - consider 16+ for critical accounts`
    if (lvl === 'ok') return `${entropyBits.value} bits - increase length and/or enable more sets`
    return `${entropyBits.value} bits - too weak, increase length and enable more sets`
})

watch([length, useUppercase, useLowercase, useNumbers, useSymbols], () => {
    const required = enableSetsCount.value
    if (length.value < required) length.value = required
})

watch(useSymbols, () => {
    if (!useSymbols.value) safeSymbols.value = true
})

onMounted(() => {
    generate()
})
</script>
