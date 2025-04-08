import { createXeroClient, DEFAULT_PAYROLL_SCOPES } from "../clients/xero-client.js";
import { Employee } from "xero-node";
import { XeroClientResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";
import { getClientHeaders } from "../helpers/get-client-headers.js";

async function getPayrollEmployees(): Promise<Employee[]> {
  const client = createXeroClient(DEFAULT_PAYROLL_SCOPES)
  await client.authenticate();

  // Call the Employees endpoint from the PayrollNZApi
  const employees = await client.payrollNZApi.getEmployees(
    client.tenantId,
    undefined, // page
    undefined, // pageSize
    getClientHeaders(),
  );
  
  return employees.body.employees ?? [];
}

/**
 * List all payroll employees from Xero
 */
export async function listXeroPayrollEmployees(): Promise<
  XeroClientResponse<Employee[]>
> {
  try {
    const employees = await getPayrollEmployees();

    return {
      result: employees,
      isError: false,
      error: null,
    };
  } catch (error) {
    return {
      result: null,
      isError: true,
      error: formatError(error),
    };
  }
}
