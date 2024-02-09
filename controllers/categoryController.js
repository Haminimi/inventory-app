const Category = require('../models/category');
const Item = require('../models/item');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

//Index
exports.index = asyncHandler(async (req, res) => {
	const categories = await Category.find().sort({ name: 1 }).exec();

	res.render('index', { title: 'Homepage', categories: categories });
});

//Category
exports.open_category = asyncHandler(async (req, res) => {
	const [category, itemsInCategory] = await Promise.all([
		Category.findById(req.params.id).exec(),
		Item.find({ category: req.params.id }).sort({ name: 1 }).exec(),
	]);

	res.render('category', {
		title: category.name,
		category: category,
		items: itemsInCategory,
	});
});
