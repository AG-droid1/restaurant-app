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
  height: 100%;
  width: 100%;
  background: url('/bg-restaurant.jpg') center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  margin: 0;
  padding: 0; /* Убираем все отступы */
}


  
  
.hero {
  background-color: rgba(0, 0, 0, 0.5);
  padding: 40px;
  border-radius: 12px;
  max-width: 90vw; /* чтобы не растягивалась слишком сильно */
}

  
  .hero h1 {
    font-size: 3em;
    margin-bottom: 0.5em;
  }
  
  .hero p {
    font-size: 1.5em;
    margin-bottom: 1.5em;
  }
  
  .menu-button {
    display: inline-block;
    padding: 0.75em 1.5em;
    background-color: #ff6347;
    color: white;
    border-radius: 8px;
    text-decoration: none;
    font-weight: bold;
    transition: background-color 0.3s;
  }
  
  .menu-button:hover {
    background-color: #e5533d;
  }
  </style>
  