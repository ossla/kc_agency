import { ResponseHandler, ResponseHandlerMap } from "./ResponseHandler";
import { IEmployee, IShortEmployee, toIEmployee, toIShortEmployee } from "./types/employeeTypes";
import { GenderEnum } from "./types/enums";

class fetchEmployees {
    // ================== CREATE ==================
    static async create(accessToken: string, reqFormData: FormData): Promise<IEmployee> {
        const response = await fetch(`/api/employee/create`, {
            method: "POST",
            body: reqFormData,
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            }
        })
        const employee: IEmployee = await ResponseHandler<IEmployee>(response, toIEmployee)
        return employee
    }
    // ================== EDIT ==================
    // ================== DELETE ==================
    // ================== GET ==================
    static async getShort(): Promise<IShortEmployee[]> {
        
        const response = await fetch(`/api/employee/`, {method: "GET"})
        const employees: IShortEmployee[] = await ResponseHandlerMap<IShortEmployee>(response, toIShortEmployee)
        return employees
    }

    static async getEmployee(id: number): Promise<IEmployee> {

        const response = await fetch(`/api/employee/${id}`, {method: "GET"})
        const employee: IEmployee = await ResponseHandler<IEmployee>(response, toIEmployee)
        return employee
    }
}

export default fetchEmployees
