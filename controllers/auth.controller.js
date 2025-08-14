import { registerUser, loginUser, logoutUser, registerRiot, validateRiot, refreshToken } from '../services/auth.service.js'
import { User } from '../models/User.js'
import { validationResult } from 'express-validator'

export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const userData = req.body
    const result = await registerUser(userData)

    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body
    const result = await loginUser(email, password)

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: !(process.env.NODE_ENV === 'developer'),
      sameSite: process.env.NODE_ENV === 'developer' ? 'Lax' : 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({
      user: result.user,
      token: result.token
    })
  } catch (error) {
    next(error)
  }
}

export const refreshTokens = async (req, res, next) => {
  try {
    const cookieRefreshToken = req.cookies.refreshToken

    if (!cookieRefreshToken) {
      return res.status(401).json({ message: 'Refresh token requerido' })
    }

    const tokens = await refreshToken(cookieRefreshToken)

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: !(process.env.NODE_ENV === 'developer'),
      sameSite: process.env.NODE_ENV === 'developer' ? 'Lax' : 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({ token: tokens.token })
  } catch (error) {
    next(error)
  }
}

export const logout = async (req, res, next) => {
  try {
    res.clearCookie('refreshToken')

    const result = await logoutUser(req?.user?.id)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export const registerRiotId = async (req, res, next) => {
  try {
    const { riotId, riotTag } = req.body
    const result = await registerRiot(req.user.id, riotId, riotTag)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export const validateRiotId = async (req, res, next) => {
  try {
    const result = await validateRiot(req.user.id)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (error) {
    next(error)
  }
}
