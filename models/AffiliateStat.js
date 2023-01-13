import { model, Schema } from 'mongoose'

const AffiliateStatSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    affiliateSales: {
      type: [Schema.Types.ObjectId],
      ref: 'Transaction',
    },
  },
  { timestamps: true }
)

const AffiliateStat = model('AffiliateStat', AffiliateStatSchema)
export default AffiliateStat
