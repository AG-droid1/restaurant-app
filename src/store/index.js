import { createStore } from 'vuex';
import axios from 'axios';
const API_BASE_URL = 'http://localhost:3000';
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token'); // Получаем токен из localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Добавляем токен в заголовок Authorization
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default createStore({
  state: {
    menuItems:[],
    bookings: JSON.parse(localStorage.getItem('bookings')) || [],
    reviews: JSON.parse(localStorage.getItem('reviews')) || [],
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    chatMessages: JSON.parse(localStorage.getItem('chatMessages')) || [],
    isAdmin: JSON.parse(localStorage.getItem('isAdmin')) || false,
    jwt_token: localStorage.getItem('jwt_token') || null, 
  },
  mutations: {
    // меню блюда
     // Новая мутация для установки всего массива меню
    setMenuItems(state, items) {
      state.menuItems = items;
      
    },


    // addMenuItem(state, item) {
    //   state.menuItems.push(item)
    //   localStorage.setItem('menuItems', JSON.stringify(state.menuItems))
    // },


    addMenuItem(state, item) {
      state.menuItems.push(item);
    },

     updateMenuItem(state, updatedItem) {
            const index = state.menuItems.findIndex(i => i.id === updatedItem.id);
            if (index !== -1) {
                state.menuItems.splice(index, 1, updatedItem);
                // localStorage.setItem('menuItems', JSON.stringify(state.menuItems)); 
            }
        },
    
    deleteMenuItem(state, id) {
            state.menuItems = state.menuItems.filter(i => i.id !== id);
            // localStorage.setItem('menuItems', JSON.stringify(state.menuItems)); 
        },
     // бронирования
  addBooking(state, booking) {
    state.bookings.push(booking)
    localStorage.setItem('bookings', JSON.stringify(state.bookings))
  },
  deleteBooking(state, index) {
    state.bookings.splice(index, 1)
    localStorage.setItem('bookings', JSON.stringify(state.bookings))
  },
    //отзывы
   addReview(state, review) {
    state.reviews.push(review)
    localStorage.setItem('reviews', JSON.stringify(state.reviews))
  },
    updateReview(state, { index, updated }) {
    state.reviews.splice(index, 1, updated)
    localStorage.setItem('reviews', JSON.stringify(state.reviews))
  },
  deleteReview(state, index) {
    state.reviews.splice(index, 1)
    localStorage.setItem('reviews', JSON.stringify(state.reviews))
  },
  //Корзина
   addToCart(state, item) {
    state.cart.push(item)
    localStorage.setItem('cart', JSON.stringify(state.cart))
  },
  removeFromCart(state, index) {
    state.cart.splice(index, 1)
    localStorage.setItem('cart', JSON.stringify(state.cart))
  },
  clearCart(state) {
    state.cart = []
    localStorage.setItem('cart', JSON.stringify(state.cart))
  },
  //Чат
    addMessage(state, message) {
    state.chatMessages.push(message)
    localStorage.setItem('chatMessages', JSON.stringify(state.chatMessages))
  },
  //логин админа
  //  loginAdmin(state) {
  //   state.isAdmin = true
  //   localStorage.setItem('isAdmin', true)
  // },
  // logoutAdmin(state) {
  //   state.isAdmin = false
  //   localStorage.setItem('isAdmin', false)
  // },

   setJwtToken(state, token) {
      state.jwt_token = token;
      localStorage.setItem('jwt_token', token);
      state.isAdmin = !!token; 
      localStorage.setItem('isAdmin', !!token);
    },
    clearAuthData(state) {
      state.jwt_token = null;
      state.isAdmin = false;
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('isAdmin');
    },
  },


  actions: {
    // Асинхронное действие для загрузки меню с бэкенда
    async fetchMenuItems({ commit }) {
      try {
        const response = await axiosInstance.get('/api/menu');
        commit('setMenuItems', response.data); // Вызываем мутацию для обновления состояния
        console.log('Меню успешно загружено с бэкенда:', response.data);
      } catch (error) {
        console.error('Ошибка загрузки меню с бэкенда:', error);
        
      }
    },
    async addMenuItem({ commit }, newItem) {
      try {
        const response = await axiosInstance.post('/api/menu', newItem);
        commit('addMenuItem', response.data);
        console.log('Блюдо успешно добавлено на бэкенд:', response.data);
      } catch (error) {
        console.error('Ошибка добавления блюда на бэкенд:', error);
        alert('Не удалось добавить блюдо. Пожалуйста, попробуйте еще раз.');
      }
    },
  

   async updateMenuItem({ commit }, updatedItem) {
            try {
                // Отправляем PUT запрос на бэкенд, указывая ID в URL
                
                const response = await axiosInstance.put(`/api/menu/${updatedItem.id}`, updatedItem);
                commit('updateMenuItem', response.data); // Обновляем состояние Vuex полученными данными
                console.log('Блюдо успешно обновлено на бэкенде:', response.data);
            } catch (error) {
                console.error('Ошибка обновления блюда на бэкенде:', error);
                alert('Не удалось обновить блюдо. Пожалуйста, попробуйте еще раз.');
            }
        },

         async deleteMenuItem({ commit }, id) {
            try {
                // Отправляем DELETE запрос на бэкенд, указывая ID в URL
               await axiosInstance.delete(`/api/menu/${id}`);
                commit('deleteMenuItem', id);
                console.log('Блюдо успешно удалено с бэкенда, ID:', id);
            } catch (error) {
                console.error('Ошибка удаления блюда с бэкенда:', error);
                alert('Не удалось удалить блюдо. Пожалуйста, попробуйте еще раз.');
            }
        },


 async login({ commit, dispatch }, credentials) {
      try {
        const response = await axios.post(`${API_BASE_URL}/api/login`, credentials);
        const { token } = response.data;
        commit('setJwtToken', token); // Сохраняем токен
        await dispatch('fetchMenuItems'); // Перезагружаем меню, если нужно
        return true; // Успешный вход
      } catch (error) {
        console.error('Ошибка входа:', error.response?.data?.message || error.message);
        // Используем error.response?.data?.message для получения сообщения об ошибке с бэкенда
        alert(error.response?.data?.message || 'Ошибка входа. Проверьте учетные данные.');
        return false; // Ошибка входа
      }
    },
    
    logout({ commit }) {
      commit('clearAuthData');
      console.log('Выход выполнен. Данные аутентификации очищены.');
    }
  },


      
  
  getters: {
    menuItems: (state) => state.menuItems,
    bookings: (state) => state.bookings,
    cart: (state) => state.cart,
    cartCount: (state) => state.cart.length,
    chatMessages: (state) => state.chatMessages,
    isAdmin: (state) => state.isAdmin,
    jwtToken: (state) => state.jwt_token,
  }
})
