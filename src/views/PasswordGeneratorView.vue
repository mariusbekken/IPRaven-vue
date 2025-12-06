<template>
    <header class="header">
        <div class="header-wrapper">
            <nav class="header-nav">
                <RouterLink to="/">Frontpage</RouterLink>
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

    <main class="main" data-nosnippet></main>

    <FooterComponent />
</template>

<script setup>
import { ref } from 'vue'
import FooterComponent from '@/components/FooterComponent.vue'
</script>