const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        const user = await User.findById(req.session.userID).exec();
        if (!user) {
            return res.redirect('/login');
        }
        next();
    } catch (error) {
        console.error(error);
        return res.redirect('/login');
    }
};
