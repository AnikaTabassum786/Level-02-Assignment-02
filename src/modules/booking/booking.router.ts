import {Request, Response, Router} from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middleware/auth";
import { Roles } from "../auth/auth.const";

const router= Router();
router.post('/', auth(Roles.admin,Roles.customer), bookingController.createBooking)
router.get('/', auth(Roles.admin), bookingController.getAllBooking)
router.get('/my-booking', auth(Roles.customer), bookingController.getOwnBooking)
router.put('/:bookingId', auth(Roles.admin),bookingController.updateBookingStatusByAdmin)

export const bookingRoute =router