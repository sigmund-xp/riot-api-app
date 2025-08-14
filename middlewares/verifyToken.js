import jwt from 'jsonwebtoken'
import { jwtSecret } from '../config.js'
import { User } from '../models/User.js'

export const verifyToken = async function (req, res, next) {
  let token = req.headers.authorization

  if (!token) {
    console.log('Token no proporcionado')
    return res.status(401).json({ status: 401, message: 'Token no proporcionado' })
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length)
  }

  try {
    const decoded = jwt.verify(token, jwtSecret)

    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ status: 401, message: 'Usuario no encontrado' })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'Usuario no encontrado') {
      return res.status(401).json({ status: 401, message: 'Token expirado', expiredAt: error.expiredAt })
    }
    return res.status(401).json({ status: 401, message: 'Token inválido' })
  }
}
