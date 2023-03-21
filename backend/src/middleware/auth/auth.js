const trainerService = require('../../services/trainer-service');

module.exports = async (req, res, next) => {
    const trainerId = req.signedCookies.id;

    if (!trainerId) {
        return res.status(401).send({
            ok: false,
            error: "Access denied. No cookie provided"
        });
    }

    try {
        const trainer = await trainerService.getDocumentById(trainerId);
        if (!trainer) {
            return res.status(401).send({
                ok: false,
                error: "Invalid trainer ID"
            });
        }
        req.trainer = trainer;
    } catch (error) {
        return res.status(401).send({
            ok: false,
            error: "Error fetching trainer"
        });
    }

    next();
}
