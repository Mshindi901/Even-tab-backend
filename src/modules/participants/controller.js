import Participant from "./schema.js";
import Bill from '../bills/schema.js';

export const add_participant = async (req, res) => {
    try {
        const {name, amount_paid} = req.body;
        const {token} = req.params;
        if(!name || !amount_paid || !token) {
            return res.status(400).json({success: false, message: 'Missing required fields'});
        };
        const bill = await Bill.findOne({where: {public_token: token}});
        if(!bill) {
            return res.status(404).json({success: false, message: 'Bill not found'});
        };
        if(bill.status === 'closed') {
            return res.status(400).json({success: false, message: 'Cannot add participant to a closed bill'});
        };
        const participant = await Participant.create({bill_id: bill.id, name, amount_paid});
        return res.status(201).json({success: true, message: 'Participant added successfully'});
        } catch (error) {
        console.error(`Error adding participant: ${error}`);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
};

export const get_participant_by_bill_id = async (req, res) => {
    try {
        const {token} = req.params;
        if(!token) {
            return res.status(400).json({success: false, message: 'Missing required fields'});
        };
        const bill = await Bill.findOne({where: {public_token: token}});
        if(!bill) {
            return res.status(404).json({success: false, message: 'Bill not found'});
        };
        const participants = await Participant.findAll({where: {bill_id: bill.id}});
        if(!participants || participants.length === 0) {
            return res.status(404).json({success: false, message: 'No participants found for this bill'});
        };
        return res.status(200).json({success: true, message: 'Participants found', data: participants});
    } catch (error) {
        console.error(`Error fetching participant: ${error}`);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
};

export const update_participant = async (req, res) => {
    try {
        const {id} = req.params;
        const {name, amount_paid} = req.body;
        if(!id || !name || !amount_paid) {
            return res.status(400).json({success: false, message: 'Missing required fields'});
        };
        const participant = await Participant.findByPk(id);
        if(!participant) {
            return res.status(404).json({success: false, message: 'Participant not found'});
        };
        const updated_participant = await participant.update({name, amount_paid});
        return res.status(200).json({success: true, message: 'Participant updated successfully'});
    } catch (error) {
        console.error(`Error updating participant: ${error}`);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
};

export const calculate_participants_bill_balance = async (req, res) => {
    try {
        const {token} = req.params;
        if(!token) {
            return res.status(400).json({success: false, message: 'Missing required fields'});
        };
        const bill = await Bill.findOne({where: {public_token: token}});
        if(!bill) {
            return res.status(404).json({success: false, message: 'Bill not found'});
        };
        const participants = await Participant.findAll({where: {bill_id: bill.id}});
        if(!participants || participants.length === 0) {
            return res.status(404).json({success: false, message: 'No participants found for this bill'});
        };
        const bill_total = bill.bill_total;
        const average_amount = bill_total / participants.length;
        for (const participant of participants) {
            const balace = average_amount - participant.amount_paid;
            await participant.update({balance: balace});
        };
        return res.status(200).json({success: true, message: 'Participants bill balance calculated successfully'});
    } catch (error) {
        console.error(`Error calculating participant's bill balance: ${error}`);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
};

export const delete_participant = async (req, res) => {
    try {
        const {id} = req.params;
        if(!id) {
            return res.status(400).json({success: false, message: 'Missing required fields'});
        };
        const participant = await Participant.findByPk(id);
        if(!participant) {
            return res.status(404).json({success: false, message: 'Participant not found'});
        };
        await participant.destroy();
        return res.status(200).json({success: true, message: 'Participant deleted successfully'});
    } catch (error) {
        console.error(`Error deleting participant: ${error}`);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
};
