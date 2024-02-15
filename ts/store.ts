import { getArchivedMessages } from "$ts/server/messaging/archive";
import { getInboxMessages, getSentMessages, getUnreadMessages } from "$ts/server/messaging/get";
import { MessagingPageStore } from "./types";

export const MessagingPages: MessagingPageStore = {
  unread: {
    name: "Unread",
    icon: "mark_email_unread",
    supplier: getUnreadMessages,
  },
  inbox: {
    name: "Inbox",
    icon: "inbox",
    supplier: getInboxMessages,
  },
  sent: {
    name: "Sent",
    icon: "send",
    supplier: getSentMessages,
  },
  archive: {
    name: "Archived",
    icon: "inventory_2",
    supplier: getArchivedMessages,
  },
};
