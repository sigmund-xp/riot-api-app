export const jwtSecret = process.env.SECRET_JWT_KEY
export const jwtSecretRefresh = process.env.SECRET_JWT_REFRESH_KEY
export const jwtExpiration = process.env.JWT_EXPIRATION || '15m'
export const jwtRefreshExpiration = process.env.JWT_REFRESH_EXPIRATION || '7d'

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
}
