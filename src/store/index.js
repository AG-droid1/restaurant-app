import { createStore } from 'vuex'


export default createStore({
  state: {
    menuItems: JSON.parse(localStorage.getItem('menuItems')) || [
    {
      id: 1,
      name: 'Маргарита',
      description: 'Классическая пицца с томатами и сыром моцарелла.',
      price: 450,
      image: '/images/margarita.jpg'
    },
    {
      id: 2,
      name: 'Паста Карбонара',
      description: 'Спагетти с беконом в сливочном соусе.',
      price: 550,
      image: '/images/carbonara.jpg'
    },
    {
      id: 3,
      name: 'Цезарь с курицей',
      description: 'Салат с курицей, сухариками и пармезаном.',
      price: 390,
      image: '/images/caesar.jpg'
    }
  
],
    bookings: JSON.parse(localStorage.getItem('bookings')) || [],
    reviews: JSON.parse(localStorage.getItem('reviews')) || [],
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    chatMessages: JSON.parse(localStorage.getItem('chatMessages')) || [],
     isAdmin: JSON.parse(localStorage.getItem('isAdmin')) || false,


  },
  mutations: {
    // меню блюда
    addMenuItem(state, item) {
      state.menuItems.push(item)
      localStorage.setItem('menuItems', JSON.stringify(state.menuItems))
    },
    updateMenuItem(state, updatedItem) {
      const index = state.menuItems.findIndex(i => i.id === updatedItem.id)
      if (index !== -1) {
        state.menuItems.splice(index, 1, updatedItem)
        localStorage.setItem('menuItems', JSON.stringify(state.menuItems))
      }
    },
    deleteMenuItem(state, id) {
      state.menuItems = state.menuItems.filter(i => i.id !== id)
      localStorage.setItem('menuItems', JSON.stringify(state.menuItems))
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
   loginAdmin(state) {
    state.isAdmin = true
    localStorage.setItem('isAdmin', true)
  },
  logoutAdmin(state) {
    state.isAdmin = false
    localStorage.setItem('isAdmin', false)
  },
},

  
  getters: {
    menuItems: (state) => state.menuItems,
    bookings: (state) => state.bookings,
    cart: (state) => state.cart,
    cartCount: (state) => state.cart.length,
    chatMessages: (state) => state.chatMessages,
    isAdmin: (state) => state.isAdmin,
  }
})
