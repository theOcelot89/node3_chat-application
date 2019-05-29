const users  = []

// add, remove user, getuser, getusers in room

const addUser = ({id, username, room}) => {
    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate
    if (!username || !room) {
        return {
            error: 'Username and room are required'
        }
    }
    
    //check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //validate username
    if (existingUser){
        return  {
            error: 'Username is already in use'
        }
    }

    //store user
    const user = {id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })
    
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

addUser({
    id: 22,
    username: 'Andrew',
    room: 'cats'
})


const getUser = (id) => {
    return users.find((user) =>  user.id === id )
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    roomUsers = users.filter((user) => {
        return user.room === room
    })

    return roomUsers
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
