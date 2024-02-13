import { MaybePromise } from "$types/common";
import { PartialMessage } from "$types/messaging";

export interface MessagingPage {
  name: string;
  icon: string;
  supplier: () => MaybePromise<PartialMessage[]>;
}

export type MessagingPageStore = { [key: string]: MessagingPage };
