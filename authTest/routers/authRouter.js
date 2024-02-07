import express from 'express'

import {signup, login, refresh, logout} from '../controllers/authController.js'
import verifyJWT from '../middlewares/verifyJWT.js'
const router = express.Router()


router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/refresh').get(refresh)
router.route('/logout').post(verifyJWT, logout)



export {router}