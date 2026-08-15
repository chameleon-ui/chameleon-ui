<script lang="ts">
export type { ToasterProps, ToasterStore } from './store'
</script>

<script setup lang="ts">
import Toast from './Toast.vue'
import type { ToasterProps } from './store'

const props = withDefaults(defineProps<ToasterProps>(), {
  closeLabel: 'Close',
})

function onOpenChange(id: string, open: boolean) {
  if (open) return
  props.toaster.remove(id)
}
</script>

<template>
  <div class="cu-toaster" :class="props.class" :data-placement="toaster.placement">
    <Toast
      v-for="item in toaster.items"
      :key="item.id"
      :open="item.open"
      :title="item.title"
      :description="item.description"
      :status="item.status"
      :close-label="closeLabel"
      :duration="item.duration"
      @update:open="(open) => onOpenChange(item.id, open)"
    />
  </div>
</template>

<style src="./styles.css"></style>
