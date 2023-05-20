const express = require("express");
const router = express();
const { index, find, update, emailRcp} = require("./controller");
const {
  authenticateUser,
  authorizeRoles,
} = require("../../../middlewares/auth");

router.get(
  "/",
  authenticateUser,
  authorizeRoles("organizer", "admin", "owner"),
  index
);
router.get(
  '/:id',
  authenticateUser,
  authorizeRoles('organizer', 'admin'),
  find
);
router.put(
  '/:id',
  authenticateUser,
  authorizeRoles('organizer', 'admin'),
  update
);


router.get(
  '/rcpmail/:id',
  authenticateUser,
  authorizeRoles('organizer', 'admin'),
  emailRcp
);


module.exports = router;