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

//Create category - show form
exports.show_form = asyncHandler(async (req, res) => {
	res.render('category_form', { title: 'Create category' });
});
//Create
exports.create_category = [
	//Validate and sanitize
	body('name', 'Name must not be empty.')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('description', 'Description must not be empty.')
		.trim()
		.isLength({ min: 1 })
		.escape(),

	asyncHandler(async (req, res) => {
		const errors = validationResult(req);

		const category = new Category({
			name: req.body.name,
			description: req.body.description,
		});

		if (!errors.isEmpty()) {
			res.render('category_form', {
				title: 'Create category',
				category: category,
			});
		} else {
			await category.save();
			res.redirect(category.url);
		}
	}),
];
