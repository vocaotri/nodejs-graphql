const Category = require("../../models/category");
const authJWT = require('../../util/function');
module.exports = {
    categories: async() => {
        try {
            const categoryFetched = await Category.find().populate("articles");
            console.log(categoryFetched);
            return categoryFetched.map((category) => {
                return {
                    ...category._doc,
                    _id: category.id,
                    createdAt: new Date(category._doc.createdAt).toISOString(),
                };
            });
        } catch (error) {
            throw error;
        }
    },

    createCategory: async(args, context) => {
        try {
            const { name } = args.category;
            const category = new Category({
                name,
            });
            const token = context.headers.authorization.split(" ")[1];
            const user = await authJWT.verifyAccessToken(token);
            if (Object.keys(user).length > 0) {
                const newCategory = await category.save();
                return {...newCategory._doc, _id: newCategory.id };
            } else
                throw new Error("Token failed")

        } catch (error) {
            throw error;
        }
    },

    updateCategory: async(args) => {
        try {
            const { _id, name } = args.category;
            const category = await Category.findById(_id);
            category.name = name;
            const newCategory = await category.save();
            return {...newCategory._doc, _id: newCategory.id };
        } catch (error) {
            throw error;
        }
    },
};