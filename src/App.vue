<template>
    <RouterView />
    <FooterComponent />
</template>

<script setup>
import { RouterView } from 'vue-router'
import FooterComponent from '@/components/FooterComponent.vue'
</script>