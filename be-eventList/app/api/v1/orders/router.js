const express = require("express");
const router = express();
const { index, find} = require("./controller");
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

module.exports = router;