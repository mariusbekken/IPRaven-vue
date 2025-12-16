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
            <!-- Generator -->
            <section class="card">
                <header class="card-header">
                    <h2>Password Generator</h2>
                    <p class="card-desc">
                        Generate strong passwords with the length and character sets you prefer. Copy with one click.
                    </p>
                </header>

                <div class="card-body">
                    <!-- Password field -->
                    <div class="pg-top">
                        <div class="pg-output">
                            <input
                                class="pg-output-input"
                                :type="revealPassword ? 'text' : 'password'"
                                :value="password"
                                readonly
                                aria-label="Generated password"
                            />

                            <button
                                class="pg-icon-btn"
                                type="button"
                                @click="generate()"
                                title="Generate new password"
                                aria-label="Generate new password"
                            >
                                <span class="pg-icon" aria-hidden="true">↻</span>
                            </button>

                            <button
                                class="pg-reveal-btn"
                                type="button"
                                @click="revealPassword = !revealPassword"
                                :disabled="!password"
                                :title="revealPassword ? 'Hide password' : 'Show password'"
                                :aria-label="revealPassword ? 'Hide password' : 'Show password'"
                            >
                                {{ revealPassword ? "Hide" : "Show" }}
                            </button>

                            <button
                                class="pg-copy-btn"
                                type="button"
                                @click="copyPassword"
                                :disabled="!password"
                            >
                                {{ copied ? "Copied" : "Copy password" }}
                            </button>
                        </div>

                        <div class="pg-strength">
                            <div class="pg-strength-bar"
                                 role="progressbar"
                                 :aria-valuenow="strengthScore"
                                 aria-valuemin="0"
                                 aria-valuemax="100">
                                <div class="pg-strength-fill" :style="{ width: strengthScore + '%' }"></div>
                            </div>
                            <div class="pg-strength-meta">
                                <span class="pg-strength-badge" :data-level="strengthLevel">
                                    {{ strengthLabel }}
                                </span>
                                <span class="pg-strength-hint">
                                    {{ strengthHint }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Length -->
                    <div class="row">
                        <div class="label">Password length</div>
                        <div class="value pg-length">
                            <input
                                class="pg-range"
                                type="range"
                                :min="minLength"
                                :max="maxLength"
                                v-model.number="length"
                                @input="generateDebounced()"
                                aria-label="Password length"
                            />
                        </div>
                        <div class="pg-pill" aria-label="Selected length">
                            {{ length }}
                        </div>
                    </div>

                    <!-- Character sets -->
                    <div class="row">
                        <div class="label">Characters used</div>

                        <div class="value pg-checks">
                            <label class="pg-check">
                                <input type="checkbox" v-model="useUppercase" @change="ensureAtLeastOne(); generate()" />
                                <span>Uppercase</span>
                            </label>

                            <label class="pg-check">
                                <input type="checkbox" v-model="useLowercase" @change="ensureAtLeastOne(); generate()" />
                                <span>Lowercase</span>
                            </label>

                            <label class="pg-check">
                                <input type="checkbox" v-model="useNumbers" @change="ensureAtLeastOne(); generate()" />
                                <span>Numbers</span>
                            </label>

                            <label class="pg-check">
                                <input type="checkbox" v-model="useSymbols" @change="ensureAtLeastOne(); generate()" />
                                <span>Symbols</span>
                            </label>
                        </div>

                        <button class="info-btn" type="button" @click="showInfo = !showInfo" aria-label="Info">
                            i
                        </button>
                    </div>

                    <!-- Policy / Compatibility options (new) -->
                    <div class="row">
                        <div class="label">Options</div>

                        <div class="value pg-checks">
                            <label class="pg-check">
                                <input
                                    type="checkbox"
                                    v-model="safeSymbols"
                                    @change="generate()"
                                    :disabled="!useSymbols"
                                />
                                <span>Safe symbols</span>
                            </label>

                            <label class="pg-check">
                                <input
                                    type="checkbox"
                                    v-model="excludeAmbiguous"
                                    @change="generate()"
                                />
                                <span>Exclude ambiguous characters</span>
                            </label>
                        </div>

                        <span class="small pg-inline-note">
                            Compatibility
                        </span>
                    </div>

                    <div v-if="showInfo" class="card-info-box">
                        <p>
                            Tip: For high-value accounts, use 16+ characters and enable all character sets. Avoid reusing passwords.
                        </p>
                        <p class="small">
                            Passwords are generated locally in your browser. Nothing is sent to a server.
                        </p>
                        <p class="small">
                            “Safe symbols” uses a more compatible symbol set (useful for systems that reject some special characters).
                        </p>
                        <p class="small">
                            “Exclude ambiguous characters” removes look-alikes like I/l/1 and O/0 to reduce mistakes.
                        </p>
                    </div>
                </div>
            </section>

            <!-- Why it matters (new card) -->
            <section class="card">
                <header class="card-header">
                    <h2>Why strong passwords matter</h2>
                    <p class="card-desc">
                        Passwords protect your identity, money, and private data.
                    </p>
                </header>

                <div class="card-body">
                    <div class="card-info-box">
                        <p>
                            Attackers often use leaked password databases and automated guessing to break into accounts.
                            A long, unique password makes these attacks far less likely to succeed.
                        </p>
                        <p>
                            Store passwords safely by using a reputable password manager (so every account can have a unique password).
                            Enable multi-factor authentication (MFA) where available, and avoid saving passwords in plain text notes or messages.
                        </p>
                        <p class="small">
                            If you must store a recovery copy, keep it offline and protected (for example, in a secure physical location).
                        </p>
                    </div>
                </div>
            </section>
        </div>
    </main>

    <FooterComponent />
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue"
import FooterComponent from "@/components/FooterComponent.vue"

/**
 * Settings
 */
const minLength = 8
const maxLength = 64

const length = ref(12)
const useUppercase = ref(true)
const useLowercase = ref(true)
const useNumbers = ref(true)
const useSymbols = ref(true)

const safeSymbols = ref(true)          // new
const excludeAmbiguous = ref(false)    // new
const revealPassword = ref(false)      // new

const password = ref("")
const copied = ref(false)
const showInfo = ref(false)

// Base sets
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const LOWER = "abcdefghijklmnopqrstuvwxyz"
const NUMS  = "0123456789"

// Symbol sets:
// - SAFE: typical “allowed almost everywhere” symbols
// - FULL: broader set, but can break on some systems
const SYMS_SAFE = "!@#$%^&*_-+=?"
const SYMS_FULL = "!@#$%^&*()-_=+[]{};:,.?/|~"

// Ambiguous characters to remove when excludeAmbiguous = true
// (common look-alikes: I l 1 O 0, plus a few extras)
const AMBIGUOUS = new Set(["I", "l", "1", "O", "0"])

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
    const a = str.split("")
    for (let i = a.length - 1; i > 0; i--) {
        const j = cryptoRandomInt(i + 1)
        ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a.join("")
}

function applyAmbiguousFilter(str) {
    if (!excludeAmbiguous.value) return str
    return str.split("").filter(ch => !AMBIGUOUS.has(ch)).join("")
}

function getSymbolsSet() {
    return safeSymbols.value ? SYMS_SAFE : SYMS_FULL
}

function buildPool() {
    let pool = ""
    if (useUppercase.value) pool += UPPER
    if (useLowercase.value) pool += LOWER
    if (useNumbers.value) pool += NUMS
    if (useSymbols.value) pool += getSymbolsSet()

    pool = applyAmbiguousFilter(pool)

    // Defensive: if ambiguous filter made a set empty, fallback gracefully
    return pool
}

function ensureAtLeastOne() {
    if (!useUppercase.value && !useLowercase.value && !useNumbers.value && !useSymbols.value) {
        useLowercase.value = true
    }
}

function requiredSets() {
    const sets = []
    if (useUppercase.value) sets.push(applyAmbiguousFilter(UPPER))
    if (useLowercase.value) sets.push(applyAmbiguousFilter(LOWER))
    if (useNumbers.value) sets.push(applyAmbiguousFilter(NUMS))
    if (useSymbols.value) sets.push(applyAmbiguousFilter(getSymbolsSet()))
    // Remove any empty sets (can happen if filter removes everything, unlikely but safe)
    return sets.filter(s => s.length > 0)
}

function generate() {
    ensureAtLeastOne()

    const pool = buildPool()
    if (!pool) {
        password.value = ""
        return
    }

    // If length is less than required sets, bump it up (UX-friendly)
    const req = requiredSets()
    if (length.value < req.length) length.value = req.length

    // 1) Ensure at least one char from each enabled set
    let result = ""
    for (const set of req) {
        result += set[cryptoRandomInt(set.length)]
    }

    // 2) Fill remaining from pool
    while (result.length < length.value) {
        result += pool[cryptoRandomInt(pool.length)]
    }

    // 3) Shuffle final
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
        const el = document.createElement("textarea")
        el.value = password.value
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

/**
 * Strength (simple heuristic)
 */
const enabledSetsCount = computed(() => {
    return [useUppercase.value, useLowercase.value, useNumbers.value, useSymbols.value].filter(Boolean).length
})

const approxPoolSize = computed(() => {
    let size = 0
    if (useUppercase.value) size += applyAmbiguousFilter(UPPER).length
    if (useLowercase.value) size += applyAmbiguousFilter(LOWER).length
    if (useNumbers.value) size += applyAmbiguousFilter(NUMS).length
    if (useSymbols.value) size += applyAmbiguousFilter(getSymbolsSet()).length
    return Math.max(size, 1)
})

const entropyBits = computed(() => {
    const bits = length.value * (Math.log(approxPoolSize.value) / Math.log(2))
    return Math.round(bits)
})

const strengthScore = computed(() => {
    const bits = entropyBits.value
    const score = Math.max(0, Math.min(100, Math.round((bits / 80) * 100)))
    return Math.max(0, Math.min(100, score + (enabledSetsCount.value - 1) * 5))
})

const strengthLevel = computed(() => {
    const s = strengthScore.value
    if (s >= 80) return "strong"
    if (s >= 55) return "good"
    if (s >= 35) return "ok"
    return "weak"
})

const strengthLabel = computed(() => {
    switch (strengthLevel.value) {
        case "strong": return "Strong"
        case "good": return "Good"
        case "ok": return "OK"
        default: return "Weak"
    }
})

const strengthHint = computed(() => {
    const lvl = strengthLevel.value
    if (lvl === "strong") return `${entropyBits.value} bits • strong for most use cases`
    if (lvl === "good") return `${entropyBits.value} bits • consider 16+ for critical accounts`
    if (lvl === "ok") return `${entropyBits.value} bits • increase length and/or enable more sets`
    return `${entropyBits.value} bits • too weak, increase length and enable more sets`
})

watch([length, useUppercase, useLowercase, useNumbers, useSymbols], () => {
    const required = enabledSetsCount.value
    if (length.value < required) length.value = required
})

// If symbols disabled, also disable safeSymbols UI state (keeps things consistent)
watch(useSymbols, () => {
    if (!useSymbols.value) safeSymbols.value = true
})

onMounted(() => {
    generate()
})
</script>

<style scoped>
/* Card top layout */
.pg-top {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 15px;
    border-bottom: 1px solid rgba(31, 41, 55, 0.5);
}

/* Output row */
.pg-output {
    display: grid;
    grid-template-columns: 1fr auto auto auto;
    gap: 10px;
    align-items: center;
}

.pg-output-input {
    width: 100%;
    background-color: rgba(0, 0, 0, 0.18);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 5px;
    color: #e5e7eb;
    padding: 12px 12px;
    font-size: 16px;
    letter-spacing: 0.2px;
}

.pg-output-input:focus {
    border-color: rgba(96, 165, 250, 0.55);
}

.pg-icon-btn {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background-color: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #e5e7eb;
    border-radius: 5px;
    height: 42px;
    width: 42px;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease;
}

.pg-icon-btn:hover {
    background-color: rgba(30, 41, 59, 0.65);
    border-color: rgba(255, 255, 255, 0.2);
}

.pg-icon {
    font-size: 18px;
    line-height: 1;
}

.pg-reveal-btn {
    background-color: rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #e5e7eb;
    border-radius: 5px;
    height: 42px;
    padding: 0 14px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;
    white-space: nowrap;
}

.pg-reveal-btn:hover {
    background-color: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.2);
}

.pg-reveal-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.pg-copy-btn {
    background: linear-gradient(90deg, #dc2626, #e11d48);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: #fff;
    border-radius: 5px;
    height: 42px;
    padding: 0 14px;
    font-size: 14px;
    cursor: pointer;
    transition: filter 0.2s ease, opacity 0.2s ease;
    white-space: nowrap;
}

.pg-copy-btn:hover {
    filter: brightness(1.05);
}

.pg-copy-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Strength */
.pg-strength {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.pg-strength-bar {
    background-color: rgba(15, 23, 42, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.10);
    border-radius: 999px;
    height: 10px;
    overflow: hidden;
}

.pg-strength-fill {
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #ef4444, #f59e0b, #22c55e);
    transition: width 0.2s ease;
}

.pg-strength-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    font-size: 12px;
    color: #9ca3af;
}

.pg-strength-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background-color: rgba(0, 0, 0, 0.12);
    color: #e5e7eb;
    font-weight: 700;
}

.pg-strength-badge[data-level="weak"] { color: #fecaca; }
.pg-strength-badge[data-level="ok"] { color: #fde68a; }
.pg-strength-badge[data-level="good"] { color: #bbf7d0; }
.pg-strength-badge[data-level="strong"] { color: #86efac; }

.pg-strength-hint {
    text-align: right;
}

/* Length row */
.pg-length {
    display: flex;
    align-items: center;
    width: 100%;
}

.pg-range {
    width: 100%;
    accent-color: #60a5fa;
    cursor: pointer;
}

.pg-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    height: 28px;
    padding: 0 10px;
    border-radius: 999px;
    background-color: rgba(96, 165, 250, 0.12);
    border: 1px solid rgba(96, 165, 250, 0.25);
    color: #dbeafe;
    font-weight: 700;
}

/* Checks */
.pg-checks {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 16px;
    align-items: center;
}

.pg-check {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    user-select: none;
    cursor: pointer;
    color: #d1d5db;
}

.pg-check input {
    width: 16px;
    height: 16px;
    cursor: pointer;
    accent-color: #60a5fa;
}

.pg-inline-note {
    text-align: right;
    white-space: nowrap;
}

/* Responsive */
@media (max-width: 600px) {
    .pg-output {
        grid-template-columns: 1fr;
    }

    .pg-icon-btn,
    .pg-reveal-btn,
    .pg-copy-btn {
        width: 100%;
    }

    .pg-strength-meta {
        flex-direction: column;
        align-items: flex-start;
    }

    .pg-strength-hint {
        text-align: left;
    }

    .pg-inline-note {
        display: none;
    }
}
</style>
