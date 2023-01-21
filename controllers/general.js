import User from '../models/User.js'
import Transaction from '../models/Transaction.js'
import OverallStat from '../models/OverallStat.js'

// @desc    Get User
// @route   GET /general/user/:id
// @access  Public
export const getUser = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id)

    res.status(200).json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// @desc    Get Dashboard Stats
// @route   GET /general/dashboard
// @access  Public
export const getDashboardStats = async (req, res) => {
  try {
    // Hard-coded values
    const currentYear = 2021
    const currentMonth = 'November'
    const currentDay = '2021-11-10'

    // Recent transactions
    const transactions = await Transaction.find()
      .limit(50)
      .sort({ createdOn: -1 })

    const overallStat = await OverallStat.find({ year: currentYear })

    const {
      totalCustomers,
      yearlySalesTotal,
      yearlyTotalSoldUnits,
      monthlyData,
      salesByCategory,
    } = overallStat[0]

    const currentMonthStat = overallStat[0].monthlyData.find(
      ({ month }) => month === currentMonth
    )

    const currentDayStat = overallStat[0].dailyData.find(
      ({ date }) => date === currentDay
    )

    res.status(200).json({
      totalCustomers,
      yearlySalesTotal,
      yearlyTotalSoldUnits,
      monthlyData,
      salesByCategory,
      currentMonthStat,
      currentDayStat,
      transactions,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
