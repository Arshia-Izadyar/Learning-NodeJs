import { Sequelize } from "sequelize";
import ContactModel from "./contact.js";
import ContactCategoryModel from "./contactCategory.js";
import configs from '../config/config.json' assert { type: "json" };
import UserModel from './user.js';

const sequelize = new Sequelize(configs["development"]);

const User = UserModel(sequelize);
const Contact = ContactModel(sequelize);
const ContactCategory = ContactCategoryModel(sequelize);

Contact.hasMany(ContactCategory);
ContactCategory.belongsTo(Contact);

Contact.belongsTo(User);
User.hasMany(Contact);

export {sequelize};
export {Contact};
export {User};
export {ContactCategory};