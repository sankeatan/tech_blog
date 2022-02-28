const router = require('express').Router();
const { Post, Comment, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
  try {
		const userData = await User.findByPk(req.session.user_id, {
			attributes: { exclude: ['password'] },
			include: [{ model: Post }],
		});

		const user = userData.get({ plain: true });

		res.render('dashboard', {
			...user,
			logged_in: req.session.logged_in,
		});
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get('/new', withAuth, (req, res) => {
  res.render("new-post", {logged_in: req.session.logged_in});
});

router.get('/edit/:id', withAuth, async (req, res) => {
  try {
		const postData = await Post.findByPk(req.params.id);
		const post = postData.get({ plain: true });
		res.render('edit-post', 
    { post, logged_in: req.session.logged_in });
	} catch (err) {
		res.status(500).json(err);
	}nction
});

module.exports = router;
