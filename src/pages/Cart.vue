<template>
  <div class="cart-page">
    <div class="cart-container">
      <h1>🛒 Ваша корзина</h1>

      <div v-if="cart.length" class="cart-details">
        
        <div class="cart-list">
          <div v-for="(item, index) in cart" :key="index" class="cart-item">
            <div class="item-info">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-price">{{ item.price }} ₽</span>
            </div>
            <button @click="removeFromCart(index)" class="remove-button" title="Удалить из корзины">
              &times;
            </button>
          </div>
        </div>

        <p class="total-bar">
          <span>Итого к оплате:</span> 
          <span class="total-amount">{{ total }} ₽</span>
        </p>

        <form @submit.prevent="submitOrder" class="order-form">
          <h2>Детали доставки</h2>
          
          <div class="form-group">
            <label for="name">Ваше имя</label>
            <input id="name" v-model="form.name" type="text" placeholder="Имя и Фамилия" required />
          </div>
          
          <div class="form-group">
            <label for="address">Адрес доставки</label>
            <input id="address" v-model="form.address" type="text" placeholder="Улица, дом, квартира" required />
          </div>
          
          <div class="form-group">
            <label for="phone">Телефон</label>
            <input id="phone" v-model="form.phone" type="tel" placeholder="+7 (XXX) XXX-XX-XX" required />
          </div>
          
          <button type="submit" class="submit-button">
            Оформить заказ и оплатить
          </button>
        </form>
      </div>

      <div v-else class="empty-cart">
        <p>Корзина пуста. <router-link to="/menu">Посмотреть меню</router-link>.</p>
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
        address: '',
        phone: ''
      }
    }
  },
  computed: {
    ...mapState(['cart']),
    total() {
      return this.cart.reduce((sum, item) => sum + item.price, 0)
    }
  },
  methods: {
    ...mapMutations(['removeFromCart', 'clearCart']),
    submitOrder() {
      
      this.$store.dispatch('showToast', { 
    text: `Спасибо за заказ, ${this.form.name}!`, 
    type: 'success' 
  });
      this.clearCart()
      this.form = { name: '', address: '', phone: '' }
    }
  }
}
</script>

<style scoped>
/* === Основной контейнер страницы === */
.cart-page {
  padding: 40px 20px;
  min-height: 80vh;
}

.cart-container {
  max-width: 800px;
  margin: auto;
  background: rgba(255, 255, 255, 0.95); /* Полупрозрачный белый фон */
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

/* === Стили для списка товаров === */
.cart-list {
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 20px;
  overflow: hidden;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.3s ease;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-info {
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  margin-right: 20px;
}

.item-name {
  font-weight: 500;
  color: #333;
}

.item-price {
  font-weight: bold;
  color: #ff6347;
}

/* Кнопка удаления */
.remove-button {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 1.5em;
  line-height: 1;
  transition: color 0.2s;
  padding: 0 5px;
}

.remove-button:hover {
  color: #e5533d;
}


/* === Стили для итоговой строки === */
.total-bar {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  font-size: 1.3em;
  font-weight: bold;
  border-top: 2px solid #ddd;
  margin-bottom: 30px;
}

.total-amount {
  color: #ff6347;
}

/* === Стили для Формы === */
.order-form {
  border-top: 1px dashed #ccc;
  padding-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.order-form h2 {
    margin-bottom: 15px;
    color: #555;
    font-size: 1.5em;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    font-size: 0.9em;
    color: #666;
    margin-bottom: 5px;
    font-weight: 600;
}

.order-form input {
  padding: 12px 15px;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 1em;
  width: 100%;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.order-form input:focus {
  border-color: #ff6347;
  box-shadow: 0 0 5px rgba(255, 99, 71, 0.4);
  outline: none;
}

/* Кнопка оформления заказа */
.submit-button {
  padding: 15px 20px;
  background-color: #ff6347; /* Фирменный цвет */
  color: white;
  border: none;
  border-radius: 50px; /* Скругленная форма */
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-top: 20px;
  box-shadow: 0 4px 10px rgba(255, 99, 71, 0.3);
}

.submit-button:hover {
  background-color: #e5533d;
  transform: translateY(-2px);
}

/* Пустая корзина */
.empty-cart {
    text-align: center;
    padding: 50px;
    font-size: 1.2em;
    color: #777;
}
</style>
