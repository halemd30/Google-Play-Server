const express = require('express')
const morgan = require('morgan')
const games = require('./games.js')

const app = express()
app.use(morgan('common'))

app.get('/games', (req, res) => {
  const { genres, sort } = req.query
  const sortKeys = ['Rating', 'App']
  const allowedGenres = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card']
  let results = games

  if (sort) {
    if (!sortKeys.includes(sort)) {
      return res
        .status(400)
        .send('Sort must be one of Rating or App')
    }
  }

  if (genres) {
    if (!allowedGenres.includes(genres)) {
      return res
        .status(400)
        .send('Must include genre of: Action, Puzzle, Strategy, Casual, Arcade, Card')
    }
  }

  if (genres) {
    results = results.filter(game => game.Genres === genres) 
  }

  if (sort) {
    results.sort((a, b) => {
      return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0
    })
  }

  res
    .json(results)
})

module.exports = app