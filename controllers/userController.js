import { PrismaClient } from '@prisma/client';
import { decodeToken } from '../common/common.js';

const prisma = new PrismaClient();

const userController = {
    getAllUsers: async (req, res) => {
        try {
            const users = await prisma.user.findMany({
                select: {
                    username: true,
                    email: true,
                    userAddress: {
                        select: {
                            address: true,
                            isDefault: true,
                            addressFK: {
                                include: {
                                    address: false,
                                },
                            },
                        },
                    },
                },
            });
            res.status(200).json({ msg: 'success', data: users });
        } catch (e) {
            res.status(500).json({ error: 'An error occurred while updating the user.' });
        }
    },
    updateUser: async (req, res) => {
        try {
            const { email, address, addressDetails, isDefault, address_id } = req.body;
            const user = decodeToken(req, res);
            const checkUserExist = await prisma.user.findUnique({
                where: {
                    id: parseInt(user.id),
                },
            });

            if (!checkUserExist) {
                return res.status(404).json({ error: 'User not found.' });
            }

            const updatedUser = await prisma.user.update({
                where: {
                    id: parseInt(user.id),
                },
                data: {
                    email: email,
                },
                select: {
                    username: true,
                    email: true,
                    admin: true,
                },
            });

            const updateUserAddress = await prisma.userAddress.update({
                where: {
                    userId_addressesId: {
                        userId: user.id,
                        addressesId: address_id,
                    },
                },
                data: {
                    address: address,
                    isDefault: isDefault,
                },
                select: {
                    address: true,
                    isDefault: true,
                },
            });

            const updateAddress = await prisma.address.update({
                where: {
                    id: parseInt(address_id),
                },
                data: {
                    addressDetails: addressDetails,
                },
                select: {
                    addressDetails: true,
                },
            });

            res.status(200).json({ msg: 'success', data: { updatedUser, updateUserAddress, updateAddress } });
        } catch (e) {
            console.log('error', e);
            res.status(500).json({ error: 'An error occurred while updating the user.' });
        }
    },
};

export default userController;
