const { Router } = require('express');
const { UserDAO } = require('../models/');

const userRouter = Router();

async function getAllUsers(_req, res, _next) {
  const results = await UserDAO.getAllUsers();
  return res.status(200).send(results);
}

// the list of all users
// curl -X GET -H "Content-Type:application/json" http://localhost:3000/user/all
userRouter.get('/all', [getAllUsers]);
// router.get('/whoami', [user_controller.validate_user, user_controller.whoami]);
// router.get('/:login', [user_controller.find_by_login]);
// module.exports = router;

module.exports = userRouter;
