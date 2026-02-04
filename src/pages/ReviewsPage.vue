<template>
  <div class="reviews-page">
    <h2>Отзывы наших гостей</h2>

    <form @submit.prevent="submitReview" class="review-form">
      <input v-model="form.name" type="text" placeholder="Ваше имя" required />
      <textarea v-model="form.message" placeholder="Ваш отзыв" required></textarea>
      <button type="submit">Оставить отзыв</button>
    </form>

    <div class="reviews-list">
      <div class="review" v-for="(review, index) in reviews" :key="index">
        <div class="avatar">{{ review.name.charAt(0).toUpperCase() }}</div>
        <div class="review-content">
          <h4>{{ review.name }}</h4>
          <p>{{ review.message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Добавляем mapActions для работы с сокетами
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  data() {
    return {
      form: {
        name: '',
        message: ''
      }
    }
  },
  computed: {
    ...mapState(['reviews'])
  },
  methods: {
    ...mapMutations(['addReview']),
    // Подключаем действие отправки сообщения в чат (через WebSocket)
    ...mapActions(['sendChatMessage']),

    submitReview() {
      if (!this.form.name || !this.form.message) return;

      const newReview = { ...this.form };
      
      // 1. Сохраняем отзыв локально в список отзывов
      this.addReview(newReview);

      // 2. Формируем системное уведомление для админа
      const notification = {
        text: `⭐ НОВЫЙ ОТЗЫВ: ${newReview.name} написал: "${newReview.message.substring(0, 50)}${newReview.message.length > 50 ? '...' : ''}"`,
        from: 'system',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // 3. Отправляем в WebSocket, чтобы админ увидел это в ленте событий
      this.sendChatMessage(notification);

      // Очистка формы
      this.form.name = '';
      this.form.message = '';
      
      this.$store.dispatch('showToast', { text: 'Отзыв опубликован. Спасибо!', type: 'success' });
    }
  }
}
</script>

<style scoped>
/* Стили оставляем те же, они у тебя отличные */
.reviews-page {
  max-width: 600px;
  margin: 40px auto;
  padding: 30px;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.review-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 40px;
}

.review-form input,
.review-form textarea {
  padding: 14px;
  border: 1px solid #eee;
  border-radius: 10px;
  background: #fdfdfd;
  font-family: inherit;
}

.review-form button {
  padding: 14px;
  background-color: #ff6347;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.review-form button:hover {
  background-color: #e5533c;
  transform: translateY(-2px);
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 20px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);
}

.avatar {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #ff6347, #ff8c7a);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}
/* ... остальные стили контента ... */
</style>