import sequelize from "../../database/config.js";
import {DataTypes} from "sequelize";

const Bill = sequelize.define("bill", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.UUID,
        references: {
            model: "users",
            key: "id"
        },
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
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
    },
    bill_total: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {timestamps: true});

export default Bill;