import express from 'express'

import { createPost, getPost, getAllPost, updatePost, deletePost } from '../controllers/postController.js'
import {createReview} from '../controllers/reviewController.js'

import auth from '../middlewares/authMiddleware.js'


const router = express.Router()

router.route('/').post(auth, createPost).get(getAllPost)
router.route('/:id/review').post(auth, createReview)
router.route('/:id/update').patch(auth, updatePost)
router.route('/:id').get(auth, getPost).delete(deletePost)


export default router