import { Sequelize } from "sequelize";
import { Contact } from "../models/index.js";
import multer  from 'multer';
import passport from "passport";


const upload = multer({ storage: multer.memoryStorage() });

async function loadContacts(req, res, next){
    const {sort, desc, q} = req.query;
    let page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const order = [];
    let where = {UserId: req.user.id};

    
    if (sort) {
        order.push([sort, desc === 'true' ? 'DESC':'ASC']);
    }
    
    if (q){

        where[Sequelize.Op.or] = [
            {firstName: {[Sequelize.Op.like]: `%${q}%`}},
            {lastName: {[Sequelize.Op.like]: `%${q}%`}},
            {mobilePhone: {[Sequelize.Op.like]: `%${q}%`}},
        ];
    }

    console.log(page)
    console.log(where);
    try{

        const contact = await Contact.findAll({
            // attributes: ["firstName"]
            where: where,
            order: order,
            limit: limit,
            offset: limit * (page - 1),
        });

        const normalized = contact.map(({dataValues: {id, profilePicture, ...rest}}) => ({id, profilePicture :profilePicture?`http://127.0.0.1:8000/image/${id}`:null, ...rest}));
        console.log(contact.length);            
        if (contact.length >= limit){

            let next_page_url = `http://127.0.0.1:8000?limit=${limit}&page=${++page}`;
            req.next_url = next_page_url;
        }
        req.locals = normalized;
        next();

    } catch(err){
        res.status(500);
        console.log(err);
        console.log('err');
        res.json({"status": 'bad request'});
    
    }
}

async function getContacts(req, res) {
    // try{

        // const contact = await Contact.findAll({
        //     // attributes: ["firstName"]
        // });
        // const normalized = contact.map(({dataValues: {id, profilePicture, ...rest}}) => ({id, profilePicture :profilePicture?`http://127.0.0.1:8000/image/${id}`:null, ...rest}));
        res.status(200);
        return res.json({"data":req.locals, "next":req.next_url});
    // } catch(err){
    //     res.status(500);
    //     console.log(err)
    //     console.log('err')
    //     res.json({"err":err});
    // }

}

async function getContactsFormatted(req, res, next){
    if (req.query.format !== 'true'){
        console.log(req.query);
        return next();
    }
    console.log(req.query);

    
    return next();

}

export const getAll = [
    passport.authenticate('jwt', {session: false}),
    loadContacts,
    getContactsFormatted,
    getContacts
    ]

async function newC(req, res) {
    const {firstName, lastName, mobilePhone, is_favorite} = req.body;
    const UserId = req.user.id;

    const profilePicture = req.file;
    console.log(profilePicture);
    try{

        let c = await Contact.create({
            firstName, 
            lastName, 
            mobilePhone, 
            is_favorite,
            profilePicture,
            UserId
        }) 
        res.status(201);
        res.json({"status":"ok"});
    } catch (err){
        res.status(400).json({"status":"bad request"});
    }
}
export const createContact  = [passport.authenticate('jwt', {session:false}),upload.single("profilePicture"), newC];
export async function getOne(req, res){
    let id = req.params.id;
    try{

        let contact = await Contact.findOne({
            where: {id: id, UserId: req.user.id}
        });
        res.status(200).json({"data": contact});
    } catch(err) {
        res.status(500);
        res.json({"err": err});
    }


}


export async function deleteOne(req, res){
    try{

        const c = await Contact.findOne({
            where: {id: req.params.id}
        });
        console.log(c)
        if (c.UserId !== req.user.id){
            return res.status(404).json({"status":"not Fond"});
        }
        await c.destroy();
        return res.status(204).json({"status":"deleted"});
    } catch(err) {
        res.status(500);
        res.json({"err": err});
    }


}
export async function update(req, res){
    const { firstName, lastName, mobilePhone, is_favorite } = req.body;
    try{

        let c = await Contact.update({
            firstName,
            lastName,
            mobilePhone,
            is_favorite
        }, {
            where: {id: req.params.id}
        });
        return res.status(202).json({"status":"updated"});
    } catch(err) {
        res.status(500);
        console.log(err)
        res.json({"err": err});
    }


}


export async function get_image(req, res){
    try {
        const id = req.params.id;
        const contact = await Contact.findByPk(id);

        if (!contact || !contact.profilePicture) {
            return res.status(404).send('Contact or profile picture not found');
        }

        // Set the content type based on the image type (e.g., 'image/jpeg')
        res.contentType('image/png');
        console.log(contact.profilePicture)
        res.send(contact.profilePicture);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}