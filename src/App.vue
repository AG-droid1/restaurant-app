
<template>
  <div id="app">
    <header class="app-header">
       <div class="nav-container">
        <button class="burger" @click="isMenuOpen = !isMenuOpen">☰</button>
      <nav :class="['nav', { open: isMenuOpen }]">
        <router-link to="/" class="nav-link" @click="closeMenu">🏠 Главная</router-link>
          <router-link to="/menu" class="nav-link" @click="closeMenu">📋 Меню</router-link>
          <router-link v-if="isAdmin" to="/admin" class="nav-link" @click="closeMenu">🔧 Админка</router-link>
          <router-link to="/booking" class="nav-link" @click="closeMenu">📁 Бронирование</router-link>
          <router-link to="/reviews" class="nav-link" @click="closeMenu">📌 Отзывы</router-link>
          <router-link to="/chat" class="nav-link" @click="closeMenu">💬 Чат</router-link>
          <router-link v-if="isAdmin" to="/admin-chat" class="nav-link" @click="closeMenu">🛠️ Ответы</router-link>
          <router-link to="/admin-login" class="nav-link" @click="closeMenu">🛠️Вход Администратора</router-link>
          <!-- <button v-if="isAdmin" @click="logoutAdmin">🚪 Выйти</button> -->
           <!-- Корзина с дропдауном -->
        <div class="cart-wrapper" @mouseenter="showCart = true" @mouseleave="showCart = false">
          <router-link to="/cart" class="nav-link">🛒 Корзина <span v-if="cartCount">({{ cartCount }})</span> </router-link>
          <div class="mini-cart" v-if="showCart && cart.length">
            <div v-for="(item, index) in cart" :key="index" class="mini-cart-item">
              <img :src="item.image" alt="" />
              <div>
                <strong>{{ item.name }}</strong><br />
                <span>{{ item.price }} ₽</span>
              </div>
            </div>
            <router-link to="/cart" class="view-cart-link">Перейти в корзину</router-link>
            </div>
            </div>
        
      </nav>
      </div>
    </header>

    <main class="app-main">
      <router-view />
    </main>
    <ToastContainer />

    <footer class="app-footer">
      <p>© 2025 Ресторан Vue. Все права защищены.</p>
    </footer>
  </div>
</template>

<script>
  import ToastContainer from './components/ToastContainer.vue'
  import { mapGetters,mapMutations } from 'vuex'
export default {
  name: 'App',
  components :{
    ToastContainer
  },
    data() {
    return {
      isMenuOpen: false,
      showCart: false
    }
  },
  methods: {
    ...mapMutations(['logoutAdmin']),
  closeMenu() {
    this.isMenuOpen = false
  }
  },
   computed: {
    ...mapGetters(['isAdmin','cartCount']),
     cart() {
      return this.$store.state.cart
    }
  },
  
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body, #app {
  height: 100%;
}

#app {
  display: flex;
  flex-direction: column;
  background: url('/bg-restaurant.jpg') center/cover no-repeat;
}

.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background-color: #ff6347;
  padding: 15px 30px;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: bold;
  transition: opacity 0.3s;
}

.nav-link:hover {
  opacity: 0.7;
  
}

.app-main {
  flex: 1;
  
}

.app-footer {
  background-color: #222;
  color: #ccc;
  text-align: center;
  padding: 15px;
}
.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.burger {
  display: none;
  font-size: 28px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

@media (max-width: 768px) {
  .burger {
    display: block;
  }

  .nav {
    position: absolute;
    top: 65px;
    right: 20px;
    background-color: #ff6347;
    flex-direction: column;
    gap: 15px;
    padding: 20px;
    border-radius: 8px;
    display: none;
  }

  .nav.open {
    display: flex;
  }
}
.cart-wrapper {
  position: relative;
  
}

.mini-cart {
  position: absolute;
  top: 100%;
  right: 0;
  width: 280px;
  background: white;
  color: black;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  padding: 10px;
}

.mini-cart-item {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
}

.mini-cart-item img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}

.view-cart-link {
  display: block;
  margin-top: 10px;
  text-align: center;
  font-weight: bold;
  color: #ff6347;
  text-decoration: none;
}
</style>


