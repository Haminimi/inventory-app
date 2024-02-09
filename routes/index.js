const express = require('express');
const router = express.Router();
const category = require('../controllers/categoryController');
const item = require('../controllers/itemController');

//Homepage
router.get('/', category.index);

//Create category
//Show form
router.get('/category/create', category.show_category_form);

//Create
router.post('/category/create', category.create_category);

//Update category
//Show form
router.get('/category/:id/update', category.show_update_form);

//Update
router.post('/category/:id/update', category.update_category);

//Delete category
//Show form
router.get('/category/:id/delete', category.show_delete_form);

//Delete
router.post('/category/:id/delete', category.delete_category);

//Show category
router.get('/category/:id', category.open_category);

//

//All items
router.get('/items', item.items);

//Create item
//Show form
router.get('/item/create', item.show_item_form);

//Create
router.post('/item/create', item.create_item);

//Update item
//Show form
router.get('/item/:id/update', item.show_update_form);

//Update
router.post('/item/:id/update', item.update_item);

//Delete item
//Show form
router.get('/item/:id/delete', item.show_delete_form);

//Delete
router.post('/item/:id/delete', item.delete_item);

//Show item
router.get('/item/:id', item.open_item);

module.exports = router;
