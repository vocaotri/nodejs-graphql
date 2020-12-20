const Category = require("../../models/category");
module.exports = {
  categories: async () => {
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

  createCategory: async (args) => {
    try {
      const { name } = args.category;
      const category = new Category({
        name,
      });
      const newCategory = await category.save();
      return { ...newCategory._doc, _id: newCategory.id };
    } catch (error) {
      throw error;
    }
  },

  updateCategory: async (args) => {
    try {
      const { _id, name } = args.category;
      const category = await Category.findById(_id);
      category.name = name;
      const newCategory = await category.save();
      return { ...newCategory._doc, _id: newCategory.id };
    } catch (error) {
      throw error;
    }
  },
};
