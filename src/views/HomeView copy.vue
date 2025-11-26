<template>
  <div>
    <div v-if="clientInfo">
      <h1>Client Information ({{ clientInfo.client_info.ip.address }})</h1>
      <pre>{{ clientInfo }}</pre>
    </div>
    <div v-else>
      Loading client information...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const clientInfo = ref(null)

onMounted(async () => {
  try {
    const response = await axios.get('https://api.ipraven.com/clientinfo', {
      headers: {
        'Content-Type': 'application/json',
        'API_KEY': 'N~rrZ#_j(JGW)B3s7=NnymCQ-pAX4sM+%iy'
      }
    })

    clientInfo.value = response.data
    console.log('Client Info:', clientInfo.value)
  } catch (error) {
    console.error('Error fetching client info:', error)
  }
})
</script>
