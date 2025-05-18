<template>
  <div class="admin-chat">
    <h2>Чат с клиентами</h2>

    <div class="chat-window">
      <div v-for="(msg, index) in messages" :key="index" :class="['chat-msg', msg.from]">
        <span><strong>{{ msg.from === 'admin' ? 'Вы' : 'Клиент' }}:</strong> {{ msg.text }}</span>
      </div>
    </div>

    <form @submit.prevent="sendMessage" class="chat-form">
      <input v-model="message" type="text" placeholder="Ответить клиенту..." required />
      <button type="submit">Отправить</button>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'AdminChat',
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
      this.addMessage({ text: this.message, from: 'admin' })
      this.message = ''
    }
  }
}
</script>

<style scoped>
.admin-chat {
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
  align-self: flex-start;
}

.chat-msg.admin {
  background: #e6ffe6;
  align-self: flex-end;
  margin-left: auto;
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
  background-color: #28a745;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}
</style>
