// users.router.js
import { Router } from 'express';
import passport from 'passport';
import { userPremium } from '../../service/users.service.js';

const router = Router();
router.get('/premium/:id', userPremium);

export default router;