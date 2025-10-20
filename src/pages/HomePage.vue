<template>
  <div class="home-page">
    <section class="hero">
      <h1>Добро пожаловать в наш ресторан!</h1>
      <p>Лучшие блюда и уютная атмосфера ждут вас.</p>
      <router-link to="/menu" class="menu-button">Посмотреть меню</router-link>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>

<style scoped>
.home-page {
  
  min-height: 100%;
  width: 100%;
  
 
  background: url('/bg-restaurant.jpg') center/cover no-repeat;
  
 
  position: relative;
  overflow: hidden; 
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  color: white; 
  text-align: center;
  
  margin: 0;
  padding: 20px;
  box-sizing: border-box; 
}


.home-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4); 
  
}

.hero {
  
  padding: 40px;
  border-radius: 12px;
  max-width: 90vw;
  z-index: 2; 
  position: relative; 
}

.hero h1 {
  font-size: 3.5em; 
  margin-bottom: 0.4em;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7); 
}

.hero p {
  font-size: 1.6em;
  margin-bottom: 2em; 
  line-height: 1.4; 
}

.menu-button {
  display: inline-block;
  padding: 1em 2em; 
  background-color: #ff6347; 
  color: white;
  border-radius: 50px; 
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1em; 
  transition: background-color 0.3s ease, transform 0.2s ease; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); 
}

.menu-button:hover {
  background-color: #e5533d; 
  transform: translateY(-2px); 
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
}


@media (max-width: 768px) {
  .hero h1 {
    font-size: 2.5em;
  }
  .hero p {
    font-size: 1.2em;
  }
  .menu-button {
    padding: 0.8em 1.6em;
    font-size: 1em;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 20px;
  }
  .hero h1 {
    font-size: 1.8em;
  }
  .hero p {
    font-size: 1em;
  }
}
</style>
  