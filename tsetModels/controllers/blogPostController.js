import {BlogPost as Blog, Rating} from '../models/index.js'
import {v4 as uuid} from 'uuid'
import path from 'path'
import {promises as fs} from 'fs'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import response from '../utils/response.js';
import { StatusCodes } from 'http-status-codes';
import { Sequelize, or } from 'sequelize';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



async function saveImage(postImage){
    if (!postImage.mimetype.startsWith('image/')){
        return res.json(response(res, null, 'please insert a file with image format', StatusCodes.CREATED, null));
        
    }
    const max_size = 1024 * 1024 * 6;
    if (postImage.size > max_size) {
        return res.json(response(res, null, 'send a smaller image', StatusCodes.CREATED, null));
        
    }
    
    let new_filename = uuid()
    let splitted_filename = postImage.name.split('.')
    const uploadDir = path.resolve(__dirname, `../public/uploads`, `${new_filename}.${splitted_filename[splitted_filename.length - 1]}`)
    console.log(uploadDir)
    await postImage.mv(uploadDir)
    return `${new_filename}.${splitted_filename[splitted_filename.length - 1]}`
}


export async function createBlogPost(req, res) {
    let {title, content} = req.body;
    console.log(title, content);
    // let postImage = req.files?.image
    // if (postImage){

    //     let localImage = await saveImage(postImage)
    //     const post = await Blog.create({title: title, content: content, picture: `/static/uploads/${localImage}`})
    //     return res.json(response(res, post, null, StatusCodes.CREATED, null));
    // }
    const post = await Blog.create({title: title, content: content, picture: null})
    return res.json(response(res, post, null, StatusCodes.CREATED, null));

}
export async function getAllPosts(req, res){
    let {desc, page, q} = req.query
    page = page || 1
    let order = ['title', desc === 'true' ? 'DESC':'ASC']
    let where = {};

    if (q){
        where[Sequelize.Op.or] = [
            {title: {[Sequelize.Op.like]: `%${q}%`}},
        ];
    }
    try{

        
        const posts = await Blog.findAll({
            limit: 10,
            offset: 10 *(page - 1),
            where: where,
            order: [order],
            attributes: [
                'id',
                'title',
                'content',
                'picture',
                // [Sequelize.fn('SUM', Sequelize.col('reviews.score')), 'avgScore']
                [Sequelize.literal(`(SELECT AVG(score) FROM "Rating" WHERE "Rating"."blogPostId" = "BlogPost"."id")`), 'avgScore']
            ],

            include: [
                {
                    model: Rating,
                    as: 'reviews',
                    attributes: ['score', 'review']
                }
            ],
        
        })
        let nexPageUrl = ''
        if (posts.length >= 10){
            nexPageUrl = `http://127.0.0.1:8000/blog?page=${++page}&desc=${desc}`
        }
        return res.json(response(res, posts, null, StatusCodes.OK, {nextPage: nexPageUrl, count: posts.length}))
    } catch(err){
        console.log(err);
        return res.json(response(res, null, err, 500, null))
        
    }
}


export async function getSinglePost(req, res){
    let {id} = req.params
    const post = await Blog.findOne({
        where:
        {id: id, '$reviews.id$': 1},
        include: [
            {
                model: Rating,
                as: 'reviews',
                attributes: ['score', 'review']
            }
        ]
    })
    if (!post) {
        return res.json(response(res, null, 'post not found', StatusCodes.NOT_FOUND, null))
    }
    return res.json(response(res, post, null, StatusCodes.OK, null))
}


export async function deletePost(req, res){
    let {id} = req.params
    const post = await Blog.findOne({where: {id: id}})
    if (!post || post.userId !== req.user.userId) {
        return res.json(response(res, null, 'post not found', StatusCodes.NOT_FOUND, null))
    }
    let picture = post.picture
    if (picture){
        let oldImageFile = post.picture.split('/')[3]
        
        await fs.unlink(path.resolve(__dirname, `../public/uploads/${oldImageFile}`))
    }
    post.destroy()
    return res.json(response(res, 'deleted', null, StatusCodes.NO_CONTENT, null));
}

export async function updatePost(req, res){
    let {id} = req.params
    let {title, content} = req.params
    let picture = req.files.image
    const post = await Blog.findOne({where: {id: id}})
    if (!post || post.userId !== req.user.userId) {
        return res.json(response(res, null, 'post not found', StatusCodes.NOT_FOUND, null))
    }
    if (picture){
        let oldImageFile = post.picture.split('/')[3]
        
        await fs.unlink(path.resolve(__dirname, `../public/uploads/${oldImageFile}`))
        let filename = await saveImage(picture);
        post.picture = `/static/uploads/${filename}`
    }
    post.title = title || post.title;
    post.content = content || post.content;
    post.save();
    return res.json(response(res, post, null, StatusCodes.ACCEPTED, null));
}

export async function myPosts(req, res) {
    let user = req.user
    let order = req.query.sort || 'asc'
    let page = req.query.page || 1
    const posts = await Blog.findAll(
        {
            where: {userId: user.userId},
            limit: 10,
            order: [['title', order === 'desc'? 'DESC': 'ASC']],
            offset: 10 * (page - 1),
            attributes: ['id', 'title', 'content', 'picture']
        })
    console.log(req.params.page);

    let nexPageUrl = '';
    if (posts.length >= 10){
        nexPageUrl = `http://127.0.0.1:8000/blog/me?page=${++page}&order=${order}`

    }
    return res.json(response(res, posts, null, StatusCodes.OK, {next: nexPageUrl}));
}

