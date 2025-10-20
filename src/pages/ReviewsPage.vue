<template>
  <div class="reviews-page">
    <h2>Отзывы наших гостей</h2>

    <form @submit.prevent="submitReview" class="review-form">
      <input v-model="form.name" type="text" placeholder="Ваше имя" required />
      <textarea v-model="form.message" placeholder="Ваш отзыв" required></textarea>
      <button type="submit">Оставить отзыв</button>
    </form>

    <div class="review" v-for="(review, index) in reviews" :key="index">
  <div class="avatar">{{ review.name.charAt(0).toUpperCase() }}</div>
  <div class="review-content">
    <h4>{{ review.name }}</h4>
    <p>{{ review.message }}</p>
  </div>
</div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

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
    submitReview() {
      const newReview = { ...this.form }
      this.addReview(newReview)
      this.form.name = ''
      this.form.message = ''
    }
  }
}
</script>

<style scoped>
.reviews-page {

  max-width: 600px;
  margin: 0 auto;
  padding: 30px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.reviews-page h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.review-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 30px;
}

.review-form input,
.review-form textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: none;
}

.review-form button {
  padding: 12px;
  background-color: #ff6347;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.review-form button:hover {
  background-color: #e5533c;
}

.reviews-list .review {
  border-top: 1px solid #eee;
  padding: 15px 0;
}

.reviews-list .review h4 {
  margin-bottom: 5px;
  color: #444;
}

.reviews-list .review p {
  margin: 0;
  color: #555;
  line-height: 1.5;
}
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.review {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  background-color: #fdfdfd;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 15px 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.avatar {
  width: 50px;
  height: 50px;
  background-color: #ff6347;
  color: white;
  font-weight: bold;
  font-size: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.review-content {
  flex: 1;
}

.review-content h4 {
  margin: 0 0 5px;
  color: #333;
}

.review-content p {
  margin: 0;
  color: #555;
  line-height: 1.4;
}

</style>
