<template>
    <div class="menu-page">
        
    <div class="slider">
      <!-- <div
        class="slide"
        v-for="(item, index) in featuredItems"
        :key="index"
        :class="{ active: index === currentSlide }"
      >
        <img :src="item.image" :alt="item.name" />
        
        <div class="slide-info">
          <h3>{{ item.name }}</h3>
          <p>{{ item.description }}</p>
        </div>
      </div> -->
      <div class="slide" v-for="(item, index) in featuredItems" :key="index" :class="{ active: index === currentSlide }">
  <img :src="item.image" :alt="item.name" />
  <div class="slide-info">
    <h3>{{ item.name }}</h3>
    <p>{{ item.description }}</p>
  </div>
</div>
      

      <button class="prev" @click="prevSlide">‹</button>
      <button class="next" @click="nextSlide">›</button>
    </div>
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
    data() {
    return {
      currentSlide: 0,
      featuredItems: [
        {
          name: 'Маргарита',
          description: 'Классическая пицца с томатами и сыром моцарелла.',
          image: '/images/margarita.jpg'
        },
        {
          name: 'Паста Карбонара',
          description: 'Спагетти с беконом в сливочном соусе.',
          image: '/images/carbonara.jpg'
        },
        {
          name: 'Цезарь с курицей',
          description: 'Салат с курицей, сухариками и пармезаном.',
          image: '/images/caesar.jpg'
        }
      ]
    }
  },
  mounted() {
    this.autoSlide = setInterval(this.nextSlide, 5000)
  },
  beforeUnmount() {
    clearInterval(this.autoSlide)
  },
    computed: {
    ...mapState(['menuItems'])
  },
  methods: {
  ...mapMutations(['addToCart']),
  nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % this.featuredItems.length
    },
    prevSlide() {
      this.currentSlide =
        (this.currentSlide - 1 + this.featuredItems.length) %
        this.featuredItems.length
    }
  }

  }
  </script>
  
  <style scoped>
  .menu-page {
    padding: 40px;
    text-align: center;
    background: url('/bg-restaurant.jpg') center/cover no-repeat;
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
.slider {
  position: relative;
  max-width: 900px;
  margin: 0 auto 40px;
  border-radius: 20px; 
  overflow: hidden;   
}

.slide {
  display: none;
  position: relative; 
  border-radius: 20px;
  overflow: hidden;
}

.slide.active {
  display: block;
}

.slide img {
  width: 100%;
  height: 500px;
  display: block;
  border-radius: 0;
}

.slide-info {
  position: absolute;
  bottom: 20px;   
  left: 20px;     
  right: 20px;   
  background-color: rgba(0, 0, 0, 0.5); 
  color: white;
  padding: 15px;
  border-radius: 12px;
  text-align: left;
  
}
.slide-info h3 {
  margin: 0 0 5px;
  font-size: 1.5em;
}
.slide-info p {
  margin: 0;
  font-size: 1em;
  line-height: 1.3;
}

.prev,
.next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 24px;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.prev {
  left: 15px;
}

.next {
  right: 15px;
}
  </style>
  