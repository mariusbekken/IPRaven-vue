<template>
    <div v-if="apiStatus === 'timeout'">ERROR: Connection timeout. Please try again later. If this error occurs again, please contact the site administrator.</div>
    <div v-else-if="apiStatus === 'maintenance'">ERROR: Server is under maintenance (503). Please try again later. If this error occurs, please contact the site administrator.</div>
    <div v-else-if="apiStatus === 'offline'">ERROR: Server is offline. Please try again later. If the problem persists, please contact the site administrator.</div>
    <RouterView v-else />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import axios from 'axios'

const apiStatus = ref('checking')

onMounted(async () => {
    try {
        const response = await axios.get('https://api.ipraven.com/status', {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 5000,
            validateStatus: status => (status >= 200 && status < 300) || status === 503,
        })

        if (response.status === 503) {
            apiStatus.value = 'maintenance'
            return
        }

        apiStatus.value = response.data.status
    } catch (e) {
        if (e.code === 'ECONNABORTED') {
            apiStatus.value = 'timeout'
            return
        }

        apiStatus.value = 'offline'
    }
})
</script>