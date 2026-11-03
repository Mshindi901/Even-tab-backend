import {Sequelize} from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.DB_URL;

const sequelize = new Sequelize(dbUrl, {
    dialect: 'postgres',
    logging: false,
});

export default sequelize;