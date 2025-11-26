<template>
  <footer class="footer">
    <div class="footer-container">

      <!-- Left side -->
      <div class="footer-section">
        <h3 class="footer-title">IP Raven</h3>
        <p class="footer-tagline">Privacy • Security • Fingerprint Awareness</p>
      </div>

      <!-- Middle links -->
      <div class="footer-section footer-links">
        <RouterLink to="privacy" class="footer-link">Privacy Policy</RouterLink>
        <RouterLink to="terms" class="footer-link">Terms of Use</RouterLink>
        <RouterLink to="about" class="footer-link">About</RouterLink>
        <RouterLink to="/disclosure" class="footer-link">Responsible Disclosure</RouterLink>
      </div>

      <!-- Blog section -->
      <div class="footer-section blog-section">
        <h4 class="blog-title">Latest Blog Posts</h4>

        <div v-if="latestPosts.length" class="blog-list">
          <RouterLink
            v-for="post in latestPosts"
            :key="post.slug"
            :to="`/blog/${post.slug}`"
            class="footer-blog-link"
          >
            {{ post.title }}
          </RouterLink>
        </div>

        <RouterLink to="/blog" class="footer-link see-all">
          View all posts →
        </RouterLink>
      </div>

      <!-- Right side -->
      <div class="footer-section">
        <p class="footer-small">Built with 🔐 and ❤️</p>
        <a
          href="https://github.com/"
          target="_blank"
          rel="noopener"
          class="footer-link external"
        >
          GitHub Repository
        </a>
      </div>

    </div>

    <!-- Copyright -->
    <div class="footer-bottom">
      © {{ currentYear }} IP Raven — All rights reserved.
    </div>
  </footer>
</template>

<script setup>
import { computed } from "vue"

// Auto-year
const currentYear = computed(() => new Date().getFullYear())

// Load blog JSON files
const modules = import.meta.glob('@/data/blog/posts/*.json', { eager: true })

const rawPosts = Object.values(modules).map((mod) => mod.default || mod)

// Sort by date and pick latest 5
const latestPosts = computed(() => {
  return rawPosts
    .filter((p) => p.status !== "draft")
    .sort((a, b) => {
      const da = new Date(a.publishedAt).getTime()
      const db = new Date(b.publishedAt).getTime()
      return db - da
    })
    .slice(0, 5)
})
</script>

<style scoped>
.footer {
  background: #020617;
  border-top: 1px solid #1e293b;
  padding: 2rem 1rem 1.2rem;
  margin-top: 3rem;
  color: #cbd5e1;
  font-size: 0.9rem;
}

.footer-container {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

/* Title + Tagline */
.footer-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
}

.footer-tagline {
  font-size: 0.85rem;
  color: #94a3b8;
  margin: 0;
}

/* Middle links */
.footer-links {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.footer-link {
  color: #cbd5e1;
  text-decoration: none;
  transition: color 0.15s ease;
  font-size: 0.9rem;
}

.footer-link:hover {
  color: #38bdf8;
}

/* Blog section */
.blog-section {
  min-width: 180px;
}

.blog-title {
  font-size: 1rem;
  margin: 0 0 0.3rem;
  color: #f1f5f9;
}

.blog-list {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin-bottom: 0.5rem;
}

.footer-blog-link {
  font-size: 0.87rem;
  color: #cbd5e1;
  text-decoration: none;
  transition: color 0.15s ease;
}

.footer-blog-link:hover {
  color: #38bdf8;
}

.see-all {
  margin-top: 0.3rem;
  font-size: 0.85rem;
  color: #38bdf8;
}

/* Right side */
.external {
  margin-top: 0.2rem;
}

.footer-small {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
}

/* Bottom line */
.footer-bottom {
  margin-top: 1.5rem;
  text-align: center;
  color: #64748b;
  font-size: 0.8rem;
  padding-top: 1rem;
  border-top: 1px solid #1e293b;
}

/* Responsive */
@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .footer-section {
    align-items: center;
  }

  .blog-section {
    align-items: center;
  }
}
</style>
