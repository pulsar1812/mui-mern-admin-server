import OverallStat from '../models/OverallStat.js'

// @desc    Get Sales
// @route   GET /sales
// @access  Public
export const getSales = async (req, res) => {
  try {
    const overallStats = await OverallStat.find()

    res.status(200).json(overallStats[0])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
