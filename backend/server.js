

const express = require('express'); 
const cors = require('cors');
require('dotenv').config(); // Загружаем переменные окружения из .env
const jwt = require('jsonwebtoken'); 
const mongoose = require('mongoose');
const { createServer } = require('http'); // Импортируем для создания HTTP сервера
const { Server } = require('socket.io'); // Импортируем Socket.IO Server





const app = express();
const server = createServer(app); // Создаем HTTP сервер из Express приложения
const io = new Server(server, { // Инициализируем Socket.IO
    cors: {
        origin: "http://localhost:5173", // Разрешаем CORS для твоего фронтенда
        methods: ["GET", "POST"]
    }
});
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;

if (!JWT_SECRET) {
  console.error('Ошибка: JWT_SECRET не определен в файле .env. Авторизация не будет работать.');
  process.exit(1); 
}
if (!MONGO_URI) {
  console.error('Ошибка: MONGO_URI не определен в файле .env. База данных не будет подключена.');
  process.exit(1);
}

// --- Подключение к MongoDB ---
mongoose.connect(MONGO_URI)
  .then(() => console.log('Подключение к MongoDB успешно!'))
  .catch(err => {
    console.error('Ошибка подключения к MongoDB:', err);
    process.exit(1); // Завершаем процесс, если не удалось подключиться
  });

// --- Определение схемы блюда для меню ---
const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }
});

// Создание модели на основе схемы
const MenuItem = mongoose.model('MenuItem', menuItemSchema);


const chatMessageSchema = new mongoose.Schema({
    text: { type: String, required: true },
    from: { type: String, required: true }, // 'user' или 'admin'
    timestamp: { type: Date, default: Date.now } // Время отправки сообщения
});
const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);



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
app.get('/api/menu', async (req, res) => {
    try {
        const items = await MenuItem.find(); // Получаем все блюда из БД
        res.json(items);
    } catch (error) {
        console.error('Ошибка при получении меню:', error);
        res.status(500).json({ message: 'Ошибка сервера при получении меню' });
    }
});

// POST-маршрут для добавления нового блюда
app.post('/api/menu', authenticateToken, async (req, res) => {
    try {
        const newItem = new MenuItem(req.body); // Создаем новый документ на основе пришедших данных
        await newItem.save(); // Сохраняем его в БД
        console.log('Добавлено новое блюдо в БД:', newItem);
        res.status(201).json(newItem);
    } catch (error) {
        console.error('Ошибка при добавлении блюда:', error);
        res.status(400).json({ message: 'Ошибка при добавлении блюда', error: error.message });
    }
});


// PUT-маршрут для обновления существующего блюда
app.put('/api/menu/:id', authenticateToken, async (req, res) => {
    try {
        const itemId = req.params.id; // ID теперь будет строкой (ObjectId из MongoDB)
        const updatedItem = req.body;
        // findByIdAndUpdate находит по ID и обновляет. new: true возвращает обновленный документ.
        const item = await MenuItem.findByIdAndUpdate(itemId, updatedItem, { new: true });

        if (item) {
            console.log('Обновлено блюдо в БД:', item);
            res.json(item);
        } else {
            res.status(404).send('Блюдо не найдено');
        }
    } catch (error) {
        console.error('Ошибка при обновлении блюда:', error);
        res.status(500).json({ message: 'Ошибка сервера при обновлении блюда' });
    }
});


// DELETE-маршрут для удаления блюда
app.delete('/api/menu/:id', authenticateToken, async (req, res) => {
    try {
        const itemId = req.params.id; // ID будет строкой (ObjectId)
        const result = await MenuItem.findByIdAndDelete(itemId); // Находит и удаляет по ID

        if (result) {
            console.log('Удалено блюдо из БД, ID:', itemId);
            res.status(204).send(); // 204 No Content - успешно удалено, нет тела ответа
        } else {
            res.status(404).send('Блюдо не найдено');
        }
    } catch (error) {
        console.error('Ошибка при удалении блюда:', error);
        res.status(500).json({ message: 'Ошибка сервера при удалении блюда' });
    }
});


// --- НОВЫЕ МАРШРУТЫ ДЛЯ ИСТОРИИ ЧАТА (REST API) ---
app.get('/api/chat/history', async (req, res) => {
    try {
        const messages = await ChatMessage.find().sort({ timestamp: 1 }); // Сортируем по времени
        res.json(messages);
    } catch (error) {
        console.error('Ошибка при получении истории чата:', error);
        res.status(500).json({ message: 'Ошибка сервера при получении истории чата' });
    }
});

// --- Socket.IO логика ---
io.on('connection', (socket) => {
    console.log('Новое подключение Socket.IO:', socket.id);

    // Отправляем текущую историю чата новому подключению
    ChatMessage.find().sort({ timestamp: 1 })
        .then(messages => {
            socket.emit('chat history', messages);
        })
        .catch(err => console.error('Ошибка при загрузке истории чата для нового сокета:', err));

    // Обработка сообщения от клиента (пользователя или админа)
    socket.on('sendMessage', async (msg) => {
        console.log('Получено сообщение:', msg);
        try {
            // Создаем и сохраняем сообщение в БД
            const newChatMessage = new ChatMessage({
                text: msg.text,
                from: msg.from // 'user' или 'admin'
            });
            await newChatMessage.save();

            // Отправляем сообщение всем подключенным клиентам
            io.emit('receiveMessage', newChatMessage);
        } catch (error) {
            console.error('Ошибка при сохранении или отправке сообщения:', error);
        }
    });

    // Обработка отключения клиента
    socket.on('disconnect', () => {
        console.log('Клиент отключился:', socket.id);
    });
});

// Запуск HTTP сервера (вместо app.listen)
server.listen(PORT, () => {
    console.log(`Сервер Express запущен на порту ${PORT}`);
    console.log(`Сервер Socket.IO запущен на порту ${PORT}`);
    console.log(`Открой в браузере: http://localhost:${PORT}`);
});