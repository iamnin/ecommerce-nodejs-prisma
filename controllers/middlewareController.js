import jwt from 'jsonwebtoken';

const middlewareController = {
    // verify token

    verifyToken: (req, res, next) => {
        const token = req.headers.authorization;
        if (token) {
            const accessToken = token.split(' ')[1];
            jwt.verify(accessToken, process.env.MY_SECRETKEY, (err, user) => {
                if (err) {
                    return res.status(403).json({ msg: 'Token is node valid' });
                }
                req.user = user;
                next();
            });
        } else {
            res.status(401).json({ msg: "You're not authenticated" });
        }
    },

    verifyTokenAndAdminAuth: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            if (req.user.id === req.params.id || req.user.admin) {
                next();
            } else {
                return res.status(403).json({ msg: 'You are not allowed to delete other' });
            }
        });
    },
};

export default middlewareController;
