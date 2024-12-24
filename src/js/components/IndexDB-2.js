import Dexie from 'dexie';
import axios from 'axios';

export const secondTaskInit = () => {
    const form = document.querySelector('[data-product-form]');

    if (!form) return

    const mockProductsResponse = [
        {
            id: 1,
            title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
            price: 109.95,
            category: "men's clothing",
            description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
            image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
            rating: {
                rate: 3.9,
                count: 120
            }
        },
        {
            id: 2,
            title: "Mens Casual Premium Slim Fit T-Shirts",
            price: 22.3,
            category: "men's clothing",
            description: "Slim-fitting style, contrast raglan long sleeve, three-button placket.",
            image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UL640_QL65_ML3_.jpg",
            rating: {
                rate: 4.1,
                count: 259
            }
        },
        {
            id: 3,
            title: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
            price: 695,
            category: "jewelery",
            description: "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl.",
            image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
            rating: {
                rate: 4.6,
                count: 400
            }
        },
        {
            id: 4,
            title: "Solid Gold Petite Micropave Cubic Zirconia Heart Promise Ring",
            price: 9.99,
            category: "jewelery",
            description: "Beautiful ring for your loved one.",
            image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
            rating: {
                rate: 3,
                count: 400
            }
        },
        {
            id: 5,
            title: "White Gold Plated Princess",
            price: 10.99,
            category: "jewelery",
            description: "White Gold Plated Princess.",
            image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
            rating: {
                rate: 5,
                count: 400
            }
        }
    ];

    const db = new Dexie('ProductDatabase');

    db.version(1).stores({
        products: 'id, category, price' // primary key и индексы
    });


    const API_URL = 'https://fakestoreapi.com/products';

    async function fetchProducts() {
        try {
            const products = mockProductsResponse;

            // Сохранение данных в IndexedDB
            await db.products.bulkPut(products);
            return products;
        } catch (error) {
            console.error('Ошибка при получении данных из API:', error);
            throw error;
        }
    }

    async function getProducts() {
        const productsFromDB = await db.products.toArray();
        if (productsFromDB.length === 0) {
            // Если данных нет в IndexedDB, загружаем из API
            return await fetchProducts();
        }
        return productsFromDB;
    }

    let products = [];

    async function displayProducts() {
        products = await getProducts();
        const productList = document.getElementById('product-list');
    
        productList.innerHTML = ''; // Очистка списка перед отображением
    
        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.innerHTML = `
                <h3>${product.title}</h3>
                <p>Category: ${product.category}</p>
                <p>Price: $${product.price}</p>
            `;
            productList.appendChild(productItem);
        });
    }

    function filterProducts() {
        const searchInput = document.getElementById('search-input').value.toLowerCase();
        const categorySelect = document.getElementById('category-select').value;
    
        const filteredProducts = products.filter(product => {
            const matchesSearch = product.title.toLowerCase().includes(searchInput);
            const matchesCategory = categorySelect === 'all' || product.category === categorySelect;
            return matchesSearch && matchesCategory;
        });
    
        displayFilteredProducts(filteredProducts);
    }
    
    function displayFilteredProducts(filteredProducts) {
        const productList = document.getElementById('product-list');
        productList.innerHTML = '';
    
        filteredProducts.forEach(product => {
            const productItem = document.createElement('div');
            productItem.innerHTML = `
                <h3>${product.title}</h3>
                <p>Category: ${product.category}</p>
                <p>Price: $${product.price}</p>
            `;
            productList.appendChild(productItem);
        });
    }
    
    // Добавьте обработчики событий для поиска и фильтрации
    document.getElementById('search-input').addEventListener('input', filterProducts);
    document.getElementById('category-select').addEventListener('change', filterProducts);

    displayProducts();

    async function updateProducts() {
        try {
            await fetchProducts();
            alert('Данные успешно обновлены!');
            displayProducts(); // Обновите отображение
        } catch (error) {
            alert('Ошибка при обновлении данных.');
        }
    }
    
    document.getElementById('update-button').addEventListener('click', updateProducts);
}