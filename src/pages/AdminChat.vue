<template>
  <div class="admin-chat">
    <h2>Чат с клиентами</h2>

    <div class="chat-window" ref="chatWindow">
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
import { mapGetters, mapActions } from 'vuex'

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
   
      ...mapActions(['sendChatMessage', 'fetchChatHistory']), 
    sendMessage() {
      if (this.message.trim() === '') return; 

      const msg = { text: this.message, from: 'admin' };
      this.sendChatMessage(msg); 
      this.message = ''; 
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const chatWindow = this.$refs.chatWindow;
        if (chatWindow) {
          chatWindow.scrollTop = chatWindow.scrollHeight;
        }
      });
    }
  },
  watch: {
    messages: {
      handler() {
        this.scrollToBottom(); 
      },
      deep: true 
    }
  },
  created() {
    this.fetchChatHistory();
  },
  mounted() {
    this.scrollToBottom(); 
  }
}
</script>

<style scoped>
.admin-chat {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
}

.chat-window {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 15px;
  background: #f9f9f9;
  display: flex;
  flex-direction: column;
}


.chat-msg {
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 6px;
  max-width: 70%;
  word-wrap: break-word;
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
  transition: background-color 0.3s ease;
}

.chat-form button:hover {
    background-color: #218838;
}
</style>
