const imgpath = "https://raw.githubusercontent.com/DrBryanMan/UAPosters/main/"
const AnimeTitlesDB = "https://raw.githubusercontent.com/DrBryanMan/CPRcatalog/main/json/AnimeTitlesDB.json"
const imgblack = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23f5f5f5" width="100" height="100"/%3E%3Cpath fill="%23999" d="M36 33h28v34H36z"/%3E%3Cpath fill="%23fff" d="M50 39a6 6 0 1 1 0 12 6 6 0 0 1 0-12z"/%3E%3Cpath fill="%23999" d="M58 65l-16-16v16z"/%3E%3C/svg%3E'

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
let matchingOnlyCheckbox = null
let toggleSwitch = null

// Зберігаємо дані про всі аніме та постери
let allAnime = []
let allPosters = []
let filteredAnime = []

// Зберігаємо унікальні автори та команди
let authors = new Set()
let teams = new Set()

// Пагінація
let currentPage = 1
let itemsPerPage = 16
let totalPages = 0

// Функція для створення і додавання стилізованого перемикача
function createMatchingOnlyFilter() {
    const filtersContainer = document.querySelector('.filters')
    
    const toggleContainer = document.createElement('div')
    toggleContainer.className = 'toggle-switch-container'
    
    // Створюємо скритий чекбокс
    matchingOnlyCheckbox = document.createElement('input')
    matchingOnlyCheckbox.type = 'checkbox'
    matchingOnlyCheckbox.id = 'matching-only'
    matchingOnlyCheckbox.className = 'toggle-checkbox'
    matchingOnlyCheckbox.checked = true // Увімкнено за замовчуванням
    
    // Створюємо лейбл для стилізованого перемикача
    const toggleLabel = document.createElement('label')
    toggleLabel.htmlFor = 'matching-only'
    toggleLabel.className = 'toggle-label'
    
    // Створюємо елемент перемикача
    toggleSwitch = document.createElement('span')
    toggleSwitch.className = 'toggle-switch'
    
    // Текст лейбла
    const toggleText = document.createElement('span')
    toggleText.className = 'toggle-text'
    toggleText.textContent = 'З постерами'
    
    // Збираємо перемикач
    toggleLabel.appendChild(toggleText)
    toggleLabel.appendChild(toggleSwitch)
    toggleContainer.appendChild(matchingOnlyCheckbox)
    toggleContainer.appendChild(toggleLabel)
    
    filtersContainer.prepend(toggleContainer)
    
    matchingOnlyCheckbox.addEventListener('change', filterAnime)
}

