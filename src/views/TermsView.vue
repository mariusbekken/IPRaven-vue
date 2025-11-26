<template>
  <div class="page">
    <div class="container">
      <header class="header">
        <h1>Terms of Use</h1>
        <p class="subtitle">
          These terms govern how you may use IP Raven and what you can expect from the service.
        </p>
      </header>

      <section class="card">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using IP Raven, you agree to these Terms of Use. If you do not agree,
          you should not use the website or its tools.
        </p>
      </section>

      <section class="card">
        <h2>2. Purpose of the Service</h2>
        <p>
          IP Raven is an educational platform that demonstrates what technical information a browser
          and network connection may reveal to a web server. The service is intended to raise awareness
          about privacy and internet security.
        </p>
        <p>
          The service is provided for informational purposes only and should not be interpreted as
          professional security advice.
        </p>
      </section>

      <section class="card">
        <h2>3. User Responsibilities</h2>
        <p>When using IP Raven, you agree not to:</p>
        <ul>
          <li>Use automated tools to excessively query the service.</li>
          <li>Attempt to disrupt, overload or interfere with site functionality.</li>
          <li>Use the service for illegal activities or to collect data on others without consent.</li>
        </ul>
        <p>
          Abuse, misuse or excessive requests may result in temporary or permanent blocking,
          based on rate limiting and security controls.
        </p>
      </section>

      <section class="card">
        <h2>4. Accuracy of Information</h2>
        <p>
          IP Raven processes technical information provided by your browser and network environment.
          While we aim to display accurate results, factors such as VPNs, proxies, browser settings,
          extensions or system configurations may affect the information shown.
        </p>
        <p>
          We make no guarantees regarding accuracy, completeness or reliability of the data provided.
        </p>
      </section>

      <section class="card">
        <h2>5. No Warranty</h2>
        <p>
          IP Raven is provided on an <strong>“as is”</strong> and <strong>“as available”</strong> basis,
          without warranties of any kind. We do not guarantee availability, uninterrupted operation,
          error-free performance or specific results.
        </p>
      </section>

      <section class="card">
        <h2>6. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by applicable law, IP Raven and its operators shall not be
          liable for any indirect, incidental, consequential or punitive damages arising from your
          use of the site.
        </p>
        <p>
          Your use of the website is at your own risk.
        </p>
      </section>

      <section class="card">
        <h2>7. Third-Party Services</h2>
        <p>
          IP Raven may integrate third-party services in the future, such as analytics or advertising platforms
          (including Google AdSense). When such integrations occur, additional disclosures will be provided
          in the Privacy Policy.
        </p>
        <p>
          We are not responsible for the practices, policies or content of third-party websites.
        </p>
      </section>

      <section class="card">
        <h2>8. Changes to the Terms</h2>
        <p>
          These Terms of Use may be updated occasionally, for example if new features are added or if legal
          requirements change. The updated version will be posted on this page along with the revision date.
        </p>
      </section>

      <section class="card">
        <h2>9. Contact</h2>
        <p>
          For questions about these terms, you can contact us at:
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
  document.title = 'Terms of Use - IP Raven'
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
