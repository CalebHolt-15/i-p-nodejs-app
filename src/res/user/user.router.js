import { Router } from 'express';
import controllers, { profile, update } from './user.controllers.js';

const router = Router();

router.route('/').get(profile).put(update);

export default router;
