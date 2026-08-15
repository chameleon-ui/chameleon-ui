<script setup lang="ts">
import { ref } from 'vue'
import { Button, Card, Stack, useToast } from '@chameleon-ui/vue'

const emit = defineEmits<{
  open: []
}>()

const toast = useToast()
const saving = ref(false)

function save() {
  saving.value = true
  window.setTimeout(() => {
    saving.value = false
    toast.push({
      title: 'Saved',
      description: 'Queued toast from ToastProvider.',
      status: 'success',
    })
  }, 400)
}
</script>

<template>
  <Card>
    <Stack gap="2">
      <p>Official external Vite Vue template. Do not compose Sidebar + TabBar.</p>
      <Button :loading="saving" @click="save">Save</Button>
      <Button variant="outline" @click="emit('open')">Open stack</Button>
      <Button
        tone="danger"
        variant="ghost"
        @click="toast.push({ title: 'Delete?', status: 'warning' })"
      >
        Danger ghost
      </Button>
    </Stack>
  </Card>
</template>
