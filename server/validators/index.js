const { validationResult } = require('express-validator');

//next here is a callback function that is applied to middleware in the route
exports.runValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }
    next();
};