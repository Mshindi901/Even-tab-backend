import {Sequelize} from 'sequelize';

const sequelize = new Sequelize('bills', 'postgres', 'yugah2005@', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
});

export default sequelize;