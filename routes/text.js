const express = require('express')
const router = express.Router()
const texts = require('./../db/texts')
const { jwtMiddleware } = require('./../middleware/jwt')



router.get('/:id', jwtMiddleware, function (req, res, next) {
  try {
    const id = req.params.id
    const text = texts[id]
    if (text == 'undefined') {
      res.status(400).send('wrong text id')
    } else {
      res.json(text)
    }
  } catch (err) {
    res.status(400).send(err)
  }
})

module.exports = router
