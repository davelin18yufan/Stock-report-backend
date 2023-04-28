if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
// const session = require('express-session')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000

app.use(routes)

app.listen(port, () => {
  console.info('Server OK')
})
