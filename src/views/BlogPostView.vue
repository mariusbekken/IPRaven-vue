<template>
  <div class="blog-page">
    <div class="blog-container">
      <div class="back-link-wrapper">
        <RouterLink to="/blog" class="back-link">
          ← Back to blog
        </RouterLink>
      </div>

      <div v-if="post" class="post-wrapper">
        <header class="post-header">
          <h1 class="post-title">{{ post.title }}</h1>

          <div class="post-meta">
            <span v-if="post.publishedAt">
              {{ formatDate(post.publishedAt) }}
            </span>
            <span v-if="post.readingMinutes">· {{ post.readingMinutes }} min read</span>
          </div>

          <div class="post-tags" v-if="post.tags && post.tags.length">
            <span
              v-for="tag in post.tags"
              :key="tag"
              class="tag"
            >
              #{{ tag }}
            </span>
          </div>
        </header>

        <article class="post-content" v-html="post.contentHtml"></article>
      </div>

      <div v-else class="post-not-found">
        <h1>Post not found</h1>
        <p>
          We couldn't find that article. It may have been moved, unpublished, or the link is wrong.
        </p>
        <RouterLink to="/blog" class="back-link">
          ← Back to blog
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const slug = computed(() => route.params.slug)

// samme glob-sti som i BlogView, relativ til denne fila
const modules = import.meta.glob('../data/blog/posts/*.json', {
  eager: true
})

const rawPosts = Object.values(modules).map((mod) => mod.default || mod)

const post = computed(() => {
  const s = slug.value
  if (!s) return null
  const match = rawPosts.find((p) => p.slug === s && p.status !== 'draft')
  return match || null
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
  max-width: 800px;
  margin: 0 auto;
}

.back-link-wrapper {
  margin-bottom: 1rem;
}

.back-link {
  font-size: 0.85rem;
  color: #38bdf8;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

.post-wrapper {
  background: #020617;
  border-radius: 0.75rem;
  border: 1px solid #1f2937;
  padding: 1.5rem 1.4rem 1.6rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
}

.post-header {
  margin-bottom: 1rem;
}

.post-title {
  margin: 0 0 0.4rem;
  font-size: 1.6rem;
  color: #f9fafb;
}

.post-meta {
  font-size: 0.8rem;
  color: #9ca3af;
  margin-bottom: 0.5rem;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.tag {
  font-size: 0.75rem;
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  border: 1px solid #1f2937;
  background: rgba(15, 23, 42, 0.9);
  color: #a5b4fc;
}

.post-content {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #e5e7eb;
}

.post-content p {
  margin: 0 0 0.8rem;
}

.post-content strong {
  color: #f9fafb;
}

.post-content a {
  color: #38bdf8;
  text-decoration: none;
}

.post-content a:hover {
  text-decoration: underline;
}

.post-not-found h1 {
  font-size: 1.4rem;
  margin-bottom: 0.4rem;
}

.post-not-found p {
  font-size: 0.9rem;
  color: #9ca3af;
}
</style>
