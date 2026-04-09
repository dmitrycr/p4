// Глобальный массив товаров с ценами
const products = [
    { name: "Видеокарта RTX 4080",            price: 89990, category: "gpu"         },
    { name: "Процессор Core i9-13900K",        price: 59990, category: "cpu"         },
    { name: "Оперативная память DDR5 32 ГБ",  price: 12990, category: "ram"         },
    { name: "SSD NVMe Samsung 990 Pro 1 ТБ",  price:  8990, category: "storage"     },
    { name: "Материнская плата ASUS ROG Z790", price: 24990, category: "motherboard" },
    { name: "Блок питания Corsair RM850x",     price:  9990, category: "psu"        },
];

// Функция расчёта цены товара по имени
function getProductPrice(name) {
    const found = products.find(p => p.name === name);
    return found ? found.price : 0;
}

// Корзина
let cart = [];

// Функция форматирования числа как цены (с пробелами-разрядами)
const formatPrice = (price) => price.toLocaleString("ru-RU");

// Функция пересчёта и отрисовки корзины
function renderCart() {
    const cartList  = document.getElementById("cart-list");
    const cartEmpty = document.getElementById("cart-empty");
    const cartTotal = document.getElementById("cart-total");

    if (!cartList) return; // страница без корзины

    cartList.innerHTML = "";

    if (cart.length === 0) {
        cartEmpty.style.display = "block";
        cartTotal.textContent = "0";
        return;
    }

    cartEmpty.style.display = "none";

    cart.forEach((item, index) => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
            <span>${item.name}</span>
            <span class="d-flex align-items-center gap-3">
                <strong>${formatPrice(item.price)} ₽</strong>
                <button class="btn btn-outline-danger btn-sm remove-btn" data-index="${index}">✕</button>
            </span>
        `;
        cartList.appendChild(li);
    });

    // Навесить обработчики на кнопки удаления
    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const idx = Number(e.currentTarget.dataset.index);
            cart.splice(idx, 1);
            renderCart();
        });
    });

    // Подсчёт итога
    const total = calculateTotal();
    cartTotal.textContent = formatPrice(total);
}

// Функция расчёта суммы корзины (стрелочная)
const calculateTotal = () => cart.reduce((sum, item) => sum + item.price, 0);

// Добавление товара в корзину
const addToCart = (name, price) => {
    cart.push({ name, price });
    renderCart();
};

// Инициализация кнопок «В корзину»
function initAddToCartButtons() {
    const buttons = document.querySelectorAll(".add-to-cart");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const name  = btn.dataset.name;
            const price = Number(btn.dataset.price);
            addToCart(name, price);
        });
    });
}

// Кнопка «Оплатить»
function initPayButton() {
    const payBtn = document.getElementById("pay-btn");
    if (!payBtn) return;

    payBtn.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Корзина пуста! Добавьте товары перед оплатой.");
            return;
        }
        const total = calculateTotal();
        alert(`Оплата прошла успешно!\nСумма: ${formatPrice(total)} ₽\nСпасибо за покупку!`);
        cart = [];
        renderCart();
    });
}

// Фильтрация товаров по категории (стрелочная функция)
const filterProducts = (category) => {
    const cards = document.querySelectorAll(".product-card");
    cards.forEach(card => {
        const match = category === "all" || card.dataset.category === category;
        card.style.display = match ? "" : "none";
    });
};

// Инициализация кнопок фильтра
function initFilterButtons() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Переключение активного класса
            filterButtons.forEach(b => {
                b.classList.remove("active", "btn-primary");
                b.classList.add("btn-outline-primary");
            });
            btn.classList.add("active", "btn-primary");
            btn.classList.remove("btn-outline-primary");

            filterProducts(btn.dataset.category);
        });
    });
}

// Запуск после загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
    initAddToCartButtons();
    initPayButton();
    initFilterButtons();
    renderCart();
});
