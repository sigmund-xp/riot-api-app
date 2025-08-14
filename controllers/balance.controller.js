import { Balance } from '../models/Balance.js'

export const getBalance = async (req, res) => {
  console.log('getBalance')
  try {
    const balance = await Balance.findOne({ userId: req.user.id })

    let saldo = 0.00
    if (balance) { saldo = balance.availableBalance }

    return res.json({ balance: saldo })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message })
  }
}
