<script lang="ts">
export interface NavAccountCardProps {
  username: string
  nickname?: string
  avatarSrc?: string
  avatarFallback?: string
  logoutLabel?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Avatar } from '../avatar/index.js'
import { Button } from '../button/index.js'

const props = withDefaults(defineProps<NavAccountCardProps>(), {
  logoutLabel: 'Log out',
})

const emit = defineEmits<{
  logout: []
}>()

const classes = computed(() => ['cu-nav-account-card', props.class].filter(Boolean).join(' '))
const fallback = computed(
  () => props.avatarFallback ?? Array.from(props.username.trim())[0]?.toUpperCase() ?? '?',
)
</script>

<template>
  <div
    :class="classes"
    data-ai-role="nav-account-card"
    data-ai-intent="identify-user"
    data-ai-state="default"
  >
    <Avatar
      class="cu-nav-account-card__avatar"
      :src="avatarSrc"
      :alt="username"
      :fallback="fallback"
      size="sm"
    />
    <div class="cu-nav-account-card__text">
      <span class="cu-nav-account-card__username">{{ username }}</span>
      <span v-if="nickname" class="cu-nav-account-card__nickname">{{ nickname }}</span>
    </div>
    <Button
      class="cu-nav-account-card__logout"
      type="button"
      variant="ghost"
      size="sm"
      :aria-label="logoutLabel"
      @click="emit('logout')"
    >
      <template #icon>
        <svg viewBox="0 0 24 24" class="cu-nav-account-card__logout-svg" aria-hidden="true">
          <path
            d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5M16 8l4 4-4 4M20 12H10"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
      </template>
      <span class="cu-nav-account-card__logout-label">{{ logoutLabel }}</span>
    </Button>
  </div>
</template>

<style src="./styles.css"></style>
