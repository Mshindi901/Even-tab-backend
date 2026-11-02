import seqeulize from '../../database/config.js';
import {DataTypes} from 'sequelize';

const Participant = seqeulize.define('bill_participant', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    bill_id: {
        type: DataTypes.UUID,
        references: {
            model: 'bills',
            key: 'id'
        },
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount_paid: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    balance: {
        type: DataTypes.FLOAT,
        allowNull: true
    }
}, {timestamps: true});

export default Participant;