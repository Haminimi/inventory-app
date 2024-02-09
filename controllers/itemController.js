const Category = require('../models/category');
const Item = require('../models/item');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

//Show item
exports.open_item = asyncHandler(async (req, res) => {
	const item = await Item.findById(req.params.id)
		.populate('category')
		.sort({ name: 1 })
		.exec();

	res.render('item', { title: item.name, item });
});
