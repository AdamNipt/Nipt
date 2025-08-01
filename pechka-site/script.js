document.addEventListener('DOMContentLoaded', function() {
    // Инициализация Supabase
    const supabaseUrl = 'https://dmtrweeyzoayddypeusr.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtdHJ3ZWV5em9heWRkeXBldXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNDc1MTcsImV4cCI6MjA2OTYyMzUxN30.0TLB7gexyu3etOxj62EVX5Y8DP3m8HOms14rYtMSwEA';
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);

    // Инициализация корзины
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Элементы интерфейса
    const cartIcon = document.getElementById('cartIcon');
    const cartCount = document.querySelector('.cart-count');
    const cartDropdown = document.getElementById('cartDropdown');
    const cartPreview = document.getElementById('cartPreview');
    const viewCartBtn = document.getElementById('viewCartBtn');
    const cartModal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const closeCart = document.getElementById('closeCart');
    const checkoutBtn = document.getElementById('checkout');
    const notificationBubble = document.getElementById('notificationBubble');
    const orderForm = document.getElementById('orderForm');
    const loginBtn = document.getElementById('loginBtn');
    const authModal = document.getElementById('authModal');
    const registerModal = document.getElementById('registerModal');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const closeAuthBtns = document.querySelectorAll('.close-auth');

    // Проверка состояния аутентификации
    async function checkAuth() {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            loginBtn.textContent = 'Мой профиль';
        }
    }

    // Обновление иконки корзины
    function updateCartIcon() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
    
    // Показать уведомление
    function showNotification() {
        notificationBubble.textContent = '+1';
        notificationBubble.classList.add('show');
        
        setTimeout(() => {
            notificationBubble.classList.remove('show');
        }, 1000);
    }
    
    // Отрисовка превью корзины
    function renderCartPreview() {
        cartPreview.innerHTML = '';
        
        if (cart.length === 0) {
            cartPreview.innerHTML = '<p>Корзина пуста</p>';
            return;
        }
        
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'preview-item';
            itemElement.innerHTML = `
                <span>${item.name} × ${item.quantity}</span>
                <span>${item.price * item.quantity} ₽</span>
            `;
            cartPreview.appendChild(itemElement);
        });
    }
    
    // Отрисовка полной корзины
    function renderCart() {
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Корзина пуста</p>';
            cartTotal.textContent = '0';
            orderForm.style.display = 'none';
            return;
        }
        
        let total = 0;
        
        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price} ₽ × ${item.quantity} = ${item.price * item.quantity} ₽</p>
                </div>
                <div class="cart-item-actions">
                    <button onclick="changeQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${index}, 1)">+</button>
                    <button onclick="removeFromCart(${index})">×</button>
                </div>
            `;
            
            cartItems.appendChild(cartItem);
        });
        
        cartTotal.textContent = total;
        orderForm.style.display = 'block';
    }
    
    // Сохранение корзины
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartIcon();
        renderCartPreview();
    }
    
    // Глобальные функции для работы с корзиной
    window.addToCart = function(name, price, button) {
        button.classList.add('added-to-cart');
        setTimeout(() => {
            button.classList.remove('added-to-cart');
        }, 500);
        
        showNotification();
        
        const existingItem = cart.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name,
                price: parseInt(price),
                quantity: 1
            });
        }
        
        saveCart();
        renderCart();
    };
    
    window.changeQuantity = function(index, change) {
        cart[index].quantity += change;
        
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        
        saveCart();
        renderCart();
    };
    
    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        saveCart();
        renderCart();
    };
    
    // Обработчики событий
    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'flex';
        renderCart();
    });
    
    viewCartBtn.addEventListener('click', () => {
        cartModal.style.display = 'flex';
        renderCart();
    });
    
    closeCart.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });
    
    checkoutBtn.addEventListener('click', () => {
        const address = document.getElementById('deliveryAddress').value;
        const name = document.getElementById('customerName').value;
        const phone = document.getElementById('customerPhone').value;
        const payment = document.querySelector('input[name="payment"]:checked').value;
        
        if (!address || !name || !phone) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }
        
        const order = {
            items: [...cart],
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            address,
            name,
            phone,
            payment,
            date: new Date().toLocaleString()
        };
        
        console.log('Заказ оформлен:', order);
        alert(`Заказ оформлен! Сумма: ${order.total} ₽\nАдрес доставки: ${address}`);
        
        cart = [];
        saveCart();
        renderCart();
        cartModal.style.display = 'none';
        
        document.getElementById('deliveryAddress').value = '';
        document.getElementById('customerName').value = '';
        document.getElementById('customerPhone').value = '';
    });

    // Обработчики авторизации
    loginBtn.addEventListener('click', async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            if (confirm('Вы хотите выйти?')) {
                await supabase.auth.signOut();
                loginBtn.textContent = 'Войти';
            }
        } else {
            authModal.style.display = 'flex';
        }
    });

    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelector('input[type="password"]').value;
        
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            
            if (error) throw error;
            
            alert('Вход выполнен!');
            authModal.style.display = 'none';
            loginBtn.textContent = 'Мой профиль';
        } catch (error) {
            alert('Ошибка входа: ' + error.message);
        }
    });

    document.getElementById('registerForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelectorAll('input[type="password"]')[0].value;
        const confirmPassword = this.querySelectorAll('input[type="password"]')[1].value;
        
        if (password !== confirmPassword) {
            alert('Пароли не совпадают!');
            return;
        }
        
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: name
                    }
                }
            });
            
            if (error) throw error;
            
            alert('Регистрация успешна! Проверьте email для подтверждения.');
            registerModal.style.display = 'none';
        } catch (error) {
            alert('Ошибка регистрации: ' + error.message);
        }
    });

    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        authModal.style.display = 'none';
        registerModal.style.display = 'flex';
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerModal.style.display = 'none';
        authModal.style.display = 'flex';
    });

    closeAuthBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            authModal.style.display = 'none';
            registerModal.style.display = 'none';
        });
    });

    // Инициализация
    checkAuth();
    updateCartIcon();
    renderCartPreview();
    
    // Плавная прокрутка
    document.querySelectorAll('.main-nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
});