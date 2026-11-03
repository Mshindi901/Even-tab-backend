import Bill from './schema.js';
import crypto from 'crypto';

export const create_bill = async (req, res) => {
    try {
        const user_id = req.user.id;
        const {description, title, currency, bill_total} = req.body;
        const total = Number(bill_total);
        if(!title?.trim() || !currency?.trim() || !Number.isFinite(total) || total <= 0) {
            return res.status(400).json({success: false, message: 'Title, currency, and bill total are required'});
        };
        const public_token = crypto.randomBytes(32).toString('hex');
        const bill = await Bill.create({user_id, description, title: title.trim(), currency: currency.trim(), bill_total: total, public_token});
        return res.status(201).json({success: true, message: 'Bill created successfully', data: bill});
    } catch (error) {
        console.error(`Error creating bill: ${error}`);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
};

export const get_bills_by_user_id = async (req, res) => {
    try {
        const user_id = req.user.id;
        const bills = await Bill.findAll({where: {user_id}, order: [['createdAt', 'DESC']]});
        return res.status(200).json({success: true, message: 'Bills fetched successfully', data: bills});
    } catch (error) {
        console.error(`Error fetching bills by user ID: ${error}`);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
};
export const get_bill_by_id = async (req, res) => {
    try {
        const {id} = req.params;
        const bill = await Bill.findOne({where: {id, user_id: req.user.id}});
        if(!bill) {
            return res.status(404).json({success: false, message: 'Bill not found'});
        };
        return res.status(200).json({success: true, data: bill});
    } catch (error) {
        console.error(`Error fetching bill by ID: ${error}`);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
};

export const update_bill = async (req, res) => {
    try {
        const {id} = req.params;
        const {title, currency, status, bill_total} = req.body;
        const bill = await Bill.findOne({where: {id, user_id: req.user.id}});
        if(!bill) {
            return res.status(404).json({success: false, message: 'Bill not found'});
        };
        const updates = {};
        if (title !== undefined) {
            if (typeof title !== 'string' || !title.trim()) {
                return res.status(400).json({success: false, message: 'Title cannot be empty'});
            }
            updates.title = title.trim();
        }
        if (currency !== undefined) {
            if (typeof currency !== 'string' || !currency.trim()) {
                return res.status(400).json({success: false, message: 'Currency cannot be empty'});
            }
            updates.currency = currency.trim();
        }
        if (status !== undefined) {
            if (!['open', 'closed'].includes(status)) {
                return res.status(400).json({success: false, message: 'Status must be open or closed'});
            }
            updates.status = status;
        }
        if (bill_total !== undefined) {
            const total = Number(bill_total);
            if (!Number.isFinite(total) || total <= 0) {
                return res.status(400).json({success: false, message: 'Bill total must be greater than zero'});
            }
            updates.bill_total = total;
        }
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({success: false, message: 'Provide at least one field to update'});
        }
        await bill.update(updates);
        return res.status(200).json({success: true, message: 'Bill updated successfully', data: bill});
    } catch (error) {
        console.error(`Error updating bill: ${error}`);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
};

export const delete_bill = async (req, res) => {
    try {
        const {id} = req.params;
        const bill = await Bill.findOne({where: {id, user_id: req.user.id}});
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