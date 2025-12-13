import { Request, Response } from "express"
import { userService } from "./user.service";

const getAllUser = async (req: Request, res: Response) => {
    try {
        const result = await userService.getAllUserFromDB();
        return res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.rows
        })
    }
    catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const deleteUser = async (req: Request, res: Response) => {
    try {
        const result = await userService.deleteUserFromDB(req.params.userId as string);
        if (result.rowCount === 0) {
            return res.status(200).json({
                success: false,
                message: "User not found"
            })
        }
        else {
            return res.status(200).json({
                success: true,
                message: "User deleted successfully"
            })
        }
    }

    catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const updateUser = async (req: Request, res: Response) => {
  const { name, email, phone, role  } = req.body
  try {
    const result = await userService.updateUserIntoDB(name, email, phone, role, req.params.userId as string)
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }
    else {
      return res.status(200).json({
        success: true,
        message: "User updated successfully"
      })
    }
  }
  catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

export const userController = {
    getAllUser,
    deleteUser,
    updateUser
}