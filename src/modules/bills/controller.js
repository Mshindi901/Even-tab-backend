import Bill from './schema.js';
import crypto from 'crypto';

export const create_bill = async (req, res) => {
    try {
        const user_id = req.user.id;
        if(!user_id) {
            return res.status(400).json({success: false, message: 'Please Login to create a bill'});
        };
        const {description, title, currency, bill_total} = req.body;
        if(!title || !currency || !bill_total) {
            return res.status(400).json({success: false, message: 'Title, currency, and bill total are required'});
        };
        const public_token = crypto.randomBytes(32).toString('hex');
        const bill = await Bill.create({user_id, description, title, currency, bill_total, public_token});
        return res.status(201).json({success: true, message: 'Bill created successfully'});
    } catch (error) {
        console.error(`Error creating bill: ${error}`);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
};

export const get_bills_by_user_id = async (req, res) => {
    try {
        const user_id = req.user.id;
        if(!user_id) {
            return res.status(400).json({success: false, message: 'Please Login to view your bills'});
        };
        const bills = await Bill.findAll({where: {user_id: user_id}});
        if(!bills || bills.length === 0) {
            return res.status(404).json({success: false, message: 'No bills found for this user'});
        };
        return res.status(200).json({success: true, message: 'Bills fetched successfully', data: bills});
    } catch (error) {
        console.error(`Error fetching bills by user ID: ${error}`);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
};
export const get_bill_by_id = async (req, res) => {
    try {
        const {id} = req.params;
        if(!id) {
            return res.status(400).json({success: false, message: 'Bill ID is required'});
        };
        const bill = await Bill.findByPk(id);
        if(!bill) {
            return res.status(404).json({success: false, message: 'Bill not found'});
        };
        return res.status(200).json({success: true, data: bill});
    } catch (error) {
        console.error(`Error fetching bill by ID: ${error}`);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
};

export const get_all_bills = async (req, res) => {
    try {
        const bills = await Bill.findAll();
        if(!bills || bills.length === 0) {
            return res.status(404).json({success: false, message: 'No bills found'});
        };
        return res.status(200).json({success: true, data: bills});
    } catch (error) {
        console.error(`Error fetching all bills: ${error}`);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
};

export const update_bill = async (req, res) => {
    try {
        const {id} = req.params;
        const {title, currency, status, bill_total} = req.body;
        if(!id) {
            return res.status(400).json({success: false, message: 'Bill ID is required'});
        };
        const bill = await Bill.findByPk(id);
        if(!bill) {
            return res.status(404).json({success: false, message: 'Bill not found'});
        };
        const updatedBill = await bill.update({title, currency, status, bill_total});
        return res.status(200).json({success: true, message: 'Bill updated successfully'});
    } catch (error) {
        console.error(`Error updating bill: ${error}`);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
};

export const delete_bill = async (req, res) => {
    try {
        const {id} = req.params;
        if(!id) {
            return res.status(400).json({success: false, message: 'Bill ID is required'});
        };
        const bill = await Bill.findByPk(id);
        if(!bill) {
            return res.status(404).json({success: false, message: 'Bill not found'});
        };
        await bill.destroy();
        return res.status(200).json({success: true, message: 'Bill deleted successfully'});
    } catch (error) {
        console.error(`Error deleting bill: ${error}`);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
};