import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();

let refreshTokens = [];

const authController = {
    registerUser: async (req, res) => {
        try {
            const salt = await bcrypt.genSaltSync(10);
            const hased = await bcrypt.hashSync(req.body.password, salt);

            const newUSer = await prisma.user.create({
                data: {
                    username: req.body.username,
                    email: req.body.email,
                    password: hased,
                    userAddress: {
                        create: [
                            {
                                address: req.body.address,
                                isDefault: req.body.isDefault ? 0 : 1,
                            },
                        ],
                    },
                },
            });
            res.status(200).json({ msg: 'success', data: newUSer });
        } catch (error) {
            console.log('error', error);
        }
    },
    generateAccessToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                admin: user.admin,
            },
            process.env.MY_SECRETKEY,
            {
                expiresIn: '1d',
            },
        );
    },
    generateRefreshToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                admin: user.admin,
            },
            process.env.MY_SECRETKEY,
            { expiresIn: '365d' },
        );
    },
    loginUser: async (req, res) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    username: req.body.username,
                },
            });
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                return res.status(404).json({ msg: 'Wrong password' });
            }
            if (user && validPassword) {
                const accessToken = authController.generateAccessToken(user);
                const refreshToken = authController.generateRefreshToken(user);
                refreshTokens.push(refreshToken);
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict',
                });
                const { password, ...other } = user;
                res.status(200).json({ msg: 'success', data: { ...other, accessToken } });
            }
        } catch (error) {
            res.status(500).json({ msg: 'error', data: { error: error } });
        }
    },
    requestRefreshToken: async (req, res) => {
        const refreshToken = req.headers.cookie.split('=')[1];
        if (!refreshToken) {
            return res.status(401).json({ msg: "You're not authenticated" });
        }
        if (!refreshTokens.includes(refreshToken)) {
            return res.status(403).json({ msg: 'Refresh token is not valid' });
        }
        jwt.verify(refreshToken, process.env.MY_SECRETKEY_REFRESH, (err, user) => {
            if (err) {
                console.log(err);
            }
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
            const newAccessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);
            refreshTokens.push(newRefreshToken);
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'strict',
            });
            res.status(200).json({ accessToken: newAccessToken });
        });
    },
    userLogout: async (req, res) => {
        res.clearCookie('refreshToken');
        res.status(200).json({ msg: 'Logged out' });
    },
};

export default authController;
