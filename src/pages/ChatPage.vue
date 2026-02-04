<template>
  <div class="chat-page">
    <h2>Чат с поддержкой</h2>

    <div class="chat-window" ref="chatWindow">
      <div v-for="(msg, index) in displayMessages" :key="index" :class="['chat-msg', msg.from]">
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
import { mapGetters,mapActions  } from 'vuex'

export default {
  name: 'ChatPage',
  data() {
    return {
      message: ''
    }
  },
  computed: {
    ...mapGetters(['chatMessages']),
    displayMessages() {
    return this.chatMessages.filter(msg => msg.from !== 'system');
  }
  },
  methods: {
    // ...mapMutations(['addMessage']),
    // sendMessage() {
    //   this.addMessage({ text: this.message, from: 'user' })

    //   // Автоответ (заглушка)
    //   setTimeout(() => {
    //     this.addMessage({ text: 'Спасибо за ваше сообщение! Мы скоро ответим.', from: 'admin' })
    //   }, 1000)

    //   this.message = ''
  //   }
    ...mapActions(['sendChatMessage', 'fetchChatHistory']), 
    sendMessage() {
      if (this.message.trim() === '') return; 

      const msg = { text: this.message, from: 'user' };
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
.chat-page {
  max-width: 500px;
  margin: 40px auto;
  background: rgba(255, 255, 255, 0.9); 
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}

h2 {
  background: #ff6347;
  color: white;
  margin: 0;
  padding: 20px;
  text-align: center;
  font-size: 1.2rem;
}

.chat-window {
  padding: 20px;
  height: 400px;
  overflow-y: auto;
  background: #fdf5e6; 
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chat-msg {
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 0.95rem;
  line-height: 1.4;
  position: relative;
  max-width: 80%;
}


.chat-msg.user {
  background: #ff6347;
  color: white;
  align-self: flex-end;
  border-bottom-right-radius: 4px; 
  box-shadow: 0 4px 10px rgba(255, 99, 71, 0.3);
}


.chat-msg.admin {
  background: white;
  color: #333;
  align-self: flex-start;
  border-bottom-left-radius: 4px; 
  border: 1px solid #eee;
}


.chat-form {
  padding: 20px;
  background: white;
  display: flex;
  gap: 10px;
  border-top: 1px solid #eee;
}

.chat-form input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 25px;
  outline: none;
  transition: border 0.3s;
}

.chat-form input:focus {
  border-color: #ff6347;
}

.chat-form button {
  background: #ff6347;
  color: white;
  border: none;
  padding: 0 20px;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, background 0.3s;
}

.chat-form button:hover {
  background: #e0523f;
  transform: scale(1.05);
}
</style>
