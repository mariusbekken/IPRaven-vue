<template>
    <footer class="footer">
        <p data-nosnippet>&copy; IPRaven.com {{ dateToday }} | All rights reserved.</p>
        <p class="small" data-nosnippet><a href="https://privacy.ipraven.com" target="_blank">Privacy</a> | <a href="https://terms.ipraven.com" target="_blank">Terms</a> | <a href="https://disclosure.ipraven.com" target="_blank">Disclosure</a> | <a href="mailto:contact@ipraven.com">Contact</a></p>
        <p class="footer-description">IPRaven helps you understand what information your browser and device reveal online, including IP, geolocation, headers and fingerprint data.</p>
    </footer>
</template>

<script setup>
import { ref } from 'vue'

const dateToday = ref(new Date().getFullYear())
</script>