import { body } from 'express-validator'

export const registerValidator = [
  body('email')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage('La contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales'),

  body('firstName')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .trim()
    .escape(),

  body('lastName')
    .notEmpty()
    .withMessage('El apellido es requerido')
    .trim()
    .escape()
]

export const loginValidator = [
  body('email')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
]
