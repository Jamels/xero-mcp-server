import { xeroClient } from "../clients/xero-client.js";
import {
  contactDeepLink,
  creditNoteDeepLink,
  invoiceDeepLink,
  quoteDeepLink,
} from "../consts/deeplinks.js";

export enum DeepLinkType {
  CONTACT,
  CREDIT_NOTE,
  INVOICE,
  QUOTE,
}

/**
 * Gets a deep link for a specific type and item ID.
 * This will also fetch the org short code from the Xero client.
 * @param type
 * @param itemId
 * @returns
 */
export const getDeepLink = async (type: DeepLinkType, itemId: string) => {
  const orgShortCode = await xeroClient.getShortCode();

  if (!orgShortCode) {
    throw new Error("Failed to retrieve organisation short code");
  }

  switch (type) {
    case DeepLinkType.CONTACT:
      return contactDeepLink(orgShortCode, itemId);
    case DeepLinkType.CREDIT_NOTE:
      return creditNoteDeepLink(orgShortCode, itemId);
    case DeepLinkType.INVOICE:
      return invoiceDeepLink(orgShortCode, itemId);
    case DeepLinkType.QUOTE:
      return quoteDeepLink(orgShortCode, itemId);
  }
};
