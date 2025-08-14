import { param } from 'express-validator'
import mongoose from 'mongoose'

export const paramObjectIdValidator = [
  param('id').trim().notEmpty().escape()
    .custom(
      async (value) => {
        if (!mongoose.isValidObjectId(value)) {
          throw new Error('Debe enviarse un id de Link válido')
        }
      }
    )
]
