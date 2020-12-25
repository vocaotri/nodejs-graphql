const Article = require("../../models/article");
const Category = require("../../models/category");
const authJWT = require('../../utils/JWTToken');
module.exports = {
    articles: async(root) => {
        try {
            const {
                skip,
                first
            } = root;
            const articlesFetched = await Article.find()
                .limit(first ? first : 10)
                .skip(skip ? skip : 0)
                .populate("category");
            return articlesFetched.map((article) => {
                return {
                    ...article._doc,
                    _id: article.id,
                    createdAt: new Date(article._doc.createdAt).toISOString(),
                };
            });
        } catch (error) {
            throw error;
        }
    },

    createArticle: async(args, context) => {
        try {
            const {
                category,
                title,
                body
            } = args.article;
            const article = new Article({
                category,
                title,
                body
            });
            const token = context.headers.authorization.split(" ")[1];
            const user = await authJWT.verifyAccessToken(token);
            if (Object.keys(user).length === 0) {
                throw new Error("Token failed")
            }
            const newArticle = await article.save();
            const getCategory = await Category.findById(category);
            if (!getCategory.articles.includes(newArticle._id) || getCategory.articles.length === 0) {
                getCategory.articles.push(newArticle._id)
                getCategory.save();
            }
            const result = newArticle._doc;
            result.category = getCategory._doc;
            return {
                ...result,
                _id: newArticle.id
            };
        } catch (error) {
            throw error;
        }
    },

    updateArticle: async(args, context) => {
        try {
            const {
                _id,
                title,
                body,
                category
            } = args.article;
            const article = await Article.findById(_id);
            article.title = category;
            article.title = title;
            article.body = body;
            const token = context.headers.authorization.split(" ")[1];
            const user = await authJWT.verifyAccessToken(token);
            if (Object.keys(user).length === 0) {
                throw new Error("Token failed")
            }
            const newArticle = await article.save();
            return {
                ...newArticle._doc,
                _id: newArticle.id
            };
        } catch (error) {
            throw error;
        }
    },
};