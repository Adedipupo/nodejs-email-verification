const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { urlencoded } = require('express')
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoute');

dotenv.config()

const app = express()

app.use(express.json())
app.use(urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
// app.use(
//   cors({
//     origin: ['http://localhost:3000'],
//     credentials: true,
//   }),
// )
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

const PORT = process.env.PORT || 4343

app.get('/', (req, res) => {
  res.send('api is live...')
});

app.use('/api/users', userRoutes);


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Connected to mongodb successfully,Server running on port ${PORT}`,
      )
    })
  })
  .catch((err) => console.log(err));


mongoose.set('strictQuery', false);
