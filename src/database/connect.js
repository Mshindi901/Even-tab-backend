import sequelize from "./config.js";

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connectedsuccessfully.');
        await sequelize.sync({alter: true});
        console.log('Models synchronized successfully.');
        return sequelize;
    } catch (error) {
        console.error(`Error connecting to the database: ${error}`);
        return null;
    }
};

export default connectDB;