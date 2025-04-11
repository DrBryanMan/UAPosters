const imgpath = "https://raw.githubusercontent.com/DrBryanMan/UAPosters/main/"

// Основні елементи
const gallery = document.getElementById('gallery')
const searchInput = document.getElementById('search')
const gridViewBtn = document.getElementById('grid-view')
const listViewBtn = document.getElementById('list-view')
const loading = document.getElementById('loading')
const errorDisplay = document.getElementById('error')
const modal = document.getElementById('imageModal')
const modalImg = document.getElementById('modalImage')
const closeModal = document.querySelector('.close')
const pagination = document.getElementById('pagination')
const firstPageBtn = document.getElementById('first-page')
const prevPageBtn = document.getElementById('prev-page')
const nextPageBtn = document.getElementById('next-page')
const lastPageBtn = document.getElementById('last-page')
const pageNumbers = document.getElementById('page-numbers')
const pageInfo = document.getElementById('page-info')
const itemsPerPageSelect = document.getElementById('items-per-page')
const authorFilter = document.getElementById('author-filter')
const teamFilter = document.getElementById('team-filter')

// Зберігаємо дані про всі постери
let allPosters = []
let filteredPosters = []

// Зберігаємо унікальні автори та команди
let authors = new Set()
let teams = new Set()

// Пагінація
let currentPage = 1
let itemsPerPage = 16
let totalPages = 0

// Функція для завантаження JSON-файлу
async function loadPosterData() {
    try {
        const response = await fetch('PostersList.json')
        if (!response.ok) {
            throw new Error(`Не вдалося завантажити дані (${response.status})`)
        }
        
        const data = await response.json()
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Дані порожні або в неправильному форматі')
        }
        
        allPosters = data
        filteredPosters = [...allPosters]
        
        // Зібрати всіх авторів та команди
        collectAuthorsAndTeams()
        
        // Заповнити селекти авторів та команд
        populateFilters()
        
        updatePagination()
        renderPosters()
        
        loading.style.display = 'none'
        pagination.style.display = 'flex'
    } catch (error) {
        console.error('Помилка при завантаженні даних:', error)
        loading.style.display = 'none'
        errorDisplay.style.display = 'block'
        errorDisplay.textContent = `Помилка завантаження: ${error.message}. Перевірте, чи файл "image_list.json" знаходиться в тій же папці, що й HTML-файл.`
    }
}

// Функція для збору унікальних авторів та команд
function collectAuthorsAndTeams() {
    authors.clear()
    teams.clear()
    
    allPosters.forEach(poster => {
        if (poster.author) {
            authors.add(poster.author)
        }
        
        if (poster.team) {
            teams.add(poster.team)
        }
    })
}

// Функція для заповнення селектів фільтрів
function populateFilters() {
    // Заповнюємо фільтр авторів
    authorFilter.innerHTML = '<option value="">Усі автори</option>'
    Array.from(authors).sort().forEach(author => {
        const option = document.createElement('option')
        option.value = author
        option.textContent = author
        authorFilter.appendChild(option)
    })
    
    // Заповнюємо фільтр команд
    teamFilter.innerHTML = '<option value="">Усі команди</option>'
    Array.from(teams).sort().forEach(team => {
        const option = document.createElement('option')
        option.value = team
        option.textContent = team
        teamFilter.appendChild(option)
    })
}

// Функція для оновлення інформації про пагінацію
function updatePagination() {
    totalPages = Math.ceil(filteredPosters.length / itemsPerPage)
    
    // Коригуємо поточну сторінку, якщо вона стала більшою за загальну кількість сторінок
    if (currentPage > totalPages) {
        currentPage = totalPages > 0 ? totalPages : 1
    }
    
    // Оновлюємо стан кнопок навігації
    firstPageBtn.disabled = currentPage === 1
    prevPageBtn.disabled = currentPage === 1
    nextPageBtn.disabled = currentPage === totalPages || totalPages === 0
    lastPageBtn.disabled = currentPage === totalPages || totalPages === 0
    
    firstPageBtn.classList.toggle('disabled', currentPage === 1)
    prevPageBtn.classList.toggle('disabled', currentPage === 1)
    nextPageBtn.classList.toggle('disabled', currentPage === totalPages || totalPages === 0)
    lastPageBtn.classList.toggle('disabled', currentPage === totalPages || totalPages === 0)
    
    // Оновлюємо інформацію про сторінку
    pageInfo.textContent = `Стор. ${currentPage} з ${totalPages} (${filteredPosters.length} постерів)`
    
    // Генеруємо номери сторінок
    generatePageNumbers()
}

// Функція для генерації номерів сторінок
function generatePageNumbers() {
    pageNumbers.innerHTML = ''
    
    // Визначаємо, скільки кнопок номерів сторінок показувати
    const maxPageButtons = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2))
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1)
    
    // Коригуємо startPage, якщо не вистачає кнопок номерів сторінок
    if (endPage - startPage + 1 < maxPageButtons && startPage > 1) {
        startPage = Math.max(1, endPage - maxPageButtons + 1)
    }
    
    // Додаємо кнопки номерів сторінок
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button')
        pageBtn.className = 'pagination-btn'
        pageBtn.textContent = i;
        
        if (i === currentPage) {
            pageBtn.classList.add('active')
        }
        
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            updatePagination()
            renderPosters()
        })
        
        pageNumbers.appendChild(pageBtn)
    }
}

