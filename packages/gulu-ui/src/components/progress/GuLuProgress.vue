<template>
  <div class="gulu-progress" :class="progressClasses">
    <!-- 顶部文字显示 -->
    <div v-if="textDirection === 'top'" :style="topTextStyle" class="gulu-progress-top-text">
      {{ displayPercentage }}%
    </div>

    <!-- 进度条容器 -->
    <div class="gulu-progress-bar" :style="barStyle">
      <!-- 进度条背景 -->
      <div class="gulu-progress-bar-fill" :style="fillStyle"></div>
    </div>

    <!-- 右侧文字显示 -->
    <div v-if="textDirection === 'right'">{{ displayPercentage }}%</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(
  defineProps<{
    percentage?: number
    textDirection?: 'top' | 'right'
    theme?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
    width?: string
    color?: `${number},${number},${number}` | `${number},${number},${number}`[]
    backgroundColor?: `${number},${number},${number}`
  }>(),
  {
    percentage: 0,
    textDirection: 'top',
    theme: 'primary',
    width: '0.3rem',
  }
)

// 计算显示的百分比（限制在0-100之间）
const displayPercentage = computed(() => {
  return Math.max(0, Math.min(100, Math.round(props.percentage)))
})

// 进度条容器类名
const progressClasses = computed(() => {
  return {
    'gulu-progress-top': props.textDirection === 'top',
    'gulu-progress-right': props.textDirection === 'right',
  }
})

// 进度条容器样式
const barStyle = computed(() => {
  return {
    height: props.width,
    '--bg': props.backgroundColor || 'var(--gulu-secondary-rgb)',
  }
})

const topTextStyle = computed(() => {
  return {
    marginLeft: displayPercentage.value + '%',
  }
})

const fillStyle = computed(() => {
  let bgi = ''
  if (props.color) {
    if (props.color instanceof Array) {
      bgi = `linear-gradient(to right, ${props.color.map(color => `rgba(${color},0.8)`).join(',')})`
    } else {
      bgi = `linear-gradient(to right, rgba(${props.color},0.8))`
    }
  } else {
    bgi = `linear-gradient(to right, rgba(var(--gulu-${props.theme}-rgb),0.8))`
  }
  return {
    '--bgi': bgi,
    height: props.width,
    width: displayPercentage.value + '%',
    transition: 'width 1s ease',
  }
})
</script>

<style scoped lang="less">
.gulu-progress {
  width: 100%;
  display: flex;

  &.gulu-progress-top {
    flex-direction: column;
    align-items: flex-start;

    .gulu-progress-top-text {
      width: fit-content;
      transition: margin-left 1s ease;
      transform: translateX(-100%);
    }
  }

  &.gulu-progress-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .gulu-progress-bar {
    width: 100%;
    background-color: rgba(var(--bg), 0.8);

    .gulu-progress-bar-fill {
      transition: width 1s ease;
      background-image: var(--bgi);
    }
  }
}
</style>
