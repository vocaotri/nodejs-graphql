const Article = require("../../models/article");
const Category = require("../../models/category");
module.exports = {
  articles: async (root) => {
    try {
      const { skip, first } = root;
      const articlesFetched = await Article.find()
        .limit(first ?? 10)
        .skip(skip ?? 0)
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

  createArticle: async (args) => {
    try {
      const { category, title, body } = args.article;
      const article = new Article({
        category,
        title,
        body
      });
      const newArticle = await article.save();
      const getCategory = await Category.findById(category);
      if(!getCategory.articles.includes(newArticle._id) || getCategory.articles.length === 0){
        getCategory.articles.push(newArticle._id)
        getCategory.save();
      }
      const result = newArticle._doc;
      result.category = getCategory._doc;
      return { ...result, _id: newArticle.id };
    } catch (error) {
      throw error;
    }
  },

  updateArticle: async (args) => {
    try {
      const { _id, title, body, category } = args.article;
      const article = await Article.findById(_id);
      article.title = category;
      article.title = title;
      article.body = body;
      const newArticle = await article.save();
      return { ...newArticle._doc, _id: newArticle.id };
    } catch (error) {
      throw error;
    }
  },
};
