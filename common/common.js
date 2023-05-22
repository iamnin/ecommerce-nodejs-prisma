import jwt from 'jsonwebtoken';

export const decodeToken = (req, res) => {
    let tmpUser = {}
    const refreshToken = req.headers.cookie.split('=')[1];
    if (!refreshToken) {
        return res.status(401).json({ msg: "You're not authenticated" });
    }

    jwt.verify(refreshToken, process.env.MY_SECRETKEY, (err, user) => {
        if (err) {
            console.log(err);
        }
        tmpUser = user
    });

    return tmpUser
}