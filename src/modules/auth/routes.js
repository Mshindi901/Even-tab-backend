import express from "express";
import {
    sign_up,
    sign_in,
    admin_sign_up,
    get_all_users,
    update_user,
    delete_user
} from './controller.js';
import {authenticate, authorize} from '../../middleware/auth.js';

const router = express.Router();

router.post('/sign_up', sign_up);
router.post('/sign_in', sign_in);
router.post('/admin_sign_up', authenticate, authorize('admin'), admin_sign_up);
router.get('/users', authenticate, authorize('admin'), get_all_users);
router.put('/users/:id', authenticate, authorize('admin', 'user'), update_user);
router.delete('/users/:id', authenticate, authorize('admin', 'user'), delete_user);

export default router;