const router = require('express').Router();
const { Task, User } = require('../models');
const withAuth = require('../utils/auth')


router.use(async (req, res, next) => {
  try {
    if (req.session.user_id) {
      const userData = await User.findByPk(req.session.user_id, {
        attributes: ['username'],
      });
      res.locals.username = userData.username;
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { error: err });
  }
});

// Route for all tasks
router.get('/all', withAuth, async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { user_id: req.session.user_id },
      include: [{ model: User, attributes: ['username'] }]
    });

    const tasksPlain = tasks.map(task => task.get({ plain: true }));

    res.render('alltasks', {
      tasks: tasksPlain,
      logged_in: req.session.logged_in,
      username: res.locals.username
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { error: err });
  }
});
// route for pending tasks
router.get('/pending', withAuth, async (req, res) => {
  try {
      const tasks = await Task.findAll({
          where: { user_id: req.session.user_id },
          include: [{ model: User, attributes: ['username'] }]
      });

      const tasksPlain = tasks.map(task => task.get({ plain: true }));

      res.render('pending', {
          tasks: tasksPlain,
          logged_in: req.session.logged_in
          
      });
  } catch (err) {
      console.error(err);
      res.status(500).render('error', { error: err });
  }
});


// route for inprogress tasks
router.get('/inprogress', withAuth, async (req, res) => {
  try {
      const tasks = await Task.findAll({
          where: { user_id: req.session.user_id },
          include: [{ model: User, attributes: ['username'] }]
      });

      const tasksPlain = tasks.map(task => task.get({ plain: true }));

      res.render('inprogress', {
          tasks: tasksPlain,
          logged_in: req.session.logged_in
      });
  } catch (err) {
      console.error(err);
      res.status(500).render('error', { error: err });
  }
});


// route for completed tasks
router.get('/completed', withAuth, async (req, res) => {
  try {
      const tasks = await Task.findAll({
          where: { user_id: req.session.user_id },
          include: [{ model: User, attributes: ['username'] }]
      });

      const tasksPlain = tasks.map(task => task.get({ plain: true }));

      res.render('completed', {
          tasks: tasksPlain,
          logged_in: req.session.logged_in
      });
  } catch (err) {
      console.error(err);
      res.status(500).render('error', { error: err });
  }
});


router.get('/', withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Task }],
    });

    const user = userData.get({ plain: true });
    console.log(user)

    res.render('homepage', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {

  if (req.session.logged_in) {
    res.redirect('/login');
    return;
  }

  res.render('login');
});

router.get('/register', (req, res) => {

  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('register');
});

module.exports = router;