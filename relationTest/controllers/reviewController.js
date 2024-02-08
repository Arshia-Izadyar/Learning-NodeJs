import { StatusCodes } from "http-status-codes"
import {Post, Review} from "../models/index.js"
import  response from "../utils/response.js"
import { UniqueConstraintError, ValidationError } from "sequelize"


export async function createReview(req, res) {
    let {id: postId} = req.params
    let user = req.user
    let { comment, rate } = req.body
    
    const postExists = await Post.findOne({where: {id: postId}})
    if (!postExists) {
        return res.status(StatusCodes.NOT_FOUND).json(response(null, 'post not found', false))
    }
    try {
        let postComment = await Review.create({userId: user.userId, postId: postId, rate: rate, comment: comment})

        return res.status(StatusCodes.CREATED).json(response({rate: postComment.rate, comment :postComment.comment}, null, true))
        
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            let review = await Review.findOne({where: {userId: user.userId, postId: postId}})
            await review.destroy()
            return res.status(StatusCodes.NO_CONTENT).json(response(null, null, true))
        }
        if (err instanceof ValidationError){
            return res.status(StatusCodes.BAD_REQUEST).json(response(null, err.errors[0].message, false))
        }
    }
}