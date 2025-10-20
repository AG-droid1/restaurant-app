<template>
  <div class="booking-page">
    <div class="booking-content">
      <div class="booking-form">
        <h2>Забронировать столик</h2>
        <form @submit.prevent="handleBooking">
          <input v-model="form.name" type="text" placeholder="Ваше имя" required />
          <input v-model="form.phone" type="tel" placeholder="Телефон" required />
          <input v-model="form.date" type="date" required />
          <input v-model="form.time" type="time" required />
          <input v-model.number="form.guests" type="number" placeholder="Гостей" required />
          <button type="submit">Забронировать</button>
        </form>
      </div>

      <div class="table-selector">
        <h3>Выберите столик ({{ tables.length }} столов):</h3>
        <div class="circular-layout">
          <div
            v-for="(table, index) in tables"
            :key="table"
            :class="['table-circle', { selected: form.table === table, taken: isTableTaken(table) }]"
            :style="getTableStyle(index)"
            @click="!isTableTaken(table) && (form.table = table)"
          >
            {{ table }}
          </div>
        </div>
        <p class="legend">
            <span class="legend-item available">Доступен</span>
            <span class="legend-item selected-item">Выбран</span>
            <span class="legend-item taken-item">Занят</span>
        </p>
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
        guests: 1, 
        table: null
      },
      tables: Array.from({ length: 28 }, (_, i) => i + 1), 
      radius: 200 
    }
  },
  methods: {
    // ...mapMutations(['addBooking']), 
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
      
      if (this.isTableTaken(this.form.table)) {
         alert('Извините, этот столик только что был занят. Выберите другой.')
         return
      }
      
      const newBooking = { ...this.form }
      this.addBooking(newBooking)
      this.resetForm()
    },
    getTableStyle(index) {
      
      const angle = (index / this.tables.length) * 2 * Math.PI // Вычисляем угол в радианах
      const x = this.radius * Math.cos(angle) // Позиция X
      const y = this.radius * Math.sin(angle) // Позиция Y

      return {
        transform: `translate(${x}px, ${y}px) translate(-50%, -50%)` // Смещаем столик относительно центра
      }
    }
  },
  computed: {
    ...mapState(['bookings'])
  }
}
</script>

<style scoped>
.booking-page {
  background: url('/bg-restaurant.jpg') center/cover no-repeat;
  background-size: cover;
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
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.booking-form {
  flex: 1;
}

.table-selector {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}


.circular-layout {
  position: relative;
  width: 400px; 
  height: 400px; 
  margin: 40px 0; 

  border: 4px dashed #ffcc00; 
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  font-weight: bold;
}

.circular-layout::before {
    content: "Центр зала";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.1em;
    color: #ff6347;
}

.table-circle {
  position: absolute; 
  top: 50%; 
  left: 50%; 
  /* transform: translate(-50%, -50%);  */
  
  width: 50px;
  height: 50px;
  border: 2px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%; 
  background-color: #f9f9f9;
  transition: all 0.3s ease;
  font-size: 0.85em;
  font-weight: bold;
}

.table-circle.selected {
  background-color: #4caf50;
  color: white;
  border-color: #388e3c;
 
  transform: scale(1.1); 
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.8);
}

.table-circle.taken {
  background-color: #ccc;
  cursor: not-allowed;
  color: #666;
  border-color: #f00b0b;
  opacity: 0.7;
}

.table-circle:not(.taken):hover {
    cursor: pointer;
    transform: scale(1.1); 
    box-shadow: 0 0 10px rgba(255, 107, 86, 0.7); 
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
  background: #ff6347; 
  color: white;
  cursor: pointer;
  transition: background 0.3s;
  font-weight: bold;
}

.booking-form button:hover {
  background: #e5533d;
}

.bookings-list {
    margin-top: 30px;
    padding: 20px;
    max-width: 1100px;
    margin-left: auto;
    margin-right: auto;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 12px;
}
.bookings-list ul {
    list-style: disc;
    padding-left: 20px;
}


.legend {
    margin-top: 20px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #fff;
    font-size: 0.9em;
}

.legend-item {
    margin-right: 15px;
    padding-left: 20px;
    position: relative;
}

.legend-item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
}

.available::before {
    background-color: #f9f9f9;
    border: 2px solid #ccc;
}

.selected-item::before {
    background-color: #4caf50;
    border: 2px solid #388e3c;
}

.taken-item::before {
    background-color: #ccc;
    border: 2px solid #f00b0b;
}


@media (max-width: 768px) {
  .booking-content {
    flex-direction: column;
  }
  .table-selector {
    padding-top: 20px;
  }
  .circular-layout {
    width: 300px; 
    height: 300px;
    margin: 20px auto;
  }
  
}
</style>

  
  