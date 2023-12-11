const router = require("express").Router();
const customer = require("../controllers/customerController");
const admin = require("../controllers/adminController");
const verify = require("../middleware/tokenValidation");
const OAuth = require("../controllers/OAuth");

router.route("/register").post(customer.register);
router.route("/login").post(customer.login);
router.route("/getSingleData").get(verify, customer.dataById);
router.route("/update/:id").put(verify, customer.update);

router.route("/registerAdmin").post(admin.register);
router.route("/loginAdmin").post(admin.login);
router.route("/allData").get(verify, admin.allData);
router.route("/delete/:id").delete(verify, admin.deleteById);
router.route("/getAdminData").get(verify, admin.getAdminData);

// // Google OAuth
// router.route("/auth/google").get(OAuth.authenticate);
// router.route("/auth/google/callback").get(OAuth.callback);
// router.route("/auth/google/success").get(OAuth.isLoggedin, OAuth.success);
// router.route("/auth/google/failure").get(OAuth.failure);

module.exports = router;
