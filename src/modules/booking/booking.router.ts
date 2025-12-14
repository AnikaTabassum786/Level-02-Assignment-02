import {Request, Response, Router} from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middleware/auth";
import { Roles } from "../auth/auth.const";

const router= Router();
router.post('/', auth(Roles.admin,Roles.customer), bookingController.createBooking)


export const bookingRoute =router