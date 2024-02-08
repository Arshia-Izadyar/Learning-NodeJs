import express from 'express'

import { register, login, logout, refresh } from '../controllers/authController.js'
import auth from '../middlewares/authMiddleware.js'


const router = express.Router()

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').post(auth, logout)
router.route('/refresh').post(refresh)



export default router