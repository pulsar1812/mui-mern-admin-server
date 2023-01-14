import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import helmet from 'helmet'
import mongoose from 'mongoose'

import clientRoutes from './routes/client.js'
import generalRoutes from './routes/general.js'
import managementRoutes from './routes/management.js'
import salesRoutes from './routes/sales.js'
import User from './models/User.js'
import Product from './models/Product.js'
import ProductStat from './models/ProductStat.js'
import { dataUser, dataProduct, dataProductStat } from './data/index.js'

// Configuration
dotenv.config()

const app = express()

// Body parser
app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ limit: '20mb', extended: true }))

// Set security headers
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))

// Enable CORS
app.use(cors())

// Logging middleware in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Routes
app.use('/client', clientRoutes)
app.use('/general', generalRoutes)
app.use('/management', managementRoutes)
app.use('/sales', salesRoutes)

// Connect to MongoDB and listen to PORT 5000
const PORT = process.env.PORT || 5000
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () =>
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on Port ${PORT}`
      )
    )

    // Only add once
    // User.insertMany(dataUser)
    // Product.insertMany(dataProduct)
    // ProductStat.insertMany(dataProductStat)
  })
  .catch((err) => console.log('Connection error: ', err))
