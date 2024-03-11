import { Router } from "express";
import { forgotPassword, getProfile, login, logout, register, resetPassword } from "../controllers/user.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";


const router = Router();

router.route("/hello").post()

router.route("/register").post(
    upload.single("avatar"),
    register)

// router.post('/register',upload.single("avatar"), register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', isLoggedIn,getProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);



export default router;