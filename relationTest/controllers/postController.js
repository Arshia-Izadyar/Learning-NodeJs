import { StatusCodes } from "http-status-codes"
import {Post, Review, sequelize} from "../models/index.js"
import {v4 as uui} from 'uuid'
import  response from "../utils/response.js"
import { UniqueConstraintError, ValidationError } from "sequelize"

export async function createPost(req, res){
    let {title, content} = req.body
    
    let slug = uui()

    try {
        const post = await Post.create({title: title, content: content, slug: slug})
        res.status(StatusCodes.CREATED).json(response(post, null, true))
        
    } catch (err) {
        if (err instanceof UniqueConstraintError){
            return res.status(StatusCodes.BAD_REQUEST).json(response(null, err.errors[0].message, false))
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response(null, err.errors[0].message, false))
    }
}

export async function getPost(req, res){
    let {id: postId} = req.params
    try {
        const post = await Post.findOne({
            where: {id: postId},
            attributes:[
                [sequelize.fn('AVG', sequelize.col('reviews.rate')), 'avgRate'],
                [sequelize.fn('COUNT', sequelize.col('reviews.id')), 'totalReview'],
                'title',
                'content',
            ],
            include: [{
                model: Review,
                as: "reviews",
                attributes: []
            }],
            raw: true,
            group: ['Post.id']
        })
        res.status(StatusCodes.OK).json(response(post, null, true))
        
    } catch (err) {
        if (err instanceof UniqueConstraintError){
            return res.status(StatusCodes.BAD_REQUEST).json(response(null, err.errors[0].message, false))
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response(null, err.message, false))
    }
}

export async function getAllPost(req, res){
    try {
        const posts = await Post.findAll({
            attributes: [
                [sequelize.fn('AVG', sequelize.col('reviews.rate')), 'avgRating'],
                [sequelize.fn('SUM', sequelize.col('reviews.rate')), 'sum'],
                [sequelize.fn('COUNT', sequelize.col('reviews.id')), 'totalReview'],
                'title',
                'content'
            ],
            include: [{
                model: Review,
                as: "reviews",
                attributes: []
            }],
            raw: true,
            group: ['Post.id']
        })
        return res.status(StatusCodes.OK).json(response(posts, null, true))
        
    } catch (err) {
        if (err instanceof UniqueConstraintError){
            return res.status(StatusCodes.BAD_REQUEST).json(response(null, err.errors[0].message, false))
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response(null, err.message, false))
    }
}

export async function updatePost(req, res) {
    let user = req.user
    let { title, content } = req.body
    let {id: postId} = req.params

    try {
        let post = await Post.findOne({where: {id: postId}})
        post.title = title || post.title
        post.content = content || post.content
        await post.save()

        return res.status(StatusCodes.ACCEPTED).json(response(post, null, true))
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            return res.status(StatusCodes.BAD_REQUEST).json(response(null, err.errors[0].message, false))
        }
        if (err instanceof ValidationError) {
            return res.status(StatusCodes.BAD_REQUEST).json(response(null, err.errors[0].message, false))
        }
    }
}

export async function deletePost(req, res) {
    let {id: postId} = req.params

    try {
        let post = await Post.findOne({where: {id: postId}})
        await post.destroy()
        return res.status(StatusCodes.NO_CONTENT).json(response(null, null, true))
    } catch (err) {
        return res.status(StatusCodes.BAD_REQUEST).json(response(null, err.message, false))
    }
}
