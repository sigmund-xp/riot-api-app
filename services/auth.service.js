import jwt from 'jsonwebtoken'
import axios from 'axios'
import { User } from '../models/User.js'
import { Balance } from '../models/Balance.js'
import { jwtSecret, jwtExpiration, jwtSecretRefresh, jwtRefreshExpiration } from '../config.js'
import sessionMap from '../sessionStore.js'

export const registerUser = async (userData) => {
  const { email, password, firstName, lastName } = userData

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new Error('El email ya está registrado')
  }

  const newUser = new User({
    email,
    password,
    firstName,
    lastName,
    isTestAccount: userData.isTestAccount || false
  })

  await newUser.save()

  const initialBalance = new Balance({
    userId: newUser._id,
    availableBalance: 0,
    currency: newUser.isTestAccount ? 'TEST_USDT' : 'USDT'
  })
  await initialBalance.save()

  return {
    id: newUser._id,
    email: newUser.email,
    firstName: newUser.firstName,
    lastName: newUser.lastName
  }
}

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    throw new Error('Credenciales inválidas')
  }

  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    throw new Error('Credenciales inválidas')
  }

  user.lastLogin = new Date()
  await user.save()

  const tokens = generateTokens(user)
  sessionMap.set(user._id.toString(), { tokens })

  return {
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isVerified: user.isVerified,
      role: user.role
    },
    ...tokens
  }
}

export const refreshToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, jwtSecret)
    const user = await User.findById(decoded.id)

    if (!user) {
      throw new Error('Usuario no encontrado')
    }

    return generateTokens(user)
  } catch (error) {
    throw new Error('Refresh token inválido')
  }
}

export const registerRiot = async (userId, riotId, riotTag) => {
  const user = await User.findById(userId)
  if (!user) {
    return { status: -1, message: 'Problema con el Id de Riot' }
  } else {
    const anotherUser = await User.findOne({ riotId: `${riotId}#${riotTag}`, _id: { $ne: `${userId}` } })
    if (anotherUser) {
      return { status: -1, message: 'El Id esta registrado en otro usuario' }
    }
    const riotPuuid = await getRiotPuuid(riotId, riotTag)
    if (riotPuuid === '') {
      return { status: -1, message: `El usuario ${riotId}#${riotTag} no existe en Riot Games` }
    } else {
      const iconId = await getIconId(riotPuuid)
      if (riotPuuid === '') {
        return { status: -1, message: `El usuario ${riotId}#${riotTag} no existe en Riot Games` }
      } else {
        user.riotId = `${riotId}#${riotTag}`
        user.riotPuuid = riotPuuid
        await user.save()

        const newIcon = getRandomNumber(iconId)
        const session = sessionMap.get(userId)
        sessionMap.set(user._id.toString(), { ...session, iconId: newIcon })
        return { status: 0, newIcon }
      }
    }
  }
}

export const validateRiot = async (userId) => {
  console.log(sessionMap)
  const user = await User.findById(userId)
  if (!user) {
    return { status: -1, message: 'Problema con el Id de Riot' }
  }
  const iconId = await getIconId(user.riotPuuid)
  if (user.riotPuuid === '') {
    return { status: -1, message: `El usuario ${user.riotId} no existe en Riot Games` }
  } else {
    const session = sessionMap.get(userId)
    console.log(`session.iconId => ${session.iconId}`)
    console.log(`iconId => ${String(iconId).padStart(2, '0')}`)
    if (session.iconId === String(iconId).padStart(2, '0')) {
      return { status: 0, validated: true }
    } else {
      return { status: 0, validated: false }
    }
  }
}

export const logoutUser = async (userId) => {
  sessionMap.delete(userId)
  return { message: 'Logout exitoso' }
}

const generateTokens = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role
  }

  const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiration })
  const refreshToken = jwt.sign(payload, jwtSecretRefresh, { expiresIn: jwtRefreshExpiration })

  return { token, refreshToken }
}

const getRiotPuuid = async (riotId, riotTag) => {
  try {
    const accountResponse = await axios.get(
      `${process.env.RIOT_ACCOUNT_API_BASE_URL}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(riotId)}/${encodeURIComponent(riotTag)}`,
      {
        headers: {
          'X-Riot-Token': process.env.RIOT_API_KEY
        }
      }
    )
    const { puuid } = accountResponse.data

    return puuid
  } catch (error) {
    console.log(error)
    return ''
  }
}

const getIconId = async (puuid) => {
  try {
    const summonerResponse = await axios.get(
      `${process.env.RIOT_GAME_API_BASE_URL}/lol/summoner/v4/summoners/by-puuid/${puuid}`,
      {
        headers: { 'X-Riot-Token': process.env.RIOT_API_KEY }
      }
    )

    const { profileIconId } = summonerResponse.data

    return profileIconId
  } catch (error) {
    console.log(error)
    return ''
  }
}

const getRandomNumber = (exclude = null) => {
  let numero

  do {
    numero = Math.floor(Math.random() * 29)
  } while (numero === exclude)

  return String(numero).padStart(2, '0')
}
