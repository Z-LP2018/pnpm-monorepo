<template>
  <button class="gulu-button px-4 py-2 rounded-sm" :class="buttonClasses" :disabled="loading">
    <span v-if="loading" class="gulu-button-loading"></span>
    <span class="gulu-button-content" :class="{ 'opacity-0': loading }">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  //是否显示加载状态
  loading?: boolean
  //按钮的语义类别
  variant?: 'primary' | 'secondary' | 'ghost'
}>()

const buttonClasses = computed(() => {
  return {
    primary: props.variant === 'primary' || !props.variant,
    secondary: props.variant === 'secondary',
    ghost: props.variant === 'ghost',
    loading: props.loading,
    'cursor-not-allowed': props.loading,
    'cursor-pointer': !props.loading,
  }
})
</script>

<style scoped lang="less">
.gulu-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  user-select: none;

  &.primary {
    background-color: var(--gulu-primary);
    color: #fff;
    border: none;
    transition: all 0.2s ease;

    &:hover:not(.loading) {
      background-color: var(--gulu-primary-dark);
    }
  }

  &.secondary {
    background-color: var(--gulu-secondary);
    color: #fff;
    border: none;
    transition: all 0.2s ease;

    &:hover:not(.loading) {
      background-color: var(--gulu-secondary-dark);
    }
  }

  &.ghost {
    background-color: transparent;
    color: var(--gulu-primary);
    border: 1px solid var(--gulu-primary);
    box-shadow: none;
    transition: all 0.2s ease;

    &:hover:not(.loading) {
      background-color: var(--gulu-primary-light);
    }
  }

  &:active:not(.loading) {
    transform: translateY(1px);
  }

  .gulu-button-content {
    transition: opacity 0.2s ease;
  }

  .gulu-button-loading {
    position: absolute;
    width: 16px;
    height: 16px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: gulu-button-spin 0.6s linear infinite;
  }
}

@keyframes gulu-button-spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
