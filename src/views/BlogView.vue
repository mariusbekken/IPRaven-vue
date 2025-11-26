<template>
  <div class="blog-page">
    <div class="blog-container">
      <header class="blog-header">
        <h1>Blog</h1>
        <p class="blog-subtitle">
          Short, practical posts about privacy, browser fingerprinting and network security.
        </p>
      </header>

      <section v-if="posts.length" class="blog-list">
        <article
          v-for="post in posts"
          :key="post.slug"
          class="blog-card"
        >
          <h2 class="blog-title">
            <RouterLink :to="`/blog/${post.slug}`">
              {{ post.title }}
            </RouterLink>
          </h2>

          <div class="blog-meta">
            <span v-if="post.publishedAt">
              {{ formatDate(post.publishedAt) }}
            </span>
            <span v-if="post.readingMinutes">· {{ post.readingMinutes }} min read</span>
          </div>

          <p class="blog-excerpt">
            {{ post.excerpt }}
          </p>

          <div class="blog-tags" v-if="post.tags && post.tags.length">
            <span
              v-for="tag in post.tags"
              :key="tag"
              class="tag"
            >
              #{{ tag }}
            </span>
          </div>

          <RouterLink
            :to="`/blog/${post.slug}`"
            class="blog-read-more"
          >
            Read article →
          </RouterLink>
        </article>
      </section>

      <p v-else class="blog-empty">
        No blog posts yet. Check back soon.
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// NB: sti er relativ til denne fila (src/views/BlogView.vue)
// Juster hvis du legger fila et annet sted.
const modules = import.meta.glob('../data/blog/posts/*.json', {
  eager: true
})

const rawPosts = Object.values(modules).map((mod) => {
  // Vite loader JSON som default-eksport
  return mod.default || mod
})

const posts = computed(() => {
  return rawPosts
    .filter((p) => p && p.status !== 'draft')
    .sort((a, b) => {
      const da = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
      const db = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
      return db - da
    })
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  })
}
</script>

<style scoped>
.blog-page {
  min-height: 100vh;
  background: #0f172a;
  color: #e5e7eb;
  padding: 2rem 1rem;
}

.blog-container {
  max-width: 900px;
  margin: 0 auto;
}

.blog-header h1 {
  font-size: 2rem;
  margin: 0 0 0.5rem;
  color: #f9fafb;
}

.blog-subtitle {
  margin: 0;
  color: #9ca3af;
  font-size: 0.95rem;
}

.blog-list {
  margin-top: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.blog-card {
  background: #020617;
  border-radius: 0.75rem;
  border: 1px solid #1f2937;
  padding: 1rem 1.2rem 1.1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
}

.blog-title {
  font-size: 1.15rem;
  margin: 0 0 0.35rem;
}

.blog-title a {
  color: #e5e7eb;
  text-decoration: none;
}

.blog-title a:hover {
  color: #38bdf8;
}

.blog-meta {
  font-size: 0.8rem;
  color: #9ca3af;
  margin-bottom: 0.4rem;
}

.blog-excerpt {
  margin: 0.2rem 0 0.5rem;
  font-size: 0.9rem;
  color: #cbd5e1;
}

.blog-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: 0.6rem;
}

.tag {
  font-size: 0.75rem;
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  border: 1px solid #1f2937;
  background: rgba(15, 23, 42, 0.9);
  color: #a5b4fc;
}

.blog-read-more {
  font-size: 0.85rem;
  color: #38bdf8;
  text-decoration: none;
}

.blog-read-more:hover {
  text-decoration: underline;
}

.blog-empty {
  margin-top: 2rem;
  color: #9ca3af;
  font-size: 0.9rem;
}
</style>
