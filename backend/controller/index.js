import { Router } from 'express';
import testController from './dynamoDBController.js';

const router = Router();

router.use('/', testController);

export default router;
