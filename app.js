// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config()
// }
require('dotenv').config()
const express = require('express')
const session = require('express-session')
const routes = require('./routes')
const { getUser } = require('./_helpers')
const passport = require('./config/passport')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = process.env.SESSION_SECRET

app.use(cors())
// body-parser
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.use(session({ secret: SESSION_SECRET || 'secret', resave: false, saveUninitialized: false }))
// passport
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
  res.locals.user = getUser(req)
  next()
})

app.use('/api', routes)

app.listen(port, () => {
  console.info('Server OK')
})
