import express from "express";

import {createUser, getProfile, getUser} from "../controllers/userController.js";
import {validateUserInfo} from "../middleware/validation/userCreateValidation.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get('/profile', auth, getProfile);
router.get('/me', getUser);
router.post('/create', validateUserInfo, createUser);

export default router;