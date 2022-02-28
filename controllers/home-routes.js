const router = require('express').Router();
const { Post, Comment, User } = require('../models');

// get all posts for homepage
router.get('/', async (req, res) => {
    try {
		const postData = await Post.findAll({
			include: [{ model: User }],
		});

		const posts = postData.map((post) => post.get({ plain: true }));

		res.render('all-posts', {
			posts,
			logged_in: req.session.logged_in,
		});
	} catch (err) {
		res.status(500).json(err);
	}
});

// get single post
router.get('/post/:id', async (req, res) => {
    try {
		const postData = await Post.findByPk(req.params.id, {
			include: [
				{ model: User },
				{
					model: Comment,
					include: {
						model: User,
					},
				},
			],
		});

		if (!postData) {
			res.status(404).json({ message: 'ID not found' });
		} 
        else {
		const post = postData.get({ plain: true });
		const comments = post.comments;

		res.render('single-post', {
			post,
			comments,
			logged_in: req.session.logged_in,
		})};
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get('/login', (req, res) => {
    if (req.session.logged_in) {
		res.redirect('/dashboard');
		return;
	}
	res.render('login');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

module.exports = router;
