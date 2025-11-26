<template>
  <div class="page">
    <div class="container">
      <header class="header">
        <h1>Privacy Policy</h1>
        <p class="subtitle">
          This page explains what data IP Raven processes, why we process it, and how you can contact us about privacy.
        </p>
      </header>

      <section class="card">
        <h2>1. Who we are</h2>
        <p>
          IP Raven is a web-based tool that shows you what information your browser and network
          reveal to a server. The purpose of the service is educational: to raise awareness about
          privacy, browser fingerprinting and network security.
        </p>
        <p>
          For questions about this privacy policy or how we handle personal data, you can contact us at:
        </p>
        <p>
          <strong>Email:</strong>
          <a href="mailto:contact@ipraven.com">contact@ipraven.com</a>
        </p>
      </section>

      <section class="card">
        <h2>2. What data we collect</h2>
        <p>
          When you access IP Raven, our server receives technical information that is necessary to deliver
          the service. Currently, we only store the following information:
        </p>
        <ul>
          <li><strong>IP address</strong> – stored temporarily for rate limiting and abuse prevention.</li>
        </ul>
        <p>
          The API response you see in the browser may include derived information about your connection
          (such as approximate location, ASN/ISP or user agent), but this information is generated
          on-the-fly and is not stored in a database by us.
        </p>
      </section>

      <section class="card">
        <h2>3. How we use your IP address</h2>
        <p>
          Your IP address is used for the following limited purposes:
        </p>
        <ul>
          <li>
            <strong>Rate limiting:</strong>
            to prevent excessive or automated requests that could degrade the service for others.
          </li>
          <li>
            <strong>Abuse prevention and security:</strong>
            to help detect and mitigate misuse, such as denial-of-service attempts or other harmful activity.
          </li>
        </ul>
        <p>
          We do not use your IP address for profiling, marketing, or building long-term user profiles.
        </p>
      </section>

      <section class="card">
        <h2>4. Cookies and local storage</h2>
        <p>
          IP Raven does not set or use cookies for tracking or analytics.
        </p>
        <ul>
          <li>No advertising cookies.</li>
          <li>No analytics cookies.</li>
          <li>No fingerprinting cookies or persistent identifiers.</li>
        </ul>
        <p>
          The client-side fingerprinting section on the page runs entirely in your browser. It is
          calculated in memory only and is not sent back to our server as part of normal usage.
        </p>
      </section>

      <section class="card">
        <h2>5. Legal basis for processing</h2>
        <p>
          Because IP Raven is available to users in the EU/EEA, including Norway, the processing of
          personal data is subject to the General Data Protection Regulation (GDPR).
        </p>
        <p>
          Our processing of IP addresses for rate limiting and security is based on
          <strong>legitimate interests</strong>. These interests include:
        </p>
        <ul>
          <li>Maintaining the stability and availability of the service.</li>
          <li>Preventing abuse, misuse and technical attacks.</li>
        </ul>
      </section>

      <section class="card">
        <h2>6. Retention and logs</h2>
        <p>
          IP addresses are stored only as long as necessary for rate limiting and security monitoring.
          Log retention may vary depending on server configuration and security requirements, but we aim
          to keep log data for no longer than is reasonably necessary for these purposes.
        </p>
        <p>
          We do not maintain separate marketing databases of IP addresses or other identifiers.
        </p>
      </section>

      <section class="card">
        <h2>7. Third parties and hosting</h2>
        <p>
          IP Raven is hosted with a third-party hosting provider. As part of providing infrastructure,
          the hosting provider may process server logs that contain IP addresses and technical request
          metadata. This is standard for web hosting and is covered by data processing agreements where applicable.
        </p>
        <p>
          We do not sell or share personal data with third-party advertisers or data brokers.
        </p>
      </section>

      <section class="card">
        <h2>8. Google AdSense and advertising</h2>
        <p>
          At the moment, IP Raven does not display third-party advertisements and does not use Google AdSense
          on the production site.
        </p>
        <p>
          If we later choose to integrate Google AdSense or similar advertising services, this privacy policy
          will be updated before those changes take effect. In that case, we will clearly explain:
        </p>
        <ul>
          <li>What additional data is processed for advertising.</li>
          <li>Which third parties are involved.</li>
          <li>How cookies or similar technologies are used.</li>
          <li>How you can manage or withdraw consent where required.</li>
        </ul>
      </section>

      <section class="card">
        <h2>9. Your rights</h2>
        <p>
          Depending on where you live (for example, within the EU/EEA), you may have certain rights regarding
          your personal data, such as:
        </p>
        <ul>
          <li>Right of access (to know what personal data is processed).</li>
          <li>Right to rectification (to correct inaccurate data).</li>
          <li>Right to erasure (in certain circumstances).</li>
          <li>Right to restriction or objection to processing (in certain circumstances).</li>
        </ul>
        <p>
          Because IP Raven processes very limited personal data (primarily IP addresses in server logs), these
          rights will usually be relevant only in specific cases. If you have questions or concerns about how
          your data is handled, you can contact us at
          <a href="mailto:contact@ipraven.com">contact@ipraven.com</a>.
        </p>
      </section>

      <section class="card">
        <h2>10. Changes to this policy</h2>
        <p>
          We may update this privacy policy from time to time, for example if we change hosting providers,
          add new features, or integrate third-party services such as analytics or advertising.
        </p>
        <p>
          When the policy changes, we will update the <em>“updated”</em> date at the top of this page and,
          where appropriate, provide additional notice on the site.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  document.title = 'Privacy Policy - IP Raven'
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
