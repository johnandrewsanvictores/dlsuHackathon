import express from "express";

import auth from "../middleware/auth.js";
import {getJobInfo} from "../controllers/jobInfoController.js";

const router = express.Router();

router.get('/', auth, getJobInfo);

export default router;
