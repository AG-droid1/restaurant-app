<template>
  <div class="admin-page">
    <header class="admin-header">
      <h1>Панель администратора</h1>
      <div class="header-right">
        <span class="status-badge">Online (WebSocket)</span>
        <button @click="logoutAdmin" class="logout-btn">Выйти</button>
      </div>
    </header>

    <section class="notifications-area">
      <div class="section-title">
        <h2>🔔 Лента событий</h2>
        <span class="count-badge">{{ systemNotifications.length }}</span>
      </div>

      <div class="notifications-list">
        <transition-group name="fade-list">
          <div 
            v-for="note in systemNotifications" 
            :key="note.originalIndex" 
            class="note-card"
          >
            <div class="note-icon">
              {{ note.text.includes('ОТЗЫВ') ? '⭐' : '📅' }}
            </div>
            <div class="note-body">
              <span class="note-time">{{ note.timestamp }}</span>
              <p>{{ note.text }}</p>
            </div>
            <button class="dismiss-btn" @click="dismissNote(note.originalIndex)" title="Скрыть">
              &times;
            </button>
          </div>
        </transition-group>
        
        <div v-if="!systemNotifications.length" class="empty-state">
          Новых уведомлений пока нет. Все спокойно! 🙌
        </div>
      </div>
    </section>

    <div class="admin-grid">
      <section class="admin-card main-content">
        <h2>{{ form.id ? '✏️ Редактировать блюдо' : '➕ Добавить блюдо' }}</h2><br>
        <form @submit.prevent="handleSubmit" class="admin-form">
          <div class="form-row">
            <input v-model="form.name" type="text" placeholder="Название блюда" required />
            <input v-model.number="form.price" type="number" placeholder="Цена" required />
          </div>
          <input v-model="form.description" type="text" placeholder="Описание" required />
          <input v-model="form.image" type="text" placeholder="Ссылка на изображение" required />
          <div class="form-actions">
            <button type="submit" class="save-btn">{{ form.id ? 'Сохранить изменения' : 'Добавить' }}</button>
            <button v-if="form.id" type="button" @click="resetForm" class="cancel-btn">Отмена</button>
          </div>
        </form>

        <h3>Текущее меню</h3>
        <div class="menu-list">
          <div v-for="item in menuItems" :key="item.id" class="menu-item-row">
            <img :src="item.image" :alt="item.name" class="mini-img" />
            <div class="item-info">
              <strong>{{ item.name }} - </strong>
              <span>{{ item.price }} ₽</span>
            </div>
            <div class="actions">
              <button @click="editItem(item)" class="icon-btn">✏️</button>
              <button @click="deleteItemFromForm(item.id)" class="icon-btn">🗑️</button>
            </div>
          </div>
        </div>
      </section>

      <aside class="side-sections">
        <section class="admin-card">
          <h2>📅 Список всех броней</h2>
          <div class="booking-list" v-if="bookings.length">
            <div v-for="(booking, index) in bookings" :key="index" class="booking-item">
              <div class="booking-info">
                <strong>{{ booking.name }}</strong>
                <p>{{ booking.date }} | {{ booking.time }}</p>
              </div>
              <button @click="removeBooking(index)" class="delete-btn">🗑️</button>
            </div>
          </div>
          <p v-else class="empty-msg">Список пуст</p>
        </section>
      </aside>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  name: 'AdminPage',
  data() {
    return {
      form: { id: null, name: '', description: '', price: '', image: '' }
    }
  },
  computed: {
    ...mapState(['menuItems', 'bookings', 'chatMessages']),
    
    // Умная лента уведомлений
    systemNotifications() {
      return this.chatMessages
        .map((msg, index) => ({ ...msg, originalIndex: index })) // Сохраняем ID сообщения
        .filter(msg => msg.from === 'system')
        .reverse(); // Новые сверху
    }
  },
  methods: {
    ...mapMutations(['deleteBooking', 'deleteChatMessage']), // Добавь deleteChatMessage в store.js!
    ...mapActions(['addMenuItem', 'fetchMenuItems', 'updateMenuItem', 'deleteMenuItem', 'logout']),

    // Удаление одного уведомления
    dismissNote(originalIndex) {
      // Вызываем мутацию для удаления сообщения из массива chatMessages
      this.$store.commit('deleteChatMessage', originalIndex);
    },

    async handleSubmit() { 
      if (this.form.id) {
        await this.updateMenuItem({ ...this.form }); 
      } else {
        await this.addMenuItem({ ...this.form }); 
      }
      this.resetForm();
    },

    editItem(item) {
      this.form = { ...item };
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    async deleteItemFromForm(id) { 
      if (confirm('Удалить блюдо из меню?')) {
        await this.deleteMenuItem(id); 
      }
    },

    resetForm() {
      this.form = { id: null, name: '', description: '', price: '', image: '' };
    },

    removeBooking(index) {
      if (confirm('Удалить эту бронь?')) {
        this.deleteBooking(index);
      }
    },
    
  async logoutAdmin() {
    this.$store.dispatch('showToast', { 
    text: 'Выходим из системы...', 
    type: 'success' 
  });
    await new Promise(resolve => setTimeout(resolve, 1500));
    await this.logout(); 
    this.$router.push('/admin-login'); 
},

    // logoutAdmin() {
    //   this.logout(); 
    //   this.$router.push('/admin-login'); 
    // }
  },
  created() {
    this.fetchMenuItems();
  }
}
</script>

<style scoped>
.admin-page { padding: 30px; background: #f0f2f5; min-height: 100vh; font-family: 'Inter', sans-serif; }

/* Шапка */
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: white;
  padding: 15px 25px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}
.status-badge { color: #28a745; font-size: 0.8rem; font-weight: bold; margin-right: 15px; }

/* Уведомления */
.notifications-area { margin-bottom: 30px; }
.section-title { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; }
.count-badge { background: #ff6347; color: white; padding: 2px 10px; border-radius: 10px; font-size: 0.9rem; }

.note-card {
  background: white;
  border-left: 5px solid #ffc107;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
  box-shadow: 0 2px 4px rgba(0,0,0,0.03);
}

.dismiss-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: #ccc;
  transition: color 0.2s;
}
.dismiss-btn:hover { color: #ff6347; }

.note-time { font-size: 0.7rem; color: #888; }
.note-icon { font-size: 1.5rem; }

/* Сетка */
.admin-grid { display: grid; grid-template-columns: 1fr 350px; gap: 25px; }
.admin-card { background: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.04); }

/* Форма */
.form-row { display: flex; gap: 10px; }
.admin-form { display: flex; flex-direction: column; gap: 12px; margin-bottom: 30px; }
.admin-form input { padding: 12px; border: 1px solid #eee; border-radius: 10px; background: #fafafa; }
.save-btn { background: #007bff; color: white; border: none; padding: 12px; border-radius: 10px; cursor: pointer; font-weight: bold; }

/* Меню */
.menu-item-row { display: flex; align-items: center; gap: 15px; padding: 12px 0; border-bottom: 1px solid #f5f5f5; }
.mini-img { width: 45px; height: 45px; border-radius: 8px; object-fit: cover; }
.item-info { flex: 1; }
.icon-btn { background: none; border: none; cursor: pointer; font-size: 1.2rem; }

/* Список броней */
.booking-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 8px;
}
.booking-info p { margin: 0; font-size: 0.85rem; color: #666; }

/* Анимации */
.fade-list-enter-active, .fade-list-leave-active { transition: all 0.3s ease; }
.fade-list-enter-from, .fade-list-leave-to { opacity: 0; transform: translateX(30px); }

.logout-btn { background: #6c757d; color: white; border: none; padding: 8px 15px; border-radius: 8px; cursor: pointer; }
.empty-state { text-align: center; color: #aaa; padding: 20px; border: 2px dashed #eee; border-radius: 15px; }
</style>