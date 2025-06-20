import catchAsync from '../utils/catchAsync.js';
import models from '../db/models/index.js';
import commonValidators from '../validators/commonValidators.js';
import AppError from '../utils/appError.js';

const submit_attempt = catchAsync(async (req, res, next) => {
    // Validate required fields
    const validation = commonValidators.validate_required_keys(req.body, ['username', 'score']);
    if (!validation.isValid)
        throw new AppError(validation.message, 400);

    const { username, score } = req.body;
    if (typeof score !== 'number' && typeof score !== 'bigint') {
        throw new AppError('Score must be a number', 400);
    }

    // Case-insensitive username search
    const existing = await models.leaderboard.findOne({
        where: models.Sequelize.where(
            models.Sequelize.fn('lower', models.Sequelize.col('username')),
            '=',
            username.toLowerCase()
        )
    });

    if (existing) {
        if (BigInt(score) > BigInt(existing.score)) {
            existing.score = score;
            await existing.save();
            return res.status(200).json({
                status: 'success',
                message: 'Score updated',
                data: { username: existing.username, score: existing.score }
            });
        } else {
            return res.status(200).json({
                status: 'success',
                message: 'Existing score is higher or equal, not updated',
                data: { username: existing.username, score: existing.score }
            });
        }
    } else {
        const created = await models.leaderboard.create({ username, score });
        return res.status(201).json({
            status: 'success',
            message: 'Leaderboard entry created',
            data: { username: created.username, score: created.score }
        });
    }
});

const get_leaderboard = catchAsync(async (req, res, next) => {
    const entries = await models.leaderboard.findAll({
        order: [['score', 'DESC']]
    });
    return res.status(200).json({
        status: 'success',
        data: entries
    });
});

export default {
    submit_attempt,
    get_leaderboard
};