// Функція для завантаження даних
async function loadData() {
    try {
<<<<<<< HEAD
        const response = await fetch('PostersList.json')
        if (!response.ok) {
            throw new Error(`Не вдалося завантажити дані (${response.status})`)
=======
        loading.style.display = 'block'
        errorDisplay.style.display = 'none'
        
        // Завантажуємо список аніме з віддаленого репозиторію
        const animeResponse = await fetch(AnimeTitlesDB)
        if (!animeResponse.ok) {
            throw new Error(`Не вдалося завантажити список аніме (${animeResponse.status})`)
>>>>>>> da509be (Апдейт!)
        }
        
        allAnime = await animeResponse.json()
        if (!Array.isArray(allAnime) || allAnime.length === 0) {
            throw new Error('Список аніме порожній або в неправильному форматі')
        }
        
        // Завантажуємо локальний список постерів
        const postersResponse = await fetch('PostersList.json')
        if (!postersResponse.ok) {
            throw new Error(`Не вдалося завантажити список постерів (${postersResponse.status})`)
        }
        
        allPosters = await postersResponse.json()
        if (!Array.isArray(allPosters) || allPosters.length === 0) {
            throw new Error('Список постерів порожній або в неправильному форматі')
        }
        
        // Зібрати всіх авторів та команди з локальних постерів
        collectAuthorsAndTeams()
        
        // Заповнити селекти авторів та команд
        populateFilters()
        
        // Створюємо фільтр для показу тільки збігів за hikka_url
        createMatchingOnlyFilter()
        
        // Фільтруємо та відображаємо аніме
        filterAnime()
        
        loading.style.display = 'none'
        pagination.style.display = 'flex'
    } catch (error) {
        console.error('Помилка при завантаженні даних:', error)
        loading.style.display = 'none'
        errorDisplay.style.display = 'block'
        errorDisplay.textContent = `Помилка завантаження: ${error.message}`
    }
}

// Функція для збору унікальних авторів та команд з постерів
function collectAuthorsAndTeams() {
    authors.clear()
    teams.clear()
    
    allPosters.forEach(posterItem => {
        if (posterItem.posters && Array.isArray(posterItem.posters)) {
            posterItem.posters.forEach(poster => {
                if (poster.author) {
                    authors.add(poster.author)
                }
        
                if (poster.team) {
                    teams.add(poster.team)
                }
            })
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

// Функція для фільтрації аніме за всіма критеріями
function filterAnime() {
    const searchTerm = searchInput.value.toLowerCase()
    const selectedAuthor = authorFilter.value
    const selectedTeam = teamFilter.value
    const showOnlyMatching = matchingOnlyCheckbox.checked
    
    // Створюємо мапу постерів для швидкого доступу за hikka_url
    const postersMap = new Map()
    allPosters.forEach(posterItem => {
        if (posterItem.hikka_url) {
            postersMap.set(posterItem.hikka_url, posterItem)
        }
    })
    
    filteredAnime = allAnime.filter(anime => {
        // Перевіряємо наявність постера для цього аніме
        const hasPoster = postersMap.has(anime.hikka_url)
        
        // Якщо вибрано показувати тільки збіги і немає постерів - фільтруємо
        if (showOnlyMatching && !hasPoster) {
            return false
        }
        
        // Фільтр за пошуковим запитом
        const titleMatch = anime.title && anime.title.toLowerCase().includes(searchTerm)
        const romajiMatch = anime.romaji && anime.romaji.toLowerCase().includes(searchTerm)
        
        // Пошук по синонімам
        let synonymsMatch = false
        if (anime.synonyms && Array.isArray(anime.synonyms)) {
            synonymsMatch = anime.synonyms.some(synonym => 
                synonym && synonym.toLowerCase().includes(searchTerm)
            )
        }
        
        // Пошук по hikkaSynonyms
        let hikkaSynonymsMatch = false
        if (anime.hikkaSynonyms && Array.isArray(anime.hikkaSynonyms)) {
            hikkaSynonymsMatch = anime.hikkaSynonyms.some(synonym => 
                synonym && synonym.toLowerCase().includes(searchTerm)
            )
        }
        
        // Пошук по URL
        let urlMatch = anime.hikka_url && anime.hikka_url.toLowerCase().includes(searchTerm)
        
        // Пошук по URL постерів
        let posterUrlMatch = false
        const posterItem = postersMap.get(anime.hikka_url)
        if (posterItem && posterItem.posters && Array.isArray(posterItem.posters)) {
            posterUrlMatch = posterItem.posters.some(poster => 
                poster.url && poster.url.toLowerCase().includes(searchTerm)
            )
        }
        
        const matchesSearch = searchTerm === '' || 
                           titleMatch || romajiMatch || synonymsMatch || 
                           hikkaSynonymsMatch || urlMatch || posterUrlMatch
        
        // Фільтр за автором
        let matchesAuthor = selectedAuthor === ''
        if (!matchesAuthor && hasPoster) {
            const posterItem = postersMap.get(anime.hikka_url)
            if (posterItem.posters && Array.isArray(posterItem.posters)) {
                matchesAuthor = posterItem.posters.some(poster => 
                    poster.author === selectedAuthor
                )
            }
        }
        
        // Фільтр за командою (на майбутнє, якщо додасте команди до постерів)
        const matchesTeam = selectedTeam === ''
        
        return matchesSearch && matchesAuthor && matchesTeam
    })
    
    currentPage = 1 // Повертаємося до першої сторінки при фільтрації
    updatePagination()
    renderAnime()
}

// Функція для оновлення інформації про пагінацію
function updatePagination() {
    totalPages = Math.ceil(filteredAnime.length / itemsPerPage)
    
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
    pageInfo.textContent = `Стор. ${currentPage} з ${totalPages} (${filteredAnime.length} аніме)`
    
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
            renderAnime()
        })
        
        pageNumbers.appendChild(pageBtn)
    }
}

// Функція для відображення аніме з урахуванням пагінації
function renderAnime() {
    gallery.innerHTML = ''
    
    if (filteredAnime.length === 0) {
        const noResults = document.createElement('div')
        noResults.className = 'error'
        noResults.textContent = 'За вашим запитом нічого не знайдено'
        gallery.appendChild(noResults)
        return
    }
    
    // Створюємо мапу постерів для швидкого доступу за hikka_url
    const postersMap = new Map()
    allPosters.forEach(posterItem => {
        if (posterItem.hikka_url) {
            postersMap.set(posterItem.hikka_url, posterItem)
        }
    })
    
    // Вираховуємо індекси для поточної сторінки
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, filteredAnime.length)
    
    // Відображаємо аніме для поточної сторінки
    for (let i = startIndex; i < endIndex; i++) {
        const anime = filteredAnime[i]
        
        const animeCard = document.createElement('div')
        animeCard.className = 'poster'
        
        // Перевіряємо наявність постера
        const hasPoster = postersMap.has(anime.hikka_url)
        if (!hasPoster) {
            animeCard.classList.add('no-poster') // Додаємо клас для тайтлів без постера
        }
        
        animeCard.innerHTML = `
            <div class="poster-img-container">
                <img 
                    class="poster-img"
                    src="${anime.poster || imgblack}"
                    title="${anime.title || 'Аніме без назви'}"
                >
                <span class="poster-count">
                    <i class="bi bi-image"></i> ${(postersMap.get(anime.hikka_url)?.posters?.length || 0)}
                </span>
            </div>
            <div class="poster-info">
                <h4
                    class="truncate"
                    title="${anime.title || 'Аніме без назви'}"
                >${anime.title || 'Аніме без назви'}</h4>
                <p
                    class="romaji truncate"
                    title="${anime.romaji || 'Аніме без назви'}"
                >${anime.romaji}</p>
            </div>
        `
        // const imgContainer = document.createElement('div')
        // imgContainer.className = 'poster-img-container'
        
        // const img = document.createElement('img')
        // img.className = 'poster-img'
        
        // Використовуємо постер з аніме або плейсхолдер
        // if (anime.poster) {
        //     img.src = anime.poster
        // } else {
        //     img.src = imgblack
        // }
        
        // img.alt = anime.title || 'Аніме без назви'
        
        // Обробка помилок завантаження зображення
        // img.onerror = () => {
        //     img.src = imgblack
        // }
        
        // Додаємо іконку відсутності постера для тайтлів без постерів
        const imgContainer = animeCard.querySelector('.poster-img-container')
        if (!hasPoster) {
            const noPosterIcon = document.createElement('div')
            noPosterIcon.className = 'no-poster-icon'
            noPosterIcon.innerHTML = '<i class="bi bi-image"></i>'
            imgContainer.appendChild(noPosterIcon)
        }
        // imgContainer.appendChild(img)
        
        // const info = document.createElement('div')
        // info.className = 'poster-info'
        
        // const title = document.createElement('h4')
        // title.textContent = anime.title || 'Аніме без назви'
        // title.className = 'truncate'
        
        // Додаємо оригінальну назву, якщо є
        // if (anime.romaji) {
        //     const romaji = document.createElement('p')
        //     romaji.className = 'poster-romaji'
        //     romaji.textContent = anime.romaji
        //     info.appendChild(romaji)
        // }
        
        // Додаємо автора постера, якщо є
        // const posterItem = postersMap.get(anime.hikka_url)
        // if (posterItem && posterItem.posters && posterItem.posters.length > 0) {
        //     const posterAuthor = document.createElement('p')
        //     posterAuthor.className = 'poster-author'
        //     posterAuthor.textContent = `Автор постера: ${posterItem.posters[0].author || 'Невідомий'}`
        //     info.appendChild(posterAuthor)
        // }
        
        // info.appendChild(title)
        
        // animeCard.appendChild(imgContainer)
        // animeCard.appendChild(info)
        
        // Відкриття модального вікна з деталями аніме та всіма постерами
        animeCard.onclick = () => {
            openAnimeModal(anime, postersMap.get(anime.hikka_url))
        }
        
        gallery.appendChild(animeCard)
    }
    
    // Прокручуємо до верху галереї при зміні сторінки
    // window.scrollTo({
    //     behavior: 'smooth'
    // })
}

// Функція для відкриття модального вікна з деталями аніме та всіма постерами
function openAnimeModal(anime, posterData) {
    // Очищаємо попередній вміст модального вікна
    const modalContent = document.querySelector('.modal-content-wrapper') || document.createElement('div')
    modalContent.className = 'modal-content-wrapper'
    modalContent.innerHTML = ''
    
    // Створюємо контейнер для головного постера
    const mainPosterContainer = document.createElement('div')
    mainPosterContainer.className = 'main-poster-container'
    
    // Додаємо зображення головного постера
    const mainPoster = document.createElement('img')
    mainPoster.className = 'modal-main-poster'
    mainPoster.id = 'modalImage'
    
    // Встановлюємо початковий постер
    let currentPosterUrl = anime.poster || ''
    let currentPosterFilename = 'Немає файлу'
    
    // Якщо є постери з локального списку, використовуємо перший
    if (posterData && posterData.posters && posterData.posters.length > 0) {
        currentPosterUrl = posterData.posters[0].url || anime.poster || ''
        currentPosterFilename = posterData.posters[0].url ? posterData.posters[0].url.split('/').pop() : 'Невідомий файл'
    }
    
    mainPoster.src = currentPosterUrl || 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23f5f5f5" width="100" height="100"/%3E%3Cpath fill="%23999" d="M36 33h28v34H36z"/%3E%3Cpath fill="%23fff" d="M50 39a6 6 0 1 1 0 12 6 6 0 0 1 0-12z"/%3E%3Cpath fill="%23999" d="M58 65l-16-16v16z"/%3E%3C/svg%3E'
    mainPoster.alt = anime.title || 'Аніме без назви'
    
    // Додаємо підпис з назвою файлу
    const filenameCaption = document.createElement('div')
    filenameCaption.className = 'filename-caption'
    filenameCaption.textContent = currentPosterFilename
    
    // Додаємо головний постер і підпис у контейнер
    mainPosterContainer.appendChild(mainPoster)
    mainPosterContainer.appendChild(filenameCaption)
    
    // Створюємо блок з інформацією про аніме
    const animeInfoBlock = document.createElement('div')
    animeInfoBlock.className = 'anime-info-block'
    
    // Заповнюємо інформацію про аніме
    const animeTitle = document.createElement('h2')
    animeTitle.textContent = anime.title || 'Аніме без назви'
    animeInfoBlock.appendChild(animeTitle)
    
    if (anime.romaji) {
        const animeRomaji = document.createElement('p')
        animeRomaji.className = 'anime-romaji'
        animeRomaji.textContent = anime.romaji
        animeInfoBlock.appendChild(animeRomaji)
    }
    
    // Додаємо доступну інформацію про аніме
    const animeDetails = document.createElement('div')
    animeDetails.className = 'anime-details'
    
    if (anime.format) {
        const statusInfo = document.createElement('span')
        statusInfo.innerHTML = `${anime.format}`
        animeDetails.appendChild(statusInfo)
    }
    
    if (anime.year) {
        const yearInfo = document.createElement('span')
        yearInfo.innerHTML = `${anime.year}`
        animeDetails.appendChild(yearInfo)
    }
    
    // Додаємо посилання на оригінальну сторінку, якщо є
    if (anime.hikka_url) {
        const link = document.createElement('a')
        link.href = anime.hikka_url
        link.target = '_blank'
        link.innerHTML = `<img src="https://rosset-nocpes.github.io/ua-badges/src/hikka-dark.svg" alt="">`
        animeDetails.appendChild(link)
    }
    
    animeInfoBlock.appendChild(animeDetails)
    
    // Створюємо верхню частину модального вікна (головний постер + інформація)
    const topSection = document.createElement('div')
    topSection.className = 'modal-top-section'
    topSection.appendChild(mainPosterContainer)
    topSection.appendChild(animeInfoBlock)
    
    // Створюємо галерею постерів
    const postersGallery = document.createElement('div')
    postersGallery.className = 'posters-gallery'
    
    const galleryTitle = document.createElement('h3')
    galleryTitle.textContent = 'Доступні постери:'
    postersGallery.appendChild(galleryTitle)
    
    const thumbnailsContainer = document.createElement('div')
    thumbnailsContainer.className = 'thumbnails-container'
    
    // Додаємо постери з локального списку, якщо вони є
    if (posterData && posterData.posters && posterData.posters.length > 0) {
        posterData.posters.forEach((poster, index) => {
            const thumbnail = document.createElement('div')
            thumbnail.className = 'poster-thumbnail'
            
            const thumbImg = document.createElement('img')
            thumbImg.src = poster.url || imgblack
            thumbImg.alt = `Постер ${index + 1}`

            const thumbAuthor = document.createElement('span')
            thumbAuthor.textContent = `${poster.author || poster.team}`
            
            // При кліку на мініатюру змінюємо основний постер
            thumbnail.addEventListener('click', () => {
                mainPoster.src = poster.url
                filenameCaption.textContent = poster.url ? poster.url.split('/').pop() : 'Невідомий файл'
                
                // Виділяємо активну мініатюру
                document.querySelectorAll('.poster-thumbnail').forEach(thumb => thumb.classList.remove('active'))
                thumbnail.classList.add('active')
            })
            
            // Виділяємо першу мініатюру як активну
            if (index === 0) {
                thumbnail.classList.add('active')
            }
            
            thumbnail.appendChild(thumbImg)
            thumbnail.appendChild(thumbAuthor)
            thumbnailsContainer.appendChild(thumbnail)
        })
    } else {
        const noPosters = document.createElement('p')
        noPosters.textContent = 'Нема доступних постерів у колекції.'
        thumbnailsContainer.appendChild(noPosters)
    }
    
    postersGallery.appendChild(thumbnailsContainer)
    
    // Додаємо все до контейнера модального вікна
    modalContent.appendChild(topSection)
    animeInfoBlock.appendChild(postersGallery)
    
    // Очищаємо та додаємо новий контент до модального вікна
    modal.innerHTML = ''
    
    // Додаємо кнопку закриття
    const closeBtn = document.createElement('span')
    closeBtn.className = 'close'
    closeBtn.innerHTML = '&times;'
    closeBtn.onclick = () => {
        modal.classList.remove('open')
    }
    
    modal.appendChild(closeBtn)
    modal.appendChild(modalContent)
    modal.classList.add('open')
}

// Пошук і фільтрація аніме
searchInput.addEventListener('input', filterAnime)
authorFilter.addEventListener('change', filterAnime)
teamFilter.addEventListener('change', filterAnime)

// Навігація по сторінках
firstPageBtn.onclick = () => {
    if (currentPage !== 1) {
        currentPage = 1
        updatePagination()
        renderAnime()
    }
}

prevPageBtn.onclick = () => {
    if (currentPage > 1) {
        currentPage--
        updatePagination()
        renderAnime()
    }
}

nextPageBtn.onclick = () => {
    if (currentPage < totalPages) {
        currentPage++
        updatePagination()
        renderAnime()
    }
}

lastPageBtn.onclick = () => {
    if (currentPage !== totalPages) {
        currentPage = totalPages
        updatePagination()
        renderAnime()
    }
}

// Зміна кількості елементів на сторінці
itemsPerPageSelect.onchange = () => {
    itemsPerPage = parseInt(itemsPerPageSelect.value)
    currentPage = 1 // Повертаємося до першої сторінки при зміні кількості елементів
    updatePagination()
    renderAnime()
}

// Перемикання режимів відображення
gridViewBtn.onclick = () => {
    gallery.classList.remove('list-view')
    gridViewBtn.classList.add('active')
    listViewBtn.classList.remove('active')
}

listViewBtn.onclick = () => {
    gallery.classList.add('list-view')
    listViewBtn.classList.add('active')
    gridViewBtn.classList.remove('active')
}

// Закриття модального вікна
document.onclick = (e) => {
    if (e.target === modal) {
        modal.classList.remove('open')
    }
}

// Закриття модального вікна по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
        modal.classList.remove('open')
    }
})

// Завантажуємо дані при завантаженні сторінки
<<<<<<< HEAD
window.addEventListener('DOMContentLoaded', loadPosterData)
=======
window.addEventListener('DOMContentLoaded', loadData)
>>>>>>> da509be (Апдейт!)
