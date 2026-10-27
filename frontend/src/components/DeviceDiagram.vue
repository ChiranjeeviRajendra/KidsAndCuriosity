<script setup>
import { computed, useId } from 'vue'
import { deviceSvg } from '../lib/devices'

const props = defineProps({
  type: { type: String, default: 'fridge' },
  progress: { type: Number, default: 1 },
  labels: { type: Boolean, default: true },
})
const id = useId().replaceAll(':', '')
const artwork = computed(() => deviceSvg(props.type, props.progress, { labels: props.labels, id }))
</script>

<template>
  <div class="device-diagram" aria-hidden="true" v-html="artwork"></div>
</template>

<style>
.device-diagram {
  width: 100%;
}
.device-diagram > svg {
  width: 100%;
  height: 100%;
  display: block;
  overflow: visible;
}
</style>
