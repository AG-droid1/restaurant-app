<template>
    <div class="menu-page">
      <h1>Меню</h1>
      <div class="menu-list">
        <div v-for="item in menuItems" :key="item.id" class="menu-card">
          <img :src="item.image" :alt="item.name" />
          <h2>{{ item.name }}</h2>
          <p>{{ item.description }}</p>
          <span>{{ item.price }} ₽</span>
          <button @click="addToCart(item)">🛒 Добавить в корзину</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import {mapState} from 'vuex'
  import { mapMutations } from 'vuex'
  export default {
    name: 'MenuPage',
    // data() {
    //   return {
    //     menuItems: [
    //       {
    //         id: 1,
    //         name: 'Маргарита',
    //         description: 'Классическая пицца с томатами и сыром моцарелла.',
    //         price: 450,
    //         image: '/images/margarita.jpg'
    //       },
    //       {
    //         id: 2,
    //         name: 'Паста Карбонара',
    //         description: 'Спагетти с беконом в сливочном соусе.',
    //         price: 550,
    //         image: '/images/carbonara.jpg'
    //       },
    //       {
    //         id: 3,
    //         name: 'Цезарь с курицей',
    //         description: 'Салат с курицей, сухариками и пармезаном.',
    //         price: 390,
    //         image: '/images/caesar.jpg'
    //       }
    //     ]
    //   }
    // },
    computed: {
    ...mapState(['menuItems'])
  },
  methods: {
  ...mapMutations(['addToCart']),
}
  }
  </script>
  
  <style scoped>
  .menu-page {
    padding: 40px;
    text-align: center;
  }
  
  .menu-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 30px;
    margin-top: 30px;
  }
  
  .menu-card {
    width: 250px;
    background-color: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    padding: 15px;
    text-align: center;
  }
  
  .menu-card img {
    width: 100%;
    height: 160px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 10px;
  }
  
  .menu-card h2 {
    font-size: 1.2em;
    margin-bottom: 8px;
  }
  
  .menu-card p {
    font-size: 0.95em;
    color: #666;
    margin-bottom: 10px;
  }
  
  .menu-card span {
    font-weight: bold;
    color: #ff6347;
    font-size: 1.1em;
  }
  </style>
  