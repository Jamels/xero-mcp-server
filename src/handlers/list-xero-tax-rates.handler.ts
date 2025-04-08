import { createXeroClient } from "../clients/xero-client.js";
import { XeroClientResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";
import { TaxRate } from "xero-node";
import { getClientHeaders } from "../helpers/get-client-headers.js";

async function getTaxRates(): Promise<TaxRate[]> {

  const client = createXeroClient()
  await client.authenticate();

  const taxRates = await createXeroClient().accountingApi.getTaxRates(
    client.tenantId,
    undefined, // where
    undefined, // order
    getClientHeaders(),
  );
  return taxRates.body.taxRates ?? [];
}

/**
 * List all tax rates from Xero
 */
export async function listXeroTaxRates(): Promise<
  XeroClientResponse<TaxRate[]>
> {
  try {
    const taxRates = await getTaxRates();

    return {
      result: taxRates,
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
