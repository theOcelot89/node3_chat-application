const socket = io()

//Elements
const $messageForm =  document.querySelector('#message')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton =  document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML


//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // New message element
    $newMessage = $messages.lastElementChild

    //height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //visible height
    const visibleHeight = $messages.offsetHeight
    
    //height of messages container
    const containerHeight = $messages.scrollHeight

    //how far have i scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }
    console.log('autoscroll check')
}  
socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        timestamp: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', (locationUrl) => {
    console.log(locationUrl)
    const html = Mustache.render(locationTemplate, {
        username: locationUrl.username,
        locationUrl: locationUrl.url,
        timestamp: moment(locationUrl.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html

})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    //disable 
    $messageFormButton.setAttribute('disabled', 'disabled')
    // $messageFormInput.setAttribute('disabled', 'disabled')


    message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {

        //enable
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value= ''
        $messageFormInput.focus()


        if (error) {
            return console.log(error)
        }
        console.log('Message delivered!')
    })
})

$locationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    $locationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        latitude = position.coords.latitude
        longitude = position.coords.longitude

        socket.emit('sendLocation', {latitude, longitude},() => {
            $locationButton.removeAttribute('disabled')
            console.log('Location shared!')
        })
    })
})


socket.emit('join', {username, room}, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})
