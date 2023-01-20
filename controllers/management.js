import mongoose from 'mongoose'

import User from '../models/User.js'
import Transaction from '../models/Transaction.js'

// @desc    Get User
// @route   GET /management/admins
// @access  Public
export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-password')

    res.status(200).json(admins)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// @desc    Get User Performance
// @route   GET /management/performance/:id
// @access  Public
export const getUserPerformance = async (req, res) => {
  try {
    const { id } = req.params

    const userWithStats = await User.aggregate([
      // Corresponds to WHERE/HAVING in SQL
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        // Corresponds to JOIN in SQL
        $lookup: {
          from: 'affiliatestats',
          localField: '_id',
          foreignField: 'userId',
          as: 'affiliateStats',
        },
      },
      { $unwind: '$affiliateStats' },
    ])

    const transactions = await Promise.all(
      userWithStats[0].affiliateStats.affiliateSales.map((id) => {
        return Transaction.findById(id)
      })
    )

    const filteredTransactions = transactions.filter(
      (transaction) => transaction !== null
    )

    res
      .status(200)
      .json({ user: userWithStats[0], sales: filteredTransactions })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
