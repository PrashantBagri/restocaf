import Router from "express";
import { loginUser, registerUser, logoutUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/register", upload.fields([
    {
        name : "avatar",
        maxCount: 1
    },
    {
        name : "coverImage",
        maxCount : 1
    }
]),registerUser)

router.post("/login", loginUser);

router.post("/logout", logoutUser);

export default router;