<template>
  <div class="booking-container">
    <div class="booking-card">
      <h2>Забронировать столик</h2>
      
      <form @submit.prevent="handleBooking" class="styled-form">
        <div class="form-section">
          <div class="input-group">
            <label>Ваше имя</label>
            <input v-model="form.name" type="text" placeholder="Иван Иванов" required />
          </div>

          <div class="input-group">
            <label>Телефон</label>
            <input 
              v-model="form.phone" 
              type="tel" 
              placeholder="+7 (900) 000-00-00" 
              @input="formatPhone"
              required 
            />
          </div>
        </div>

        <div class="form-section row">
          <div class="input-group">
            <label>Дата</label>
            <input 
              v-model="form.date" 
              type="date" 
              :min="minDate" 
              required 
            />
          </div>

          <div class="input-group">
            <label>Время</label>
            <select v-model="form.time" required>
              <option disabled value="">Выберите время</option>
              <option v-for="t in timeSlots" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>

          <div class="input-group short">
            <label>Гости</label>
            <input v-model.number="form.guests" type="number" min="1" max="10" />
          </div>
        </div>

        <div class="table-selection">
          <label>Выберите столик на схеме: 
            <span v-if="form.table" class="selected-badge">№{{ form.table }}</span>
            <span v-else class="hint-badge">нажмите на круг</span>
          </label>
          
          <div class="hall-map">
            <div 
              v-for="(tableId, index) in tables" 
              :key="tableId"
              class="table-circle"
              :class="{ 
                'taken': isTableTaken(tableId), 
                'selected': form.table === tableId 
              }"
              :style="getTableStyle(index)"
              @click="selectTable(tableId)"
            >
              {{ tableId }}
            </div>
            <div class="center-label">СЦЕНА</div>
          </div>
        </div>

        <button type="submit" class="submit-btn" :disabled="!form.table">
          Подтвердить бронирование
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
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
      tables: Array.from({ length: 28 }, (_, i) => i + 1), // Сделаем 20 столов для красоты
      radius: 195,
      timeSlots: ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00']
    }
  },
  computed: {
    ...mapState(['bookings']),
    // Запрещаем выбирать даты в прошлом
    minDate() {
      return new Date().toISOString().split('T')[0];
    }
  },
  methods: {
    ...mapMutations(['addBooking']),
    
    selectTable(id) {
      if (this.isTableTaken(id)) return;
      this.form.table = id;
    },

    isTableTaken(tableNumber) {
      if (!this.form.date || !this.form.time) return false;
      return this.bookings.some(b => 
        b.date === this.form.date && 
        b.time === this.form.time && 
        String(b.table) === String(tableNumber)
      );
    },

    // Простая маска телефона
    formatPhone(e) {
      let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
      if (!x[2]) {
        this.form.phone = x[1];
      } else {
        this.form.phone = `+${x[1]} (${x[2]}) ${x[3]}${x[4] ? '-' + x[4] : ''}${x[5] ? '-' + x[5] : ''}`;
      }
    },

    handleBooking() {
      
      const newBooking = { ...this.form, id: Date.now() };
      this.addBooking(newBooking);
      const notification = {
        text: `📅 НОВАЯ БРОНЬ: ${newBooking.name}, стол №${newBooking.table} на ${newBooking.date} в ${newBooking.time} (${newBooking.guests} чел.)`,
        from: 'system', // Специальный тип отправителя
        timestamp: new Date().toLocaleTimeString()
  };

      this.$store.dispatch('sendChatMessage', notification);

      this.$store.dispatch('showToast', { 
    text: `Стол №${this.form.table} забронирован!`, 
    type: 'success' 
  });
      this.resetForm();
    },

    resetForm() {
      this.form = { name: '', phone: '', date: '', time: '', guests: 1, table: null };
    },

    getTableStyle(index) {
      const angle = (index / this.tables.length) * 2 * Math.PI;
      const x = this.radius * Math.cos(angle);
      const y = this.radius * Math.sin(angle);
      return {
        transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`
      }
    }
  }
}
</script>

<style scoped>
.booking-container {
  padding: 40px 20px;
  background: #fdf5e6; /* Тёплый бежевый фон */
  min-height: 100vh;
}

.booking-card {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.05);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-family: 'Playfair Display', serif;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.form-section.row {
  flex-direction: row;
}

.input-group {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.input-group label {
  font-size: 0.85rem;
  color: #888;
  margin-bottom: 5px;
  font-weight: bold;
}

.input-group input, .input-group select {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s;
}

.input-group input:focus {
  border-color: #ff6347;
  box-shadow: 0 0 0 3px rgba(255, 99, 71, 0.1);
}

.short { max-width: 80px; }

/* Карта столиков */
.table-selection {
  margin: 40px 0;
  text-align: center;
}

.hall-map {
  position: relative;
  width: 400px;
  height: 400px;
  margin: 20px auto;
  border: 2px dashed #eee;
  border-radius: 50%;
}

.center-label {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  color: #ccc;
  letter-spacing: 5px;
}

.table-circle {
  position: absolute;
  top: 50%; left: 50%;
  width: 40px;
  height: 40px;
  background: white;
  border: 2px solid #ff6347;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  font-size: 0.8rem;
  font-weight: bold;
  z-index: 2;
}

.table-circle:hover {
  transform: scale(1.2);
  background: #fff5f3;
}

.table-circle.selected {
  background: #ff6347;
  color: white;
  transform: scale(1.3);
  box-shadow: 0 5px 15px rgba(255, 99, 71, 0.4);
}

.table-circle.taken {
  background: #e0e0e0;
  border-color: #ccc;
  color: #999;
  cursor: not-allowed;
  transform: scale(0.9);
}

.submit-btn {
  width: 100%;
  padding: 15px;
  background: #ff6347;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.selected-badge {
  background: #ff6347;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  margin-left: 10px;
}

.hint-badge {
  color: #ff6347;
  font-style: italic;
  font-size: 0.8rem;
  margin-left: 10px;
}
</style>


<!-- <template>

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
    if (!this.form.date || !this.form.time) return false;
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
      const tableId = this.tables[index];
      const angle = (index / this.tables.length) * 2 * Math.PI 
      const x = this.radius * Math.cos(angle) 
      const y = this.radius * Math.sin(angle) 
      const scale = this.form.table === tableId ? 1.1 : 1;
      return {
        transform: `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${scale})` 
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
</style> -->

  
  