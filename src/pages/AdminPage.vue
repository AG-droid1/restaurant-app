<template>
    <div class="admin-page">
      <h1>Панель администратора</h1>
  
      <form @submit.prevent="handleSubmit" class="admin-form">
        <input v-model="form.name" type="text" placeholder="Название блюда" required />
        <input v-model="form.description" type="text" placeholder="Описание" required />
        <input v-model.number="form.price" type="number" placeholder="Цена" required />
        <input v-model="form.image" type="text" placeholder="Ссылка на изображение" required />
        <button type="submit">{{ form.id ? 'Сохранить' : 'Добавить' }}</button>
      </form>
  
      <div class="menu-list">
        <div v-for="item in menuItems" :key="item.id" class="menu-card">
          <img :src="item.image" :alt="item.name" />
          <h2>{{ item.name }}</h2>
          <p>{{ item.description }}</p>
          <span>{{ item.price }} ₽</span>
          <div class="actions">
            <button @click="editItem(item)">✏️</button>
           <button @click="deleteItemFromForm(item.id)">🗑️</button>
          </div>
        </div>
      </div>
      <div class="booking-list" v-if="bookings.length">
  <h2>Бронирования</h2>
  <ul>
    <li v-for="(booking, index) in bookings" :key="index">
      <strong>{{ booking.name }}</strong> — 
      {{ booking.date }} в {{ booking.time }} на {{ booking.guests }} чел. 
      ({{ booking.phone }})
      <button @click="removeBooking(index)">🗑️</button>
    </li>
  </ul>


  <div class="reviews-section">
  <h2>Отзывы пользователей</h2>

  <div v-for="(review, index) in reviews" :key="index" class="review-card">
    <input v-model="review.name" placeholder="Имя" />
    <textarea v-model="review.message" placeholder="Отзыв"></textarea>
    <button @click="updateReview({ index, updated: { ...review } })">💾 Сохранить</button>
    <button @click="deleteReview(index)">🗑️ Удалить</button>
  </div>
</div>
</div>
    </div>
  </template>
  
  <script>
import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
   
    ...mapState(['menuItems', 'bookings', 'reviews'])
  },
  data() {
    return {
      form: {
        id: null,
        name: '',
        description: '',
        price: '',
        image: ''
      }
    }
  },
  methods: {
    ...mapMutations(['addMenuItem', 'updateMenuItem', 'deleteMenuItem', 'deleteBooking', 'updateReview', 'deleteReview']),
    handleSubmit() {
      if (this.form.id) {
        this.updateMenuItem({ ...this.form })
      } else {
        const newItem = {
          ...this.form,
          id: Date.now()
        }
        this.addMenuItem(newItem)
      }
      this.resetForm()
    },
    editItem(item) {
      this.form = { ...item }
    },
    deleteItemFromForm(id) {
      this.deleteMenuItem(id)
      if (this.form.id === id) this.resetForm()
    },
    resetForm() {
      this.form = {
        id: null,
        name: '',
        description: '',
        price: '',
        image: ''
      }
    },
    removeBooking(index) {
  this.deleteBooking(index)
}
  }
}
</script>

  <!-- <script>
  export default {
    name: 'AdminPage',
    data() {
      return {
        menuItems: [],
        form: {
          id: null,
          name: '',
          description: '',
          price: '',
          image: ''
        }
      }
    },
    methods: {
      handleSubmit() {
        if (this.form.id) {
          const index = this.menuItems.findIndex(i => i.id === this.form.id)
          this.menuItems.splice(index, 1, { ...this.form })
        } else {
          const newItem = {
            ...this.form,
            id: Date.now()
          }
          this.menuItems.push(newItem)
        }
        this.resetForm()
      },
      editItem(item) {
        this.form = { ...item }
      },
      deleteItem(id) {
        this.menuItems = this.menuItems.filter(item => item.id !== id)
        if (this.form.id === id) this.resetForm()
      },
      resetForm() {
        this.form = {
          id: null,
          name: '',
          description: '',
          price: '',
          image: ''
        }
      }
    }
  }
  </script> -->
  
  <style scoped>
  .admin-page {
    padding: 40px;
  }
  
  .admin-form {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    flex-wrap: wrap;
  }
  
  .admin-form input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    flex: 1 1 200px;
  }
  
  .admin-form button {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
  }
  
  .menu-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .menu-card {
    width: 220px;
    border: 1px solid #eee;
    border-radius: 10px;
    padding: 15px;
    text-align: center;
    position: relative;
  }
  
  .menu-card img {
    width: 100%;
    height: 130px;
    object-fit: cover;
    margin-bottom: 10px;
    border-radius: 6px;
  }
  
  .actions {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 10px;
  }
  
  .actions button {
    background: none;
    border: none;
    font-size: 1.2em;
    cursor: pointer;
  }
  .booking-list {
  margin-top: 40px;
}
.booking-list ul {
  list-style: none;
  padding: 0;
}
.booking-list li {
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}
.booking-list button {
  margin-left: 10px;
  cursor: pointer;
  border: none;
  background: transparent;
  font-size: 1em;
}
.reviews-section {
  margin-top: 40px;
}

.review-card {
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.review-card input,
.review-card textarea {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}


  </style>
  