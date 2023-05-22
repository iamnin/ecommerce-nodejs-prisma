//
import { PrismaClient } from '@prisma/client';
import { createCategory } from '../services/categories/categoriesService.js';
const prisma = new PrismaClient();
//

const categoriesController = {
    createCategory: async (req, res) => {
        const { categoryName, parentCategoryId } = req.body;

        if (parentCategoryId) {
            const parentCategory = await prisma.category.findUniqueOrThrow({
                where: {
                    id: parentCategoryId,
                },
                select: {
                    categoryName: true,
                    parentCategoryId: true || null,
                },
            });

            if (!parentCategory) {
                return res.status(404).json({ error: 'Parent category not found' });
            }
        }

        const categoryData = await createCategory({
            categoryName: categoryName,
            parentCategoryId: parentCategoryId ? parseInt(parentCategoryId) : 0,
        });

        res.status(200).json({ msg: 'success', data: categoryData });
    },

    // UPDATE PROMOTION
    createPromotion: async (req, res) => {
        try {
            const { name, description, discountRate, startDate, endDate, id } = req.body;

            const checkCategoryExists = await prisma.category.findUnique({
                where: {
                    id: parseInt(id),
                },
            });

            if (!checkCategoryExists) {
                res.status(400).json({ error: 'Category not found' });
            }

            const createPromotinoFirst = await prisma.promotion.create({
                data: {
                    name: name,
                    description: description,
                    discountRate: discountRate,
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                },
            });

            const createPromotion = await prisma.promotionCategory.create({
                data: {
                    categoryId: parseInt(id),
                    promotionId: parseInt(createPromotinoFirst?.id),
                },
            });
            res.status(200).json({ msg: 'success', data: { createPromotion, createPromotinoFirst } });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },

    //  GET ALL CATEGORIES

    getAllCategories: async (req, res) => {
        try {
            const categories = await prisma.category.findMany();
            res.status(200).json({ msg: 'success', data: categories });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },

    // UPDATE CATEGORY
    updateCategory: async (req, res) => {
        try {
            const { id } = req.params;

            const checkCategoryExists = await prisma.category.findUnique({
                where: {
                    id: parseInt(id),
                },
            });

            if (!checkCategoryExists) {
                res.status(404).json({ msg: 'Category not found' });
            }

            if (!req.body.parentCategoryId) {
                const updateCategory = await prisma.category.update({
                    where: {
                        id: parseInt(id),
                    },
                    data: {
                        categoryName: req.body.categoryName,
                    },
                });
                res.status(200).json({ msg: 'success', data: updateCategory });
            }
            if (req.body.parentCategoryId) {
                const updateCategory = await prisma.category.update({
                    where: {
                        id: parseInt(id),
                    },
                    data: {
                        categoryName: req.body.categoryName,
                        parentCategoryId: parseInt(req.body.parentCategoryId),
                    },
                });
                res.status(200).json({ msg: 'success', data: updateCategory });
            }
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },

    // DELETE CATEGORY

    deleteCategory: async (req, res) => {
        try {
            const { id } = req.params;

            const checkCategoryExists = await prisma.category.findUnique({
                where: {
                    id: parseInt(id),
                },
            });

            if (!checkCategoryExists) {
                res.status(404).json({ msg: 'Category not found' });
            }

            await prisma.category.delete({
                where: {
                    id: parseInt(id),
                },
            });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },
};

export default categoriesController;
