<template>
  <div class="admin-chat">
    <h2>Чат с клиентами</h2>

    <div class="chat-window" ref="chatWindow">
      <div v-for="(msg, index) in filteredChat" :key="index" :class="['chat-msg', msg.from]">
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
    filteredChat() {
    return this.chatMessages.filter(msg => msg.from !== 'system');
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
  max-width: 500px;
  margin: 40px auto;
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
  overflow: hidden;
}

h2 {
  background: #2c3e50; 
  color: white;
  margin: 0;
  padding: 15px;
  text-align: center;
}

.chat-window {
  height: 450px;
  padding: 20px;
  background: #f4f7f6;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chat-msg {
  padding: 10px 15px;
  border-radius: 12px;
  font-size: 0.9rem;
}


.chat-msg.user {
  background: #e0e0e0;
  color: #444;
  align-self: flex-start;
}


.chat-msg.admin {
  background: #28a745;
  color: white;
  align-self: flex-end;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.2);
}

.chat-form {
  padding: 15px;
  display: flex;
  gap: 10px;
  background: #fff;
}

.chat-form input {
  flex: 1;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.chat-form button {
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}
</style>
