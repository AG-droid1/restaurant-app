<template>
  <div class="toast-container">
    <transition-group name="toast-fade">
      <div 
        v-for="toast in toasts" 
        :key="toast.id" 
        :class="['toast-item', toast.type]"
      >
        <span class="icon">{{ toast.type === 'success' ? '✅' : '❌' }}</span>
        {{ toast.text }}
      </div>
    </transition-group>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: { ...mapState(['toasts']) }
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast-item {
  padding: 15px 25px;
  border-radius: 12px;
  color: white;
  font-weight: bold;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 250px;
}

.success { background: #2ecc71; }
.error { background: #e74c3c; }

/* Анимация */
.toast-fade-enter-active, .toast-fade-leave-active { transition: all 0.4s ease; }
.toast-fade-enter-from { opacity: 0; transform: translateX(50px); }
.toast-fade-leave-to { opacity: 0; transform: scale(0.9); }
</style>