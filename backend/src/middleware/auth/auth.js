const trainerService = require('../../services/trainer-service');

module.exports = async (req, res, next) => {
    const trainerId = req.signedCookies.trainerId;
    const refreshToken = req.cookies.refreshToken;

    if (!trainerId && !refreshToken) {
        return res.status(401).send({
            ok: false,
            error: "Access denied. No cookies provided",
        });
    }

    try {
        if (!trainerId && refreshToken) {
            const refreshTokenDoc = await trainerService.validateRefreshToken(refreshToken);
            const newTrainerId = refreshTokenDoc.trainerId;

            // Get the device identifier (User-Agent header in this case)
            const device = req.headers['user-agent'] || 'unknown';

            // Create a new refresh token for the specific device
            const newRefreshToken = await trainerService.createRefreshToken(newTrainerId, device);

            // Set the cookies
            res.cookie('trainerId', newTrainerId, {
                signed: true,
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000, // 1 day
                secure: process.env.NODE_ENV === 'production',
            });

            res.cookie('refreshToken', newRefreshToken.token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                secure: process.env.NODE_ENV === 'production',
            });

            req.signedCookies.trainerId = newTrainerId;
        }

        const trainer = await trainerService.getDocumentById(req.signedCookies.trainerId);
        if (!trainer) {
            return res.status(401).send({
                ok: false,
                error: "Invalid trainer ID",
            });
        }
        req.trainer = trainer;
    } catch (error) {
        return res.status(401).send({
            ok: false,
            error: "Error fetching trainer",
        });
    }

    next();
};
