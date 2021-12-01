window.onload = (event) => {
    startTime()
    getNewImage()
    sayGreeting()
    showNewQuote()
}

// clock function 24 hr format
const startTime = () => {
    const today = new Date()
    let h = today.getHours()
    let m = today.getMinutes()
    // let s = today.getSeconds()
    
    m = checkTime(m)
    // s = checkTime(s)
    document.querySelector('#clock').innerHTML = `${h}:${m}`
    
    setTimeout(startTime, 1000)
}

// to convert single digit to double digits
const checkTime = (i) => {
    let time = i
    time < 10 ? time = "0" + time : time
    return time
}


// random background using unsplash API

const newBGButton = document.querySelector('.refresh-bg')
const getNewImage = () => {
    // const orientation = "landscape"
    const collection = "82334637"
    fetch(`https://api.unsplash.com/photos/random?client_id=4KJCFtxN8APDHQrKfxJ_kgaAacHwcyRZ8TtJPbdzzzY&collections=${collection}`)
        .then(response => response.json())
        .then(data => {
            document.body.style.backgroundImage = `url(${data.urls.full})`
    })
}

//

// obtaining geolocation to be passsed to the weather API
// free API from scrimba.com

const success = (position) => {
    if (position) {
        fetch(`https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw Error("Error fetching weather data")
            }
            return response.json()
        })
        .then(response => {
            const iconUrl = `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`
            document.querySelector('#weather').innerHTML = `
            <div id="weather-elements">
            <img src=${iconUrl} />
            <p class="weather-temp">${Math.round(response.main.temp)}ºC</p>
            </div>
            <a href="https://openweathermap.org/" target="_blank">${response.name}</a>
            `
        })
        return
    }
}

// FIXME: no more location, can also remove error message
const error = (err) => {
    document.querySelector('#location').innerHTML = 'Error getting location'
}

const getCoordinates = () => {
    navigator.geolocation.getCurrentPosition(success, error);
}
getCoordinates()
setInterval(getCoordinates, 30000)

// GREETING (sayGreeting + name)

// Say greeting based on time
const greetingDiv = document.querySelector('#greeting-div')
let greeting = 'morning'
const sayGreeting = () => {
    const today = new Date()
    let h = today.getHours()
    if (h >= 12) {
        greeting = 'afternoon'
    }
    if (h >= 18) {
        greeting = 'evening'
    }
    greetingDiv.innerHTML = `Good ${greeting}, `
    setTimeout(startTime, 1000) 
}

// Get name from input
const nameInput = document.querySelector('.name-input')
const nameButton = document.querySelector('.name-button')
const nameDiv = document.querySelector('#name-div')
const editNameButton = document.querySelector('.edit-name-btn')

const addName = (event) => {
    event.preventDefault()
    nameDiv.innerHTML = ` ${nameInput.value}.`
    nameInput.classList.toggle('invisible')
    nameButton.classList.toggle('invisible')
    editNameButton.classList.toggle('visible')
}

const editName = (event) => {
    event.preventDefault()
    nameDiv.innerHTML = ""
    nameInput.value = ""
    console.log(nameInput.classList)
    nameInput.classList.toggle('invisible')
    nameButton.classList.toggle('invisible')
    editNameButton.classList.toggle('visible')
}

nameButton.addEventListener('click', addName)
editNameButton.addEventListener('click', editName)
nameDiv.addEventListener('click', editName)


const goalInput = document.querySelector('.goal-input')
const goalButton = document.querySelector('.goal-button')
const goalDiv = document.querySelector('#goal-div')

const addGoal = (event) => {
    event.preventDefault()
    goalDiv.innerHTML = `${goalInput.value}`
    goalInput.classList.toggle('invisible')
}

const editGoal = (event) => {
    event.preventDefault()
    goalDiv.innerHTML = ""
    goalInput.value = ""
    goalInput.classList.toggle('invisible')
}

goalButton.addEventListener('click', addGoal)
goalDiv.addEventListener('click', editGoal)



//  TODO LIST
const todoInput =  document.querySelector('.todo-input')
const todoButton =  document.querySelector('.todo-button')
const todoContainer =  document.querySelector('.todo-container')
const todoList =  document.querySelector('.todo-list')
const filterOption = document.querySelector('.filter-todo')


const addTodo = (event) => {
    // prevent default refresh when submitting button
    event.preventDefault();

    const todoDiv = document.createElement('div')
    todoDiv.classList.add("todo")

    const newTodo = document.createElement('li')
    newTodo.innerText = todoInput.value
    newTodo.classList.add('todo-item')

    todoDiv.appendChild(newTodo)
    todoInput.value = ""

    const completeButton = document.createElement('button')
    completeButton.innerHTML = '&#10004'
    completeButton.classList.add('complete-btn')
    todoDiv.appendChild(completeButton)

    const deleteButton = document.createElement('button')
    deleteButton.innerHTML = '&#10006'
    deleteButton.classList.add('delete-btn')
    todoDiv.appendChild(deleteButton)

    todoList.appendChild(todoDiv)
}


const deleteCheck = (event) => {
    const item = event.target;
    // delete todo
    
    if (item.classList[0] === 'delete-btn') {
        const todo = item.parentElement
        todo.classList.add('fall')
        todo.addEventListener('transitionend', function() {
            todo.remove()
        })
    }
    if (item.classList[0] === 'complete-btn') {
        const todo = item.parentElement
        let todoArray = item.parentElement.parentElement.childNodes
        let lastIndex = todoArray.length - 1 
        todoArray[lastIndex] = item.parentElement.firstChild
        todo.classList.toggle('completed')
        console.log(item.parentElement.firstChild)
        console.log(todoArray)
    }
    
}

// FIXME: fix the filter option
const filterTodo = (event) => {
    const todos = todoList.childNodes
    console.log(todos)
    todos.forEach(function(todo) {
        console.log(todo)
        switch(event.target.value) {
            case "all":
                todo.style.display = 'flex'
                break
            case "completed":
                if(todo.classList.contains('completed')) {
                    todo.style.display = 'flex;'
                } else {
                    todo.style.display = 'none'
                }   
            case "uncompleted":
                if(todo.classList.contains('uncompleted')) {
                    todo.style.display = 'flex;'
                } else {
                    todo.style.display = 'none'
                }   
        }
    })
}

 
todoButton.addEventListener('click', addTodo)
todoList.addEventListener('click', deleteCheck)
// filterOption.addEventListener('click', filterTodo)



// QUOTES

// Default quote array
let quotes = [
    ["Fortune favors the bold", "Virgil"],
    ["The journey of a thousand miles begins with one step.", "Lao Tzu"],
    ["You must be the change you wish to see in the world.", "Mahatma Gandhi"],
    ["Those who dare to fail miserably can achieve greatly.", "John F. Kennedy"],
    ["Don’t be afraid to give up the good to go for the great.", "John D. Rockefeller"]
]

const quoteText = document.querySelector('#quote-text')
const quoteAuthor = document.querySelector('#quote-author')
const quoteButton = document.querySelector('.refresh-quote')
const quoteAddButton = document.querySelector('.quote-add-button')
const quoteTextInput = document.querySelector('#quote-text-input')
const quoteAuthorInput = document.querySelector('#quote-author-input')
const quoteForm = document.querySelector('#quote-form')
const quoteDiv = document.querySelector('#quote-div')

// for display/ refresh random quote
const showNewQuote = () => {
    let randNum = Math.floor(Math.random() * (quotes.length))
    let text = quotes[randNum][0]
    let author = quotes[randNum][1]

    quoteText.innerHTML = `${text}`
    quoteAuthor.innerHTML = `${author}`
}

quoteButton.addEventListener('click', showNewQuote)

// for adding new quotes

const showFormQuote = (event) => {
    event.preventDefault();
    quoteForm.classList.toggle('visible')
    quoteDiv.classList.toggle('invisible')
}
const addNewQuote = (event) => {
    event.preventDefault();
    quotes.push([quoteTextInput.value, quoteAuthorInput.value])
    quoteForm.classList.toggle('visible')
    quoteDiv.classList.toggle('invisible')
    return quotes
}
quoteText.addEventListener('click', showFormQuote)
quoteAddButton.addEventListener('click', addNewQuote)
newBGButton.addEventListener('click',getNewImage)
