import express from 'express';
import {
    add_participant,
    get_participant_by_bill_id,
    update_participant,
    calculate_participants_bill_balance,
    delete_participant
} from './controller.js';

const router = express.Router();

router.post('/participants/:token/join', add_participant);
router.get('/participants/:token', get_participant_by_bill_id);
router.put('/participants/:id', update_participant);
router.get('/participants/:token/balance', calculate_participants_bill_balance);
router.delete('/participants/:id', delete_participant);

export default router;