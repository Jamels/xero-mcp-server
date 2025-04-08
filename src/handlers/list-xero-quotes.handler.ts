import { createXeroClient } from "../clients/xero-client.js";
import { XeroClientResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";
import { Quote } from "xero-node";
import { getClientHeaders } from "../helpers/get-client-headers.js";

async function getQuotes(
  contactId: string | undefined,
  page: number,
): Promise<Quote[]> {

  const client = createXeroClient()
  await client.authenticate();

  const quotes = await createXeroClient().accountingApi.getQuotes(
    client.tenantId,
    undefined, // ifModifiedSince
    undefined, // dateFrom
    undefined, // dateTo
    undefined, // expiryDateFrom
    undefined, // expiryDateTo
    contactId, // contactID
    undefined, // status
    page,
    undefined, // order
    undefined, // quoteNumber
    getClientHeaders(),
  );
  return quotes.body.quotes ?? [];
}

/**
 * List all quotes from Xero
 */
export async function listXeroQuotes(
  page: number = 1,
  contactId?: string,
): Promise<XeroClientResponse<Quote[]>> {
  try {
    const quotes = await getQuotes(contactId, page);

    return {
      result: quotes,
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
