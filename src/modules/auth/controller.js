import User from "./schema.js";
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();


export const sign_up = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({success: false, message: 'Missing required fields'});
        };
        const is_user = await User.findOne({where: {email: email}});
        if(is_user) {
            return res.status(400).json({success: false, message: 'User already exists'});
        };
        const password_hash = await bcrypt.hash(password, 12);
        const new_user = await User.create({
            username: username,
            email: email,
            password: password_hash
        });
        return res.status(201).json({success: true, message: 'User created successfully'});
    } catch(error) {
        console.error(`Error in sign_up: ${error}`);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
};

export const sign_in = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({success: false, message: 'Missing required fields'});
        };
        const user = await User.findOne({where: {email: email}});
        if(!user) {
            return res.status(400).json({success: false, message: 'User does not exist'});
        };
        const is_password_valid = await bcrypt.compare(password, user.password);
        if(!is_password_valid) {
            return res.status(400).json({success: false, message: 'Invalid password'});
        };
        const token = jwt.sign({user_id: user.id, email: user.email}, process.env.JWT_SECRET, {expiresIn: '1h'});

        return res.status(200).json({success: true, message: 'User signed in successfully', token: token});
    } catch (error) {
        console.error(`Error in sign_in: ${error}`);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
};

export const admin_sign_up = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({success: false, message: 'Missing required fields'});
        };
        const is_user = await User.findOne({where: {email: email}});
        if(is_user) {
            return res.status(400).json({success: false, message: 'User already exists'});
        };
        const password_hash = await bcrypt.hash(password, 12);
        const new_user = await User.create({
            username: username,
            email: email,
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
        const id = req.user.id;
        const { username, email, password } = req.body;
        if(!id){
            return res.status(400).json({success: false, message: 'Provide record id'})
        };
        const user = await User.findByPk(id);
        if(password){
            const password_hash = await bcrypt.hash(password, 12);
        }
        if(!user){
            return res.status(404).json({success: false, message: 'Invalid ID'});
        };
        const updated_user = await user.update({username: username, email: email, password: password_hash});
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
