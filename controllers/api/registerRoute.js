const { User } = require('../../models');

exports.registerUser = async (req, res) => {
    try {
        const userData = await User.create(req.body);

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.redirect('/');
        });
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            const isEmailError = err.errors.some(error => error.path === 'email');
            if (isEmailError) {
                res.status(409).render('error409', { message: 'An account with the given email already exists. Please use a different email.' });

            }
        }
        // Handle other errors generically
        console.error('Unexpected error occurred:', err);
        res.status(500).render('error500', {
            message: 'An unexpected error occurred. Please try again later.'
        });
    }
};
