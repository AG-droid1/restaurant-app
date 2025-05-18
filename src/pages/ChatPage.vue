<template>
  <div class="chat-page">
    <h2>Чат с поддержкой</h2>

    <div class="chat-window">
      <div v-for="(msg, index) in messages" :key="index" :class="['chat-msg', msg.from]">
        <span>{{ msg.text }}</span>
      </div>
    </div>

    <form @submit.prevent="sendMessage" class="chat-form">
      <input v-model="message" type="text" placeholder="Напишите сообщение..." required />
      <button type="submit">Отправить</button>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'ChatPage',
  data() {
    return {
      message: ''
    }
  },
  computed: {
    ...mapGetters(['chatMessages']),
    messages() {
      return this.chatMessages
    }
  },
  methods: {
    ...mapMutations(['addMessage']),
    sendMessage() {
      this.addMessage({ text: this.message, from: 'user' })

      // Автоответ (заглушка)
      setTimeout(() => {
        this.addMessage({ text: 'Спасибо за ваше сообщение! Мы скоро ответим.', from: 'admin' })
      }, 1000)

      this.message = ''
    }
  }
}
</script>

<style scoped>
.chat-page {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
}

.chat-window {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 15px;
  background: #f9f9f9;
}

.chat-msg {
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 6px;
  max-width: 70%;
}

.chat-msg.user {
  background: #d1e7ff;
  align-self: flex-end;
  margin-left: auto;
}

.chat-msg.admin {
  background: #e6ffe6;
  align-self: flex-start;
}

.chat-form {
  display: flex;
  gap: 10px;
}

.chat-form input {
  flex: 1;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.chat-form button {
  padding: 10px 20px;
  border: none;
  background-color: #ff6347;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}
</style>
