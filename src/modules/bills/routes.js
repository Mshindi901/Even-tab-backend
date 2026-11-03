import express from 'express';
import  {
    create_bill,
    get_bill_by_id,
    get_bills_by_user_id,
    update_bill,
    delete_bill
} from './controller.js';
import {authenticate} from '../../middleware/auth.js';

const router = express.Router();

router.post('/bills', authenticate, create_bill);
router.get('/bills/:id', authenticate, get_bill_by_id);
router.get('/bills', authenticate, get_bills_by_user_id);
router.put('/bills/:id', authenticate, update_bill);
router.delete('/bills/:id', authenticate, delete_bill);

export default router;