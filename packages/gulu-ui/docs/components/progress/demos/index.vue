<script setup lang="ts">
import { GuLuProgress } from '@gulu/ui'
import { ref } from 'vue'

const percentage = ref(0)

// 模拟进度变化
setTimeout(() => {
  percentage.value = 30
}, 500)

setTimeout(() => {
  percentage.value = 60
}, 1500)

setTimeout(() => {
  percentage.value = 90
}, 2500)
</script>

<template>
  <div class="gulu-progress-demo">
    <GuLuProgress :percentage="percentage" />
  </div>
</template>

<style scoped lang="less">
.gulu-progress-demo {
  width: 100%;
  padding: 20px 0;
}
</style>
