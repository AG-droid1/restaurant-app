<template>
  <div class="admin-login">
    <h2>Вход для администратора</h2>
    <form @submit.prevent="handleLogin"> 
    <input v-model="username" type="text" placeholder="Логин" required />
    <input v-model="password" type="password" placeholder="Пароль" required />
      <button type="submit">Войти</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'AdminLogin',
  data() {
    return {
      username: '',
      password: '',
      error: ''
    }
  },
  methods: {
  //   ...mapMutations(['loginAdmin']),
  //   login() {
  //     if (this.username === 'admin' && this.password === '1234') {
  //       this.loginAdmin()
  //       this.$router.push('/admin')
  //     } else {
  //       this.error = 'Неверные данные'
  //     }
  //   }
   ...mapActions(['login']), 
    async handleLogin() { 
      this.error = ''; 
      const success = await this.login({ username: this.username, password: this.password });

      if (success) {
        this.$router.push('/admin'); 
      } else {
        this.error = 'Неверные данные для входа. Попробуйте еще раз.';
      }
    }
  }
}
  

</script>

<style scoped>
.admin-login {
  max-width: 400px;
  margin: 60px auto;
}
input {
  display: block;
  width: 100%;
  margin-bottom: 12px;
  padding: 10px;
  border: 1px solid #ddd; 
  border-radius: 5px; 
}
button {
  padding: 10px 20px;
  background: #ff6347;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
