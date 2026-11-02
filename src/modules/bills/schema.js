import sequelize from "../../database/config.js";
import {DataTypes} from "sequelize";

const Bill = sequelize.define("bill", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    public_token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING,
        defaultValue: "KES",
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("open", "closed"),
        defaultValue: "open",
        allowNull: false
    }
}, {timestamps: true});

export default Bill;