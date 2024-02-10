const Category = require('../models/category');
const Item = require('../models/item');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const upload = require('../upload');

//Index
exports.index = asyncHandler(async (req, res) => {
	const [categories, numberOfCategories, numberOfItems] = await Promise.all([
		Category.find().sort({ name: 1 }).exec(),
		Category.countDocuments().exec(),
		Item.countDocuments().exec(),
	]);

	res.render('index', {
		title: 'Homepage',
		categories: categories,
		numberOfCategories,
		numberOfItems,
	});
});

//Show category
exports.open_category = asyncHandler(async (req, res) => {
	const [category, itemsInCategory, numberOfItems] = await Promise.all([
		Category.findById(req.params.id).exec(),
		Item.find({ category: req.params.id }).sort({ name: 1 }).exec(),
		Item.countDocuments({ category: req.params.id }).exec(),
	]);

	res.render('category', {
		title: category.name,
		category: category,
		items: itemsInCategory,
		numberOfItems,
	});
});

//Create category - show form
exports.show_category_form = asyncHandler(async (req, res) => {
	res.render('category_form', { title: 'Create category' });
});
//Create
exports.create_category = [
	upload.single('image'),

	//Validate and sanitize
	body('name', 'Name must not be empty.')
		.trim()
		.isLength({ min: 1 })
		.blacklist('<>&/'),
	body('description', 'Description must not be empty.')
		.trim()
		.isLength({ min: 1 })
		.blacklist('<>&/'),

	asyncHandler(async (req, res) => {
		const errors = validationResult(req);

		const uploadedFile = req.file;
		const filePath = uploadedFile
			? '/uploads/' + uploadedFile.filename
			: '';

		const category = new Category({
			name: req.body.name,
			description: req.body.description,
			image: filePath,
		});

		if (!errors.isEmpty()) {
			res.render('category_form', {
				title: 'Create category',
				category: category,
				errors: errors.array(),
			});
		} else {
			await category.save();
			res.redirect(category.url);
		}
	}),
];

//Update category
//Show form
exports.show_update_form = asyncHandler(async (req, res) => {
	const category = await Category.findById(req.params.id)
		.sort({ name: 1 })
		.exec();
	res.render('category_form', {
		title: 'Update category',
		category: category,
	});
});

//Update
exports.update_category = [
	upload.single('image'),

	//Validate and sanitize
	body('name', 'Name must not be empty.')
		.trim()
		.isLength({ min: 1 })
		.blacklist('<>&/'),
	body('description', 'Description must not be empty.')
		.trim()
		.isLength({ min: 1 })
		.blacklist('<>&/'),

	asyncHandler(async (req, res) => {
		const errors = validationResult(req);

		const uploadedFile = req.file;

		//Keep the image
		let category;

		if (uploadedFile) {
			const filePath = '/uploads/' + uploadedFile.filename;

			category = new Category({
				name: req.body.name,
				description: req.body.description,
				image: filePath,
				_id: req.params.id,
			});
		} else {
			category = new Category({
				name: req.body.name,
				description: req.body.description,
				_id: req.params.id,
			});
		}

		//This way the image is lost when a user attempt to update a category
		/* 		const filePath = uploadedFile
			? '/uploads/' + uploadedFile.filename
			: '';

		const category = new Category({
			name: req.body.name,
			description: req.body.description,
			image: filePath,
			_id: req.params.id,
		}); */

		if (!errors.isEmpty()) {
			res.render('category_form', {
				title: 'Create category',
				category: category,
				errors: errors.array(),
			});
		} else {
			const updatedCategory = await Category.findByIdAndUpdate(
				req.params.id,
				category,
				{}
			);
			res.redirect(updatedCategory.url);
		}
	}),
];

//Delete category
//Show form
exports.show_delete_form = asyncHandler(async (req, res) => {
	const [category, allCategoryItems] = await Promise.all([
		Category.findById(req.params.id).exec(),
		Item.find({ category: req.params.id }).sort({ name: 1 }).exec(),
	]);

	res.render('category_delete', {
		title: 'Delete category',
		category: category,
		items: allCategoryItems,
	});
});

//Delete
exports.delete_category = asyncHandler(async (req, res) => {
	const [category, allCategoryItems] = await Promise.all([
		Category.findById(req.params.id).exec(),
		Item.find({ category: req.params.id }).sort({ name: 1 }).exec(),
	]);

	if (allCategoryItems.length > 0) {
		res.render('category_delete', {
			title: 'Delete category',
			category: category,
			items: allCategoryItems,
		});
	} else {
		await Category.findByIdAndDelete(req.body.categoryId);
		res.redirect('/');
	}
});
