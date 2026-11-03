import User from "./schema.js";
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();


export const sign_up = async (req, res) => {
    try {
        const username = req.body.username?.trim();
        const email = req.body.email?.trim().toLowerCase();
        const { password } = req.body;
        if (!username || !email || typeof password !== 'string' || password.length < 8) {
            return res.status(400).json({success: false, message: 'Missing required fields'});
        };
        const is_user = await User.findOne({where: {email}});
        if(is_user) {
            return res.status(409).json({success: false, message: 'An account with this email already exists'});
        };
        const password_hash = await bcrypt.hash(password, 12);
        const new_user = await User.create({
            username,
            email,
            password: password_hash
        });
        const token = jwt.sign(
            {id: new_user.id, user_id: new_user.id, email: new_user.email, role: new_user.role},
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );
        return res.status(201).json({success: true, message: 'User created successfully', token});
    } catch(error) {
        console.error(`Error in sign_up: ${error}`);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
};

export const sign_in = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();
        const { password } = req.body;
        if (!email || typeof password !== 'string' || !password) {
            return res.status(400).json({success: false, message: 'Missing required fields'});
        };
        const user = await User.findOne({where: {email}});
        if(!user) {
            return res.status(401).json({success: false, message: 'Invalid email or password'});
        };
        const is_password_valid = await bcrypt.compare(password, user.password);
        if(!is_password_valid) {
            return res.status(401).json({success: false, message: 'Invalid email or password'});
        };
        const token = jwt.sign(
            {id: user.id, user_id: user.id, email: user.email, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );

        return res.status(200).json({success: true, message: 'User signed in successfully', token: token});
    } catch (error) {
        console.error(`Error in sign_in: ${error}`);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
};

export const admin_sign_up = async (req, res) => {
    try {
        const username = req.body.username?.trim();
        const email = req.body.email?.trim().toLowerCase();
        const { password } = req.body;
        if (!username || !email || typeof password !== 'string' || password.length < 8) {
            return res.status(400).json({success: false, message: 'Missing required fields'});
        };
        const is_user = await User.findOne({where: {email}});
        if(is_user) {
            return res.status(409).json({success: false, message: 'An account with this email already exists'});
        };
        const password_hash = await bcrypt.hash(password, 12);
        await User.create({
            username,
            email,
            password: password_hash,
            role: 'admin'
        });
        return res.status(201).json({success: true, message: 'Admin user created successfully'});
    } catch (error) {
        console.error(`Error in admin_sign_up: ${error}`);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
};

export const get_all_users = async (req, res) => {
    try {
        const users = await User.findAll({attributes: {exclude: ['password']}});
        if(!users || users.length === 0) {
            return res.status(404).json({success: false, message: 'No users found'});
        };
        return res.status(200).json({success: true, message: 'Users retrieved successfully', data: users});
    } catch (error) {
        console.error(`Error in get all users: ${error}`);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
};

export const update_user = async (req, res) => {
    try {
        const {id} = req.params;
        if (req.user.role !== 'admin' && id !== req.user.id) {
            return res.status(403).json({success: false, message: 'Access denied'});
        };
        const { username, email, password } = req.body;
        const user = await User.findByPk(id);
        if(!user){
            return res.status(404).json({success: false, message: 'Invalid ID'});
        };
        const updates = {};
        if (username !== undefined) updates.username = username.trim();
        if (email !== undefined) updates.email = email.trim().toLowerCase();
        if (password !== undefined) {
            if (typeof password !== 'string' || password.length < 8) {
                return res.status(400).json({success: false, message: 'Password must be at least 8 characters'});
            }
            updates.password = await bcrypt.hash(password, 12);
        }
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({success: false, message: 'Provide at least one field to update'});
        }
        await user.update(updates);
        return res.status(200).json({success: true, message: 'User updated successfully'});
    } catch (error) {
        console.error(`Error in update_user: ${error}`);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
};

export const delete_user = async (req, res) => {
    try {
        const {id} = req.params;
        if(!id){
            return res.status(400).json({success: false, message: 'Provide record id'})
        };
        if (req.user.role !== 'admin' && id !== req.user.id) {
            return res.status(403).json({success: false, message: 'Access denied'});
        }
        const user = await User.findByPk(id);
        if(!user){
            return res.status(404).json({success: false, message: 'Invalid ID'});
        };
        await user.destroy();
        return res.status(200).json({success: true, message: 'User deleted successfully'});
    } catch (error) {
        console.error(`Error in delete_user: ${error}`);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
};
