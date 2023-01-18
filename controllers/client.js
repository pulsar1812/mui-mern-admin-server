import getCountryIso3 from 'country-iso-2-to-3'

import Product from '../models/Product.js'
import ProductStat from '../models/ProductStat.js'
import User from '../models/User.js'
import Transaction from '../models/Transaction.js'

// @desc    Get Products
// @route   GET /client/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()

    const productsWithStats = await Promise.all(
      products.map(async (product) => {
        const stat = await ProductStat.find({
          productId: product._id,
        })

        return {
          ...product._doc,
          stat,
        }
      })
    )
    res.status(200).json(productsWithStats)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// @desc    Get Customers
// @route   GET /client/customers
// @access  Public
export const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'user' }).select('-password')

    res.status(200).json(customers)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// @desc    Get Transactions
// @route   GET /client/transactions
// @access  Public
export const getTransactions = async (req, res) => {
  try {
    // e.g. { "field": "userId", "sort": "desc"}
    const { page = 1, pageSize = 20, sort = null, search = '' } = req.query

    // e.g. { userId: -1 }
    const generateSort = () => {
      const parsedSort = JSON.parse(sort)

      const formattedSort = {
        [parsedSort.field]: (parsedSort.sort = 'asc' ? 1 : -1),
      }

      return formattedSort
    }

    const formattedSort = Boolean(sort) ? generateSort() : {}

    const transactions = await Transaction.find({
      // $or: [
      // { cost: { $regex: new RegExp(search, 'i') } },
      userId: { $regex: new RegExp(search, 'i') },
      // ],
    })
      .sort(formattedSort)
      .skip(pageSize * page)
      .limit(pageSize)

    const total = await Transaction.countDocuments({
      name: { $regex: search, $options: 'i' },
    })

    res.status(200).json({ transactions, total })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// @desc    Get Geography
// @route   GET /client/geography
// @access  Public
export const getGeography = async (req, res) => {
  try {
    const users = await User.find()

    const mappedLocations = users.reduce((acc, { country }) => {
      const countryISO3 = getCountryIso3(country)
      if (!acc[countryISO3]) {
        acc[countryISO3] = 0
      }

      acc[countryISO3]++
      return acc
    }, {})

    const formattedLocations = Object.entries(mappedLocations).map(
      ([country, count]) => {
        return { id: country, value: count }
      }
    )

    res.status(200).json(formattedLocations)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
