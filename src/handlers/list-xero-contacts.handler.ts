import { createXeroClient } from "../clients/xero-client.js";
import { Contact } from "xero-node";
import { XeroClientResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";
import { getClientHeaders } from "../helpers/get-client-headers.js";

async function getContacts(): Promise<Contact[]> {
  
  const client = createXeroClient()
  await client.authenticate();

  const contacts = await createXeroClient().accountingApi.getContacts(
    client.tenantId,
    undefined, // ifModifiedSince
    undefined, // where
    undefined, // order
    undefined, // iDs
    undefined, // page
    undefined, // includeArchived
    true, // summaryOnly
    undefined, // pageSize
    undefined, // searchTerm
    getClientHeaders(),
  );
  return contacts.body.contacts ?? [];
}

/**
 * List all contacts from Xero
 */
export async function listXeroContacts(): Promise<
  XeroClientResponse<Contact[]>
> {
  try {
    const contacts = await getContacts();

    return {
      result: contacts,
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
