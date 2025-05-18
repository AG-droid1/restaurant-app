<template>
  <div class = "booking-page">
    <div class="booking-content">
    <div class="booking-form">
      <h2>Забронировать столик</h2>
      <form @submit.prevent="handleBooking">
        <input v-model="form.name" type="text" placeholder="Ваше имя" required />
        <input v-model="form.phone" type="tel" placeholder="Телефон" required />
        <input v-model="form.date" type="date" required />
        <input v-model="form.time" type="time" required />
        <input v-model.number="form.guests" type="number"  placeholder="Гостей" required />
        <button @click="handleBooking">Забронировать</button>
      </form>
    </div>
      <div class="table-selector">
      <h3>Выберите столик:</h3><br>
      <div class="grid">
        <div
          v-for="table in tables"
          :key="table"
          :class="['table', { selected: form.table === table,taken: isTableTaken(table) }]"
            @click="!isTableTaken(table) && (form.table = table)"
        >
          {{ table }}
        </div>
      </div>
    </div>

    
  </div>
  
      <div v-if="bookings.length" class="bookings-list">
        <h3>Ваши бронирования:</h3>
        <ul>
          <li v-for="(booking, index) in bookings" :key="index">
            {{ booking.name }} — {{ booking.date }} в {{ booking.time }} на {{ booking.guests }} чел.
          </li>
        </ul>
      </div>
      </div>
    
  </template>
  
  <script>
  import { mapState, mapMutations } from 'vuex'
  export default {
    name: 'BookingPage',
    data() {
      return {
        form: {
          name: '',
          phone: '',
          date: '',
          time: '',
          guests: '',
          table: null
        },
        tables: Array.from({ length: 28 }, (_, i) => i + 1), // 1 - 25
        
      }
    },
    methods: {
      
      resetForm() {
        this.form = {
          name: '',
          phone: '',
          date: '',
          time: '',
          guests: 1,
          table: null
        }
      },
      ...mapMutations(['addBooking']),
      isTableTaken(tableNumber) {
      return this.bookings.some(
        booking =>
          booking.date === this.form.date &&
          booking.time === this.form.time &&
          booking.table === tableNumber
      )
    },
  handleBooking() {
    if (!this.form.table) {
        alert('Выберите столик')
        return
      }
    const newBooking = { ...this.form }
    this.addBooking(newBooking)
    this.resetForm()
    }
  },
  computed:{
    ...mapState(['bookings'])
  }
}
  </script>
  
  <style scoped>
   .booking-page {
  background: url('/bg-restaurant.jpg') center/cover no-repeat;
  min-height: 100vh;
  padding: 40px 20px;
}

.booking-content {
  display: flex;
  gap: 40px;
  max-width: 1100px;
  margin: auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.booking-form {
  flex: 1;
}

.table-selector {
  flex: 1;
}

.booking-form form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.booking-form input,
.booking-form button {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.booking-form button {
  background: #007bff;
  color: white;
  cursor: pointer;
  transition: background 0.3s;
}

.booking-form button:hover {
  background: #0056b3;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 12px;
}

.table {
  width: 60px;
  height: 60px;
  border: 2px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 8px;
  background-color: #f9f9f9;
  transition: background 0.3s;
}

.table.selected {
  background-color: #4caf50;
  color: white;
  border-color: #388e3c;
}

.table.taken {
  background-color: #ccc;
  cursor: not-allowed;
  color: #666;
  border-color: #f00b0b;
}

@media (max-width: 768px) {
  .booking-content {
    flex-direction: column;
  }
}

</style>

  
  