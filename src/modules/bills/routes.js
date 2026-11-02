import express from 'express';
import  {
    create_bill,
    get_bill_by_id,
    get_all_bills,
    update_bill,
    delete_bill
} from './controller.js';

const router = express.Router();

router.post('/bills', create_bill);
router.get('/bills/:id', get_bill_by_id);
router.get('/bills', get_all_bills);
router.put('/bills/:id', update_bill);
router.delete('/bills/:id', delete_bill);

export default router;