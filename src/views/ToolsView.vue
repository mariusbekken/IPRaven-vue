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
        <div class="tools-list">
            <RouterLink class="tools-item" to="/password-generator">
                <h2>Password Generator</h2>
                <p>Generate strong and secure passwords to protect your online accounts.</p>
            </RouterLink>

            <RouterLink class="tools-item" to="/encoder-decoder">
                <h2>Encoder / Decoder</h2>
                <p>Encode and decode text using various encoding schemes for secure communication.</p>
            </RouterLink>
        </div>
    </main>

    <FooterComponent />
</template>

<script setup>
import { ref } from 'vue'
import FooterComponent from '@/components/FooterComponent.vue'
</script>