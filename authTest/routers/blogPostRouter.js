import express from 'express'


import { createBlogPost, getAllPosts, getSinglePost, deletePost, updatePost, myPosts} from '../controllers/blogPostController.js'


const router = express.Router()


router.route('/').post(createBlogPost).get(getAllPosts)
router.route('/me').get(myPosts)
router.route('/:id').get(getSinglePost).delete(deletePost).patch(updatePost)


export default router