<script setup lang="ts">
import { computed, ref } from 'vue'
import { clampProgress, matchesAccept, type UploadFileItem, type UploadProps, type UploadReject } from './upload-logic'

const props = withDefaults(defineProps<UploadProps>(), {
  dropzoneLabel: 'Drag files here',
  browseLabel: 'Browse files',
  multiple: true,
})

const emit = defineEmits<{
  files: [files: File[]]
  reject: [rejections: UploadReject[]]
}>()

const uncontrolledFiles = ref<File[]>([])
const dragover = ref(false)
const inputEl = ref<HTMLInputElement | null>(null)
const isControlled = computed(() => props.files !== undefined)

function toItem(file: File): UploadFileItem {
  return { name: file.name, size: file.size, status: 'queued' }
}

const listed = computed<UploadFileItem[]>(() =>
  isControlled.value ? (props.files ?? []) : uncontrolledFiles.value.map(toItem),
)
const uploading = computed(() =>
  listed.value.some((item) => item.status === 'uploading' || (item.progress !== undefined && item.progress < 100)),
)
const aiState = computed(() => (dragover.value ? 'dragover' : listed.value.length > 0 ? 'uploading' : 'default'))
const classes = computed(() =>
  ['cu-upload', dragover.value ? 'cu-upload--dragover' : '', props.class].filter(Boolean).join(' '),
)
const sizeFormat = new Intl.NumberFormat(undefined, {
  style: 'unit',
  unit: 'kilobyte',
  maximumFractionDigits: 0,
})

function acceptIncoming(incoming: Iterable<File>) {
  const accepted: File[] = []
  const rejections: UploadReject[] = []
  for (const file of incoming) {
    if (!matchesAccept(file, props.accept)) {
      rejections.push({ file, reason: 'type' })
      continue
    }
    if (typeof props.maxSize === 'number' && file.size > props.maxSize) {
      rejections.push({ file, reason: 'size' })
      continue
    }
    accepted.push(file)
  }
  if (rejections.length > 0) emit('reject', rejections)
  if (accepted.length === 0) return
  const nextFiles = props.multiple ? [...uncontrolledFiles.value, ...accepted] : accepted.slice(0, 1)
  if (!isControlled.value) uncontrolledFiles.value = nextFiles
  emit('files', isControlled.value ? (props.multiple ? accepted : accepted.slice(0, 1)) : nextFiles)
}

function onDrop(event: DragEvent) {
  event.preventDefault()
  dragover.value = false
  if (event.dataTransfer?.files) acceptIncoming(event.dataTransfer.files)
}

function onPaste(event: ClipboardEvent) {
  if (event.clipboardData && event.clipboardData.files.length > 0) {
    event.preventDefault()
    acceptIncoming(event.clipboardData.files)
  }
}

function onKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    inputEl.value?.click()
  }
}

function onInputChange(event: Event) {
  const target = event.currentTarget as HTMLInputElement
  acceptIncoming(target.files ?? [])
  target.value = ''
}
</script>

<template>
  <div :class="classes" data-ai-role="upload" data-ai-intent="upload-file" :data-ai-state="aiState">
    <div
      class="cu-upload__dropzone"
      role="button"
      tabindex="0"
      :aria-label="label"
      @dragover.prevent="dragover = true"
      @dragleave="dragover = false"
      @drop="onDrop"
      @paste="onPaste"
      @keydown="onKeyDown"
      @click="inputEl?.click()"
    >
      <span class="cu-upload__hint">{{ dropzoneLabel }}</span>
      <span class="cu-upload__browse">{{ browseLabel }}</span>
    </div>
    <input
      ref="inputEl"
      :accept="accept"
      class="cu-upload__input"
      type="file"
      :multiple="multiple"
      tabindex="-1"
      aria-hidden="true"
      @change="onInputChange"
    />
    <ul v-if="listed.length > 0" class="cu-upload__list">
      <li v-for="(file, index) in listed" :key="`${file.name}-${index}`" class="cu-upload__file">
        <span class="cu-upload__name">{{ file.name }}</span>
        <span class="cu-upload__size">{{ sizeFormat.format(Math.ceil(file.size / 1024)) }}</span>
        <progress
          v-if="clampProgress(file.progress) !== undefined"
          :aria-label="`${file.name} ${clampProgress(file.progress)}%`"
          class="cu-upload__progress"
          max="100"
          :value="clampProgress(file.progress)"
        />
        <span v-if="file.error" class="cu-upload__error">{{ file.error }}</span>
      </li>
    </ul>
    <span v-if="uploading" class="cu-upload__sr">Uploading</span>
  </div>
</template>

<style src="./styles.css"></style>
