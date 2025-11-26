<template>
  <div class="page">
    <div class="container">

      <header class="header">
        <h1>Responsible Disclosure Policy</h1>
        <p class="subtitle">
          Guidelines for reporting security vulnerabilities in a safe, lawful and responsible way.
        </p>
      </header>

      <section class="card">
        <h2>Introduction</h2>
        <p>
          At IP Raven, we take security seriously. While the platform does not process sensitive
          personal data, we believe transparency and responsible communication benefit both
          users and the wider security community.
        </p>
        <p>
          If you discover a vulnerability, we ask that you report it to us privately so we can
          investigate and resolve the issue.
        </p>
      </section>

      <section class="card">
        <h2>How to Report a Vulnerability</h2>
        <p>
          If you believe you have identified a security issue, please contact us at:
        </p>
        <p>
          <strong>Email:</strong>
          <a href="mailto:contact@ipraven.com">contact@ipraven.com</a>
        </p>

        <p>Please include, when possible:</p>
        <ul>
          <li>A clear description of the issue</li>
          <li>Steps to reproduce the vulnerability</li>
          <li>Any proof-of-concept code or screenshots</li>
          <li>Your contact information, if you wish to receive follow-up</li>
        </ul>
      </section>

      <section class="card">
        <h2>What You Must Not Do</h2>
        <p>To protect system integrity and user safety, please refrain from:</p>
        <ul>
          <li>Performing actions that cause service disruption or degradation</li>
          <li>Running automated scans or high-volume traffic tests</li>
          <li>Accessing data belonging to other users</li>
          <li>Modifying or deleting any server-side data</li>
          <li>Attempting social engineering or phishing</li>
          <li>Publicly disclosing the vulnerability before we have addressed it</li>
        </ul>
      </section>

      <section class="card">
        <h2>What You <em>Are</em> Allowed to Test</h2>
        <p>
          We appreciate good-faith testing as long as it does not harm the service or other users.
          The following activities are allowed:
        </p>

        <ul>
          <li>Identifying client-side misconfigurations</li>
          <li>Testing public HTTP endpoints with minimal load</li>
          <li>Reporting privacy-related concerns or data exposure</li>
          <li>Investigating incorrect or unexpected fingerprinting behaviors</li>
        </ul>

        <p>
          IP Raven uses rate limiting and traffic monitoring. Benign testing will not result in
          sanctions, but abusive or harmful actions may lead to automated blocking.
        </p>
      </section>

      <section class="card">
        <h2>Legal Safe Harbor</h2>
        <p>
          We support responsible security research. If you adhere to the guidelines in this policy
          and act in good faith, we will not pursue legal action for genuine vulnerability
          discovery.
        </p>
        <p>
          This safe harbor does not cover:
        </p>
        <ul>
          <li>Actions that intentionally cause damage</li>
          <li>Threats, extortion or attempts to obtain compensation</li>
          <li>Breaches of jurisdictions where such testing is prohibited by law</li>
        </ul>
      </section>

      <section class="card">
        <h2>Our Commitment</h2>
        <p>
          We will review all legitimate vulnerability reports and respond as quickly as possible.
          While the platform does not store sensitive user data, we still take every report
          seriously and appreciate contributions to security.
        </p>
      </section>

      <section class="card">
        <h2>Contact</h2>
        <p>
          For all disclosure matters:
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
import { onMounted } from "vue"

onMounted(() => {
  document.title = "Responsible Disclosure - IP Raven"
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #0f172a;
  color: #e5e7eb;
  padding: 2rem 1rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
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
