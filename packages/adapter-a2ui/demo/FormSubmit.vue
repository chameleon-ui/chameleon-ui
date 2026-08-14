<script setup lang="ts">
import { ref } from 'vue'
import { Button, Input } from '@chameleon-ui/components-vue'
import '@chameleon-ui/tokens/css'
import '@chameleon-ui/tokens/density.css'

const email = ref('')

function submit() {
  // eslint-disable-next-line no-console
  console.log('submit', email.value)
}
</script>

<template>
  <form class="cu-form" @submit.prevent="submit">
    <Input label="Email" id="email" v-model="email" />
    <div class="cu-form__actions">
      <Button type="submit" intent="submit">Sign in</Button>
    </div>
  </form>
</template>

<style>
.cu-form {
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-3);
}

.cu-form__actions {
  display: flex;
  justify-content: flex-start;
  margin-block-start: var(--cu-space-2);
}
</style>
