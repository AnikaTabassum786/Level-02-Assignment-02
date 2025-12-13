import {Request, Response, Router} from "express";
import auth from "../../middleware/auth";
import { Roles } from "../auth/auth.const";
import { userController } from "./user.controller";


const router= Router();
router.get('/', auth(Roles.admin), userController.getAllUser)

export const userRoute =router