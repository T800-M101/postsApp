const express = require('express');

const checkAuth = require('../middleware/check-auth');

const extractFile = require('../middleware/file');

const PostController = require('../controllers/post');

const router = express.Router();




// HTTP METHODS


router.get('', PostController.getPosts);

router.get('/:id', PostController.getPostById);

router.post('', checkAuth, extractFile, PostController.createPost);

router.put('/:id', checkAuth, extractFile, PostController.editPost);

router.delete('/:id', checkAuth, PostController.deletePost);

module.exports = router;