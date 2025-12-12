import { Router} from "express";
import { vehicleController } from "./vehicle.controller";
import auth from "../../middleware/auth";
import { Roles } from "../auth/auth.const";


const router= Router();
router.post('/', auth(Roles.admin), vehicleController.createVehicle)
router.get('/',auth(Roles.admin , Roles.customer) , vehicleController.getAllUser)



export const vehicleRoute =router