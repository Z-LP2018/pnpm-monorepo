<template>
  <teleport to="body" :disabled="!appendToBody">
    <transition name="dialog-fade">
      <div v-show="modelValue" class="gulu-overlay" :style="{ zIndex }" @click.self="onModalClick">
        <div class="gulu-dialog" :style="{ width }">
          <!-- Header -->
          <header class="gulu-dialog__header">
            <slot name="header">
              <span class="gulu-dialog__title">{{ title }}</span>
            </slot>
            <button class="gulu-dialog__close" @click="close">×</button>
          </header>

          <!-- Body -->
          <main class="gulu-dialog__body">
            <slot />
          </main>

          <!-- Footer -->
          <footer v-if="$slots.footer" class="gulu-dialog__footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, type PropType } from 'vue'

// ==================== Props ====================
const props = defineProps({
  title: String,
  width: { type: String, default: '50%' },
  zIndex: { type: Number, default: 1000 },
  appendToBody: { type: Boolean, default: true },
  closeOnClickModal: { type: Boolean, default: true },
  closeOnPressEscape: { type: Boolean, default: true },
  beforeClose: Function as PropType<(done: () => void) => void>,
})

// ==================== Model ====================
const modelValue = defineModel<boolean>({ default: false })

// ==================== Emits ====================
const emit = defineEmits<{
  open: []
  close: []
}>()

// ==================== Methods ====================

// 关闭方法
const close = () => {
  if (props.beforeClose) {
    props.beforeClose(doClose)
  } else {
    doClose()
  }
}

const doClose = () => {
  modelValue.value = false
}

// 点击遮罩关闭
const onModalClick = () => {
  if (props.closeOnClickModal) {
    close()
  }
}
// ESC 键关闭
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.closeOnPressEscape && modelValue.value) {
    close()
  }
}

// ==================== Watch ====================
watch(modelValue, val => {
  if (val) {
    emit('open')
  } else {
    emit('close')
  }
})

// ==================== Lifecycle ====================
onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})

// ==================== Expose ====================
defineExpose({
  close,
})
</script>

<style lang="less" scoped>
.gulu-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.gulu-dialog {
  transform: translateY(-30%);
  background: white;
  color: #000;
  border-radius: 0.5rem;
  box-shadow: 0 0.2rem 1rem rgba(0, 0, 0, 0.15);
  max-height: 60%;
  overflow: auto;

  &__header {
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
  }

  &__title {
    font-size: 1rem;
    font-weight: 500;
    color: #000;
  }

  &__close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--gulu-secondary);
    padding: 0;
    line-height: 1;

    &:hover {
      color: var(--gulu-primary);
    }
  }

  &__body {
    padding: 1.5rem;
  }

  &__footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #eee;
    text-align: right;
  }
}

/* 过渡动画 */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.3s ease;

  .gulu-dialog {
    transition: transform 0.3s ease;
  }
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;

  .gulu-dialog {
    transform: translateY(-1.5rem);
  }
}
</style>
