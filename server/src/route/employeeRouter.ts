import express, { Express } from "express"
import { checkMiddleware } from "../middleware/checkMiddleware"
import { createEmployee } from "../controller/employee/createEmployee"
import { removeEmployee } from "../controller/employee/removeEmployee"
import { getAllEmployees, getOneEmployee, getShortEmployees } from "../controller/employee/getEmployee"
import { editEmployee } from "../controller/employee/editEmployee"
import { authMiddleware } from "../middleware/authMiddleware"

const EmployeeRouter: Express = express()

EmployeeRouter.post("/create", authMiddleware, checkMiddleware, createEmployee)
EmployeeRouter.delete("/delete/:id", authMiddleware, checkMiddleware, removeEmployee)
EmployeeRouter.post("/edit", authMiddleware, checkMiddleware, editEmployee)

EmployeeRouter.get("/:id", getOneEmployee)
EmployeeRouter.get("/", getShortEmployees)

export default EmployeeRouter