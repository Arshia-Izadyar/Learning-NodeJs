import { where } from "sequelize";
import { Contact } from "./models/index.js";
import multer  from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

export async function getAll(req, res) {
    try{

        const contact = await Contact.findAll({
            // attributes: ["firstName"]
        });
        const normalized = contact.map(({dataValues: {id, profilePicture, ...rest}}) => ({id, profilePicture :profilePicture?`http://127.0.0.1:8000/image/${id}`:null, ...rest}));
        res.status(200);
        return res.json({"data":normalized});
    } catch(err){
        res.status(500);
        console.log(err)
        console.log('err')
        res.json({"err":err});
    }

}

async function newC(req, res) {
    const {firstName, lastName, mobilePhone, is_favorite} = req.body;
    const profilePicture = req.file;
    console.log(profilePicture);
    try{

        let c = await Contact.create({
            firstName, 
            lastName, 
            mobilePhone, 
            is_favorite,
            profilePicture,
        }) 
        res.status(201);
        res.json({"status":"ok"});
    } catch (err){
        res.status(400).json({"status":"bad request"});
    }
}
export const createContact  = [upload.single("profilePicture"), newC];
export async function getOne(req, res){
    let id = req.params.id;
    try{

        let contact = await Contact.findOne({
            where: {id: id}
        });
        res.status(200).json({"data": contact});
    } catch(err) {
        res.status(500);
        res.json({"err": err});
    }


}


export async function deleteOne(req, res){
    try{

        await Contact.destroy({
            where: {id: req.params.id}
        });
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