import express from 'express';


const router = express.Router();


import {getAll} from '../controllers/controller.js';
import {createContact, getOne, deleteOne, update, get_image} from '../controllers/controller.js';


router.route('/').get(getAll);
router.route('/:id').get(getOne).delete(deleteOne).patch(update);
router.route('/new').post(createContact);
router.route('/image/:id').get(get_image);

export {router};