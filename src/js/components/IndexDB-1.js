export const formTablePageInit = () => {
    const addForm = document.querySelector('[data-add-form]');
    const addFormError = document.querySelector('[data-add-form-error]');
    const deleteForm = document.querySelector('[data-delete-form]');
    const deleteFormError = document.querySelector('[data-delete-form-error]');

    const filterForm = document.querySelector('[data-filter-form]');
    const refreshFilterBtn = document.querySelector('[data-refresh-filter]')

    const editForm = document.querySelector('[data-edit-form]');
    let db; // Объявляем переменную db в области видимости

    const request = indexedDB.open('MyDatabase', 1);

    request.onupgradeneeded = function(event) {
        db = event.target.result;
        const objectStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('name', 'name', { unique: false });
        objectStore.createIndex('email', 'email', { unique: true });
    };

    request.onsuccess = function(event) {
        db = event.target.result;
        console.log('База данных успешно открыта:', db);

        getAllUsers(db);
    };

    request.onerror = function(event) {
        console.error('Ошибка при открытии базы данных:', event.target.error);
    };

    addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputName = addForm.querySelector('[data-add-form-name]');
        const inputEmail = addForm.querySelector('[data-add-form-email]');

        const newUser = {
            name: inputName.value,
            email: inputEmail.value
        };

        addUser(db, newUser);
    });

    deleteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputId = deleteForm.querySelector('[data-delete-form-id]');

        deleteUser(db, Number(inputId.value));
    });

    filterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputName = filterForm.querySelector('[data-filter-form-name]');

        getUsersByName(db, inputName.value);
    });

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputID = editForm.querySelector('[data-edit-form-id]');
        const inputName = editForm.querySelector('[data-edit-form-name]');
        const inputEmail = editForm.querySelector('[data-edit-form-email]');

        const newUser = {
            id: Number(inputID.value),
            name: inputName.value,
            email: inputEmail.value
        }
        updateUser(db, newUser)
        getAllUsers(db);
    });

    refreshFilterBtn.addEventListener('click', () => {
        getAllUsers(db);
    })



    async function addUser(db, user) {
        const transaction = db.transaction(['users'], 'readwrite');
        const objectStore = transaction.objectStore('users');
    
        // Превращаем запрос в промис
        const request = objectStore.add(user);
    
        try {
            // Ожидаем завершения запроса
            await new Promise((resolve, reject) => {
                request.onsuccess = (event) => {
                    resolve(event);
                };
                request.onerror = (event) => {
                    reject(event.target.error);
                };
            });
    
            // Если успешно, убираем ошибку и выводим сообщение в консоль
            addFormError.classList.remove('active');
            console.log('Пользователь добавлен:', user);
            
            // Получаем всех пользователей
            await getAllUsers(db);
        } catch (error) {
            // Если произошла ошибка, показываем её
            addFormError.classList.add('active');
            console.error('Ошибка при добавлении пользователя:', error);
        }
    }

    async function deleteUser(db, id) {
        const transaction = db.transaction(['users'], 'readwrite');
        const objectStore = transaction.objectStore('users');
    
        // Превращаем запрос в промис
        const request = objectStore.delete(id);
    
        try {
            // Ожидаем завершения запроса
            await new Promise((resolve, reject) => {
                request.onsuccess = () => resolve();
                request.onerror = (event) => reject(event.target.error);
            });
    
            // Если успешно, выводим сообщение
            console.log('Пользователь удален с ID:', id);
            deleteFormError.classList.remove('active');
            
            // Получаем всех пользователей
            await getAllUsers(db);
        } catch (error) {
            // Если произошла ошибка, показываем её
            console.error('Ошибка при удалении пользователя:', error);
            deleteFormError.classList.add('active');
        }
    }

    async function getAllUsers(db) {
        const transaction = db.transaction(['users'], 'readonly');
        const objectStore = transaction.objectStore('users');
        const request = objectStore.openCursor();
        const users = [];
    
        // Превращаем запрос в промис
        const cursorPromise = new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    users.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(users); // Когда курсор закончит обход всех записей
                }
            };
    
            request.onerror = (event) => {
                reject(event.target.error); // Отбрасываем ошибку
            };
        });
    
        try {
            await cursorPromise; // Дождаться завершения запроса
            console.log('Все пользователи:', users);
            
            const newArr = users.map(user => {
                return `
                    <div class="user-list__row">
                        <p class="user-list__row-col">ID: ${user.id}</p>
                        <p class="user-list__row-col">Имя: ${user.name}</p>
                        <p class="user-list__row-col">Почта: ${user.email}</p>
                    </div>
                `;
            });
    
            document.querySelector('[data-user-list]').innerHTML = newArr.join('');
        } catch (error) {
            console.error('Ошибка при обходе пользователей:', error);
        }
    }

    async function getUsersByName(db, name) {
        const transaction = db.transaction(['users'], 'readonly');
        const objectStore = transaction.objectStore('users');
        const index = objectStore.index('name');
    
        // Превращаем запрос в промис
        const requestPromise = new Promise((resolve, reject) => {
            const request = index.getAll(IDBKeyRange.only(name));
    
            request.onsuccess = (event) => {
                resolve(event.target.result); // Даем результат, если запрос был успешен
            };
    
            request.onerror = (event) => {
                reject(event.target.error); // Отбрасываем ошибку
            };
        });
    
        try {
            const users = await requestPromise; // Дождаться завершения запроса
            console.log(`Найдено ${users.length} пользователей с именем ${name}:`, users);
            
            const newArr = users.map(user => {
                return `
                    <div class="user-list__row">
                        <p class="user-list__row-col">ID: ${user.id}</p>
                        <p class="user-list__row-col">Имя: ${user.name}</p>
                        <p class="user-list__row-col">Почта: ${user.email}</p>
                    </div>
                `;
            });
    
            document.querySelector('[data-user-list]').innerHTML = newArr.join('');
        } catch (error) {
            console.error('Ошибка при поиске пользователей:', error);
        }
    }

    async function updateUser(db, user) {
        const transaction = db.transaction(['users'], 'readwrite');
        const objectStore = transaction.objectStore('users');
    
        // Создаем промис для обработки запроса
        const requestPromise = new Promise((resolve, reject) => {
            const request = objectStore.put(user);
    
            request.onsuccess = () => {
                resolve(user); // Разрешаем промис при успешном обновлении
            };
    
            request.onerror = (event) => {
                reject(event.target.error); // Отклоняем промис в случае ошибки
            };
        });
    
        try {
            const updatedUser = await requestPromise; // Ожидаем завершения запроса
            console.log('Пользователь обновлен:', updatedUser);
        } catch (error) {
            console.error('Ошибка при обновлении пользователя:', error);
        }
    }

    
};