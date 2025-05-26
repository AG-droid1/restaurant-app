

const express = require('express'); 
const cors = require('cors');
require('dotenv').config(); // Загружаем переменные окружения из .env
const jwt = require('jsonwebtoken'); // Импортируем jsonwebtoken




const app = express();            
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('Ошибка: JWT_SECRET не определен в файле .env. Авторизация не будет работать.');
  process.exit(1); 
}



// Временное хранилище для данных меню (до подключения базы данных)
let menuItemsData = [
  { id: 1, name: 'Маргарита (Backend)', description: 'Классическая пицца.', price: 450, image: '/images/margarita.jpg' },
  { id: 2, name: 'Паста Карбонара (Backend)', description: 'Спагетти с беконом.', price: 550, image: '/images/carbonara.jpg' },
  { id: 3, name: 'Цезарь с курицей (Backend)', description: 'Салат с курицей, сухариками и пармезаном.', price: 390, image: '/images/caesar.jpg'}
  // Здесь будут добавляться новые блюда
];


// Middleware:
// 1. Включаем CORS для всех запросов. Это очень важно для взаимодействия фронтенда и бэкенда.
app.use(cors());
// 2. Включаем парсинг JSON-тел запросов. Это нужно, чтобы Express мог читать данные,
//    которые ты отправляешь с фронтенда в формате JSON (например, при отправке формы).
app.use(express.json());

// --- Маршрут для аутентификации (логина) ---
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === '1234') { 
        // Создаем JWT
        const token = jwt.sign({ username: username, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Успешный вход!', token });
    } else {
        res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
    }
});


// --- Middleware для проверки JWT ---
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (token == null) {
        return res.status(401).json({ message: 'Требуется аутентификация' }); 
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Ошибка верификации токена:', err.message);
            return res.status(403).json({ message: 'Недействительный или истекший токен' }); 
        }
        req.user = user; // Сохраняем данные пользователя из токена в объекте запроса
        next(); // Продолжаем выполнение запроса
    });
}


app.get('/', (req, res) => {
  res.send('Привет от бэкенда ресторана!'); 
});

// GET-маршрут для получения всего меню
app.get('/api/menu', (req, res) => {
  res.json(menuItemsData); // Отправляем данные из нашего временного хранилища
})

// POST-маршрут для добавления нового блюда
app.post('/api/menu', authenticateToken, (req, res) => {
  const newItem = req.body; // Получаем данные нового блюда из тела запроса
  newItem.id = menuItemsData.length > 0 ? Math.max(...menuItemsData.map(item => item.id)) + 1 : 1;
  menuItemsData.push(newItem); // Добавляем новое блюдо в наш массив
  console.log('Добавлено новое блюдо:', newItem);
  res.status(201).json(newItem); // Отправляем ответ со статусом 201 (Created) и созданным объектом
});


// PUT-маршрут для обновления существующего блюда
app.put('/api/menu/:id', authenticateToken, (req, res) => {
    const itemId = parseInt(req.params.id); // Получаем ID из URL
    const updatedItem = req.body;            // Получаем обновленные данные из тела запроса
    const index = menuItemsData.findIndex(item => item.id === itemId);

    if (index !== -1) {
        menuItemsData[index] = { ...updatedItem, id: itemId }; // Обновляем данные, сохраняя оригинальный ID
        console.log('Обновлено блюдо:', menuItemsData[index]);
        res.json(menuItemsData[index]); // Отправляем обновленный объект
    } else {
        res.status(404).send('Блюдо не найдено'); // Если блюдо с таким ID не найдено
    }
});


// DELETE-маршрут для удаления блюда
app.delete('/api/menu/:id', authenticateToken, (req, res) => {
    const itemId = parseInt(req.params.id); // Получаем ID из URL
    const initialLength = menuItemsData.length;
    menuItemsData = menuItemsData.filter(item => item.id !== itemId); // Фильтруем, удаляя нужный элемент

    if (menuItemsData.length < initialLength) {
        console.log('Удалено блюдо с ID:', itemId);
        res.status(204).send(); // Отправляем статус 204 No Content (успешно, но нет тела ответа)
    } else {
        res.status(404).send('Блюдо не найдено');
    }
});


// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`Открой в браузере: http://localhost:${PORT}`);
});