const Category = require('../models/category');
const Item = require('../models/item');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

//All items
exports.items = asyncHandler(async (req, res) => {
	const items = await Item.find()
		.populate('category')
		.sort({ name: 1 })
		.exec();

	res.render('items', { title: 'All items', items: items });
});

//Show item
exports.open_item = asyncHandler(async (req, res) => {
	const item = await Item.findById(req.params.id).populate('category').exec();

	res.render('item', { title: item.name, item });
});

//Create item - show form
exports.show_item_form = asyncHandler(async (req, res) => {
	const categories = await Category.find().sort({ name: 1 }).exec();
	res.render('item_form', { title: 'Create item', categories: categories });
});
//Create
exports.create_item = [
	//Validate and sanitize
	body('name', 'Name must not be empty.')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('description', 'Description must not be empty.')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('category', 'Category must not be empty.')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('price', 'Price must not be empty.')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('inStock', 'In stock field must not be empty.')
		.trim()
		.isLength({ min: 1 })
		.escape(),

	asyncHandler(async (req, res) => {
		const errors = validationResult(req);

		const item = new Item({
			name: req.body.name,
			description: req.body.description,
			category: req.body.category,
			price: req.body.price,
			inStock: req.body.inStock,
		});

		if (!errors.isEmpty()) {
			const categories = await Category.find().sort({ name: 1 }).exec();

			res.render('item_form', {
				title: 'Create item',
				item: item,
				categories: categories,
				errors: errors.array(),
			});
		} else {
			await item.save();
			res.redirect(item.url);
		}
	}),
];

//Update item
//Show form
exports.show_update_form = asyncHandler(async (req, res) => {
	const [item, categories] = await Promise.all([
		Item.findById(req.params.id).exec(),
		Category.find().sort({ name: 1 }).exec(),
	]);
	res.render('item_form', {
		title: 'Update item',
		categories: categories,
		item: item,
	});
});

//Update
exports.update_item = [
	//Validate and sanitize
	body('name', 'Name must not be empty.')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('description', 'Description must not be empty.')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('category', 'Category must not be empty.')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('price', 'Price must not be empty.')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('inStock', 'In stock field must not be empty.')
		.trim()
		.isLength({ min: 1 })
		.escape(),

	asyncHandler(async (req, res) => {
		const errors = validationResult(req);

		const item = new Item({
			name: req.body.name,
			description: req.body.description,
			category: req.body.category,
			price: req.body.price,
			inStock: req.body.inStock,
			_id: req.params.id,
		});

		if (!errors.isEmpty()) {
			const categories = await Category.find().sort({ name: 1 }).exec();

			res.render('item_form', {
				title: 'Create item',
				item: item,
				categories: categories,
				errors: errors.array(),
			});
		} else {
			const updatedItem = await Item.findByIdAndUpdate(
				req.params.id,
				item,
				{}
			);
			res.redirect(updatedItem.url);
		}
	}),
];

//Delete item
//Show form
exports.show_delete_form = asyncHandler(async (req, res) => {
	const item = await Item.findById(req.params.id).exec();

	if (!item) {
		res.redirect('/items');
	} else {
		res.render('item_delete', {
			title: 'Delete item',
			item: item,
		});
	}
});

//Delete
exports.delete_item = asyncHandler(async (req, res) => {
	const item = await Item.findById(req.params.id).exec();

	if (!item) {
		res.redirect('/items');
	} else {
		await Item.findByIdAndDelete(req.body.itemId).exec();
		res.redirect('/items');
	}
});
