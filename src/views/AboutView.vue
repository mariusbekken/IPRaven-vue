<template>
  <div class="page">
    <div class="container">

      <header class="header">
        <h1>About IP Raven</h1>
        <p class="subtitle">
          A technical, privacy-centric platform designed to reveal how much information your browser and network expose online.
        </p>
      </header>

      <section class="card">
        <h2>Our Mission</h2>
        <p>
          IP Raven was created with a clear goal: to increase transparency around digital
          privacy and help users understand how modern browsers, devices, and networks
          expose technical information to the websites they visit.
        </p>
        <p>
          In a time where online tracking has evolved far beyond traditional cookies,
          awareness is one of the most important forms of protection. IP Raven aims to
          give users insight into how fingerprinting, network metadata, browser APIs and
          passive signals can identify or profile devices — often without the user ever
          realizing it.
        </p>
      </section>

      <section class="card">
        <h2>Why This Platform Exists</h2>
        <p>
          Many privacy tools focus on <em>hiding</em> information, but very few show what is
          already being revealed by default. IP Raven is built to fill that gap by presenting
          complex technical data in a way that is accessible, accurate and actionable.
        </p>

        <p>
          The platform highlights:
        </p>

        <ul>
          <li>Browser fingerprinting signals and capability leaks</li>
          <li>Network-level information such as ASN, ISP and routing metadata</li>
          <li>Geolocation inferences based on public IP databases</li>
          <li>Client-side characteristics such as device memory, CPU cores and WebGL data</li>
          <li>Security-related state including HTTPS, DNT, cookie support and storage APIs</li>
        </ul>

        <p>
          By revealing this information back to the user, IP Raven helps demystify how
          websites, trackers and analytics systems can identify or classify devices
          — even without cookies or explicit identifiers.
        </p>
      </section>

      <section class="card">
        <h2>Technical Approach</h2>
        <p>
          IP Raven combines server-side inspection with client-side analysis to provide
          a comprehensive overview of the information typically exposed during normal web
          browsing. The server processes only the minimal data required to deliver the
          service — primarily the incoming IP address for rate limiting and security.
        </p>

        <p>
          All browser fingerprinting is computed locally in your browser. These values are
          displayed on the page but are not transmitted back to the server, ensuring that the
          educational aspect of the platform does not come at the cost of additional tracking.
        </p>

        <p>
          The platform is built with modern web technologies, optimized for speed, accuracy
          and stability, while maintaining strict privacy-first principles.
        </p>
      </section>

      <section class="card">
        <h2>Our Philosophy</h2>
        <p>
          Online privacy is not just a legal requirement — it is a fundamental part of
          digital security. Understanding what data you expose is the first step toward
          protecting it.
        </p>

        <p>
          IP Raven is designed under three core principles:
        </p>

        <ul>
          <li><strong>Transparency:</strong> Show exactly what information is visible.</li>
          <li><strong>Accuracy:</strong> Provide reliable, technical insights without exaggeration.</li>
          <li><strong>Privacy:</strong> Collect as little personal data as possible.</li>
        </ul>
      </section>

      <section class="card">
        <h2>Contact</h2>
        <p>
          For questions, feedback or suggestions, feel free to contact us:
        </p>
        <p>
          <strong>Email:</strong>
          <a href="mailto:contact@ipraven.com">contact@ipraven.com</a>
        </p>
      </section>

    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  document.title = 'About - IP Raven'
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
  max-width: 900px;
  margin: 0 auto;
}

.header {
  margin-bottom: 1.75rem;
}

.header h1 {
  font-size: 2rem;
  margin: 0 0 0.5rem;
  color: #f9fafb;
}

.subtitle {
  margin: 0;
  color: #9ca3af;
  font-size: 0.95rem;
}

.card {
  background: #020617;
  border-radius: 0.75rem;
  border: 1px solid #1f2937;
  padding: 1.1rem 1.3rem 1.2rem;
  margin-bottom: 1.1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
}

.card h2 {
  margin-top: 0;
  margin-bottom: 0.6rem;
  font-size: 1.1rem;
  color: #e5e7eb;
}

.card p {
  margin: 0 0 0.6rem;
  font-size: 0.9rem;
  line-height: 1.5;
}

.card ul {
  margin: 0 0 0.7rem 1.1rem;
  padding: 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

.card li + li {
  margin-top: 0.2rem;
}

a {
  color: #38bdf8;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
