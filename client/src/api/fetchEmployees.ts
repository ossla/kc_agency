import { ResponseHandler, ResponseHandlerMap } from "./ResponseHandler"
import { IEmployee, toIEmployee } from "./types/employeeTypes"
import { createEmployeeURL, getEmployeeURL, editEmployeeURL } from "./URLs"

class fetchEmployees {
    // ================== CREATE ==================
    static async create(accessToken: string, reqFormData: FormData): Promise<IEmployee> {
        const response = await fetch(createEmployeeURL, {
            method: "POST",
            body: reqFormData,
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            }
        })
        const employee: IEmployee = await ResponseHandler<IEmployee>(response, toIEmployee)
        console.log("createEmpl data: " + JSON.stringify(employee))
        return employee
    }
    // ================== EDIT ==================
    static async edit(accessToken: string, data: FormData): Promise<IEmployee> {
        const response = await fetch(editEmployeeURL, {
            method: "POST",
            headers: { Authorization: `Bearer ${accessToken}` },
            body: data,
        })
        return ResponseHandler<IEmployee>(response, toIEmployee)
    }
    // ================== DELETE ==================
    // ================== GET ==================
    static async get(): Promise<IEmployee[]> {
        const response = await fetch(getEmployeeURL, {method: "GET"})
        const employees: IEmployee[] = await ResponseHandlerMap<IEmployee>(response, toIEmployee)
        console.log("getFull data: " + JSON.stringify(employees))
        return employees
    }

    static async getEmployee(id: string): Promise<IEmployee> {
        const response = await fetch(getEmployeeURL + '/' + id, {method: "GET"})
        const employee: IEmployee = await ResponseHandler<IEmployee>(response, toIEmployee)
        console.log("getEmpl data: " + JSON.stringify(employee))
        return employee
    }
}

export default fetchEmployees
