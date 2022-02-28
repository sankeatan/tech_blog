const router = require('express').Router();
const { User } = require('../../models');

router.post('/', async (req, res) => {
  try {
		const userData = await User.create({
			username: req.body.username,
			password: req.body.password,
		});

		req.session.save(() => {
			req.session.user_id = userData.id;
			req.session.logged_in = true;
		});

		res.status(200).json(userData);
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
});

router.post('/login', async (req, res) => {
  try {
		const userData = await User.findOne({
			where: { username: req.body.username },
		});

		if (!userData) {
			res.status(400).json({
				message: 'No such username',
			});
		}

		const password = await userData.checkPassword(req.body.password);

		if (!password) {
			res.status(400).json({
				message: 'Wrong password',
			});
		}

		req.session.save(() => {
			req.session.user_id = userData.id;
			req.session.logged_in = true;

			res.json({ user: userData, message: 'Sucessfully Logged In' });
		});
	} catch (err) {
		res.status(400).json(err);
	}
});

router.post('/logout', (req, res) => {
  try {
		if (req.session.logged_in) {
			req.session.destroy(() => {
				res.status(204).end();
			});
		} else {
			res.status(404).end();
		}
	} catch (err) {
		res.status(404).end();
	}
});

module.exports = router;
