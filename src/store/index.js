import { createStore } from 'vuex';
import axios from 'axios';
import { io } from 'socket.io-client';
const API_BASE_URL = 'http://localhost:3000';
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


const socket = io(API_BASE_URL);

const store = createStore ({
  state: {
    menuItems:[],
    bookings: JSON.parse(localStorage.getItem('bookings')) || [],
    reviews: JSON.parse(localStorage.getItem('reviews')) || [],
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    chatMessages: [],
    isAdmin: JSON.parse(localStorage.getItem('isAdmin')) || false,
    jwt_token: localStorage.getItem('jwt_token') || null, 
  },
  mutations: {
    // меню блюда
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

  setChatMessages(state, messages) {
      state.chatMessages = messages;
    },
    addChatMessage(state, message) {
      state.chatMessages.push(message);
    },
  //   addMessage(state, message) {
  //   state.chatMessages.push(message)
  //   localStorage.setItem('chatMessages', JSON.stringify(state.chatMessages))
  // },
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
    
    async fetchMenuItems({ commit }) {
      try {
        const response = await axiosInstance.get('/api/menu');
        commit('setMenuItems', response.data); 
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
                const response = await axiosInstance.put(`/api/menu/${updatedItem.id}`, updatedItem);
                commit('updateMenuItem', response.data); 
                console.log('Блюдо успешно обновлено на бэкенде:', response.data);
            } catch (error) {
                console.error('Ошибка обновления блюда на бэкенде:', error);
                alert('Не удалось обновить блюдо. Пожалуйста, попробуйте еще раз.');
            }
        },

         async deleteMenuItem({ commit }, id) {
            try {
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
        commit('setJwtToken', token); 
        await dispatch('fetchMenuItems'); 
        return true; 
      } catch (error) {
        console.error('Ошибка входа:', error.response?.data?.message || error.message);
        alert(error.response?.data?.message || 'Ошибка входа. Проверьте учетные данные.');
        return false; 
      }
    },
    
    logout({ commit }) {
      commit('clearAuthData');
      console.log('Выход выполнен. Данные аутентификации очищены.');
    },

     async fetchChatHistory({ commit }) {
        try {
            const response = await axiosInstance.get('/api/chat/history');
            commit('setChatMessages', response.data);
            console.log('История чата загружена:', response.data.length, 'сообщений');
        } catch (error) {
            console.error('Ошибка загрузки истории чата:', error);
        }
    },
    sendChatMessage({ commit }, messageData) {
        socket.emit('sendMessage', messageData);
        
    },
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


// --- Обработчики Socket.IO событий (вне createStore) ---
// Это важно, чтобы они были зарегистрированы один раз при создании стора.
socket.on('connect', () => {
    console.log('Подключен к Socket.IO серверу!');
});

socket.on('disconnect', () => {
    console.log('Отключен от Socket.IO сервера.');
});

socket.on('connect_error', (error) => {
    console.error('Ошибка подключения Socket.IO:', error);
});

socket.on('receiveMessage', (message) => {
    console.log('Получено сообщение через Socket.IO:', message);
    store.commit('addChatMessage', message);
});

socket.on('chat history', (history) => {
    console.log('Получена история чата через Socket.IO при подключении.');
    store.commit('setChatMessages', history);
});


export default store;