const express = require('express')
const router = express.Router()
const { login } = require('./../services/login')

router.post('/', function (req, res, next) {
  const user = req.body

  login(user)
    .then(token => res.status(200).json({ auth: true, token }))
    .catch(err => res.status(401).json({ auth: false, err }))
})

module.exports = router
