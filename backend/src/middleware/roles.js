function admin(req, res, next) {
    if (!req.user.roles.includes("admin")) return res.status(403).send({
        ok: false,
        error: "Access denied."
    });

    next();
}

function user(req, res, next) {
    if (!req.user.roles.includes("user")) return res.status(403).send({
        ok: false,
        error: "Access denied."
    });

    next();
}



module.exports = { admin, user };