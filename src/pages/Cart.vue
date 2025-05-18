<template>
  <div class="cart-page">
    <h1>🛒 Ваша корзина</h1>

    <div v-if="cart.length">
      <div v-for="(item, index) in cart" :key="index" class="cart-item">
        <p>{{ item.name }} — {{ item.price }} ₽</p>
        <button @click="removeFromCart(index)">Удалить</button>
      </div>

      <p class="total">Итого: {{ total }} ₽</p>

      <form @submit.prevent="submitOrder" class="order-form">
        <input v-model="form.name" placeholder="Имя" required />
        <input v-model="form.address" placeholder="Адрес" required />
        <input v-model="form.phone" placeholder="Телефон" required />
        <button type="submit">Оформить заказ</button>
      </form>
    </div>

    <p v-else>Корзина пуста.</p>
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
      // Здесь могла бы быть отправка на сервер
      alert(`Спасибо за заказ, ${this.form.name}!`)
      this.clearCart()
      this.form = { name: '', address: '', phone: '' }
    }
  }
}
</script>

<style scoped>
.cart-page {
  padding: 40px;
}

.cart-item {
  margin-bottom: 10px;
}

.order-form {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.total {
  font-weight: bold;
  margin-top: 15px;
}
</style>
