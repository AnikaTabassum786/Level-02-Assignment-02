import { Router} from "express";
import { vehicleController } from "./vehicle.controller";
import auth from "../../middleware/auth";
import { Roles } from "../auth/auth.const";


const router= Router();
router.post('/', auth(Roles.admin), vehicleController.createVehicle)
router.get('/',auth(Roles.admin , Roles.customer) , vehicleController.getAllVehicle)
router.get('/:vehicleId',auth(Roles.admin , Roles.customer) , vehicleController.getSingleVehicle)
router.put('/:vehicleId',auth(Roles.admin) , vehicleController.updateVehicle)
router.delete('/:vehicleId',auth(Roles.admin) , vehicleController.deleteVehicle)


export const vehicleRoute =router