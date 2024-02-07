import express from 'express'
import { StatusCodes } from 'http-status-codes'

import {RatingModel as Rating} from '../models/index.js'
import response from '../utils/response.js'
import { Sequelize, UniqueConstraintError, ValidationError} from 'sequelize'


export async function crateRating(req, res) {
    let user = req.user
    let {score, review} = req.body;
    let {id: blogPostId} = req.params 
    try {
        let postReview = await Rating.create({userId: user.userId, score: score, review: review, blogPostId: blogPostId})
        return res.json(response(res, postReview, null, StatusCodes.CREATED, null));
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            let postReview = await Rating.findOne({
                where: {userId: user.userId, blogPostId: blogPostId}
            })
            postReview.destroy();

            return res.json(response(res, 'deleted', null, StatusCodes.NO_CONTENT, null));
        }
        else if (err instanceof ValidationError) {
            return res.json(response(res, null, err.message, StatusCodes.BAD_REQUEST, null));

        }
        return res.json(response(res, null, 'something went wrong', StatusCodes.INTERNAL_SERVER_ERROR, null));
    }
}


