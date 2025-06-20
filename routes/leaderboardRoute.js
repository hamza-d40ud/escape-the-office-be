import leaderboardController from '../controllers/leaderboardController.js';
import express from 'express';
import middlewares from '../middlewares.js';

const router = express.Router();

router.post('/submit-attempt', middlewares.rateLimiter, leaderboardController.submit_attempt);
router.get('/', middlewares.rateLimiter, leaderboardController.get_leaderboard);

export default { router };