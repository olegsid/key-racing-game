const users = require('./../db/users.json')
const jwt = require('jsonwebtoken')

function login ({ login, password }) {
  const userInDb = users.find(user => user.login === login)
  
  if (userInDb && userInDb.password === password) {
    const token = jwt.sign({ login, password }, 'someSecret', { expiresIn: '24h' })
    return Promise.resolve(token)
  } else {
    return Promise.reject()
  }
}

module.exports = {
  login
}