// Функція для відображення постерів з урахуванням пагінації
function renderPosters() {
    gallery.innerHTML = ''
    
    if (filteredPosters.length === 0) {
        const noResults = document.createElement('div')
        noResults.className = 'error'
        noResults.textContent = 'За вашим запитом нічого не знайдено'
        gallery.appendChild(noResults)
        return
    }
    
    // Вираховуємо індекси для поточної сторінки
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, filteredPosters.length)
    
    // Відображаємо постери для поточної сторінки
    for (let i = startIndex; i < endIndex; i++) {
        const poster = filteredPosters[i]
        
        const posterElement = document.createElement('div')
        posterElement.className = 'poster'
        
        const imgContainer = document.createElement('div')
        imgContainer.className = 'poster-img-container'
        
        const img = document.createElement('img')
        img.className = 'poster-img'
        img.src = imgpath + poster.path
        img.alt = poster.name
        
        // Обробка помилок завантаження зображення
        img.onerror = () => {
            img.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23f5f5f5" width="100" height="100"/%3E%3Cpath fill="%23999" d="M36 33h28v34H36z"/%3E%3Cpath fill="%23fff" d="M50 39a6 6 0 1 1 0 12 6 6 0 0 1 0-12z"/%3E%3Cpath fill="%23999" d="M58 65l-16-16v16z"/%3E%3C/svg%3E'
        }
        
        imgContainer.appendChild(img)
        
        const info = document.createElement('div')
        info.className = 'poster-info'
        
        const filename = document.createElement('h4')
        filename.textContent = poster.name
        filename.className = 'truncate'
        
        const author = document.createElement('p')
        author.className = 'poster-author'
        author.textContent = poster.author || 'Невідомий автор'
        
        // Додаємо команду, якщо вона є
        if (poster.team) {
            const team = document.createElement('p')
            team.className = 'poster-team'
            team.textContent = `Команда: ${poster.team}`
            info.appendChild(team)
        }
        
        info.appendChild(filename)
        info.appendChild(author)
        
        posterElement.appendChild(imgContainer)
        posterElement.appendChild(info)
        
        // Відкриття зображення в модальному вікні при кліку
        posterElement.addEventListener('click', () => {
            modal.classList.add('open')
            modalImg.src = imgpath + poster.path
        })
        
        gallery.appendChild(posterElement)
    }
    
    // Прокручуємо до верху галереї при зміні сторінки
    window.scrollTo({
        // top: gallery.offsetTop - 0,
        behavior: 'smooth'
    })
}

// Функція для фільтрації постерів за всіма критеріями
function filterPosters() {
    const searchTerm = searchInput.value.toLowerCase()
    const selectedAuthor = authorFilter.value
    const selectedTeam = teamFilter.value
    
    filteredPosters = allPosters.filter(poster => {
        // Фільтр за пошуковим запитом
        const matchesSearch = searchTerm === '' || 
                           poster.name.toLowerCase().includes(searchTerm) || 
                           (poster.path && poster.path.toLowerCase().includes(searchTerm))
        
        // Фільтр за автором
        const matchesAuthor = selectedAuthor === '' || 
                            poster.author === selectedAuthor
        
        // Фільтр за командою
        const matchesTeam = selectedTeam === '' || 
                          poster.team === selectedTeam
        
        return matchesSearch && matchesAuthor && matchesTeam
    })
    
    currentPage = 1 // Повертаємося до першої сторінки при фільтрації
    updatePagination()
    renderPosters()
}

// Пошук і фільтрація постерів
searchInput.addEventListener('input', filterPosters)
authorFilter.addEventListener('change', filterPosters)
teamFilter.addEventListener('change', filterPosters)

// Навігація по сторінках
firstPageBtn.addEventListener('click', () => {
    if (currentPage !== 1) {
        currentPage = 1
        updatePagination()
        renderPosters()
    }
})

prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--
        updatePagination()
        renderPosters()
    }
})

nextPageBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++
        updatePagination()
        renderPosters()
    }
})

lastPageBtn.addEventListener('click', () => {
    if (currentPage !== totalPages) {
        currentPage = totalPages
        updatePagination()
        renderPosters()
    }
})

// Зміна кількості елементів на сторінці
itemsPerPageSelect.addEventListener('change', () => {
    itemsPerPage = parseInt(itemsPerPageSelect.value)
    currentPage = 1 // Повертаємося до першої сторінки при зміні кількості елементів
    updatePagination()
    renderPosters()
})

// Перемикання режимів відображення
gridViewBtn.addEventListener('click', () => {
    gallery.classList.remove('list-view')
    gridViewBtn.classList.add('active')
    listViewBtn.classList.remove('active')
})

listViewBtn.addEventListener('click', () => {
    gallery.classList.add('list-view')
    listViewBtn.classList.add('active')
    gridViewBtn.classList.remove('active')
})

// Закриття модального вікна
closeModal.addEventListener('click', () => {
    modal.classList.remove('open')
})

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('open')
    }
})

// Закриття модального вікна по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
        modal.classList.remove('open')
    }
})

// Завантажуємо дані при завантаженні сторінки
window.addEventListener('DOMContentLoaded', loadPosterData)
