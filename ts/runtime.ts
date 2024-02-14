import { AppRuntime } from "$ts/apps/runtime";
import { Process } from "$ts/process";
import { getMessage } from "$ts/server/messaging/get";
import { Store } from "$ts/writable";
import type { App, AppMutator } from "$types/app";
import { Message, PartialMessage } from "$types/messaging";
import { MessagingPages } from "./store";

export class Runtime extends AppRuntime {
  public Store = Store<PartialMessage[]>([]);
  public Message = Store<Message>();
  public Page = Store<string>("inbox");
  public Loading = Store<boolean>(false);

  constructor(app: App, mutator: AppMutator, process: Process) {
    super(app, mutator, process);

    this.Update();
  }

  async Update() {
    const page = MessagingPages[this.Page.get()];

    if (!page) return;

    this.Loading.set(true)

    const supplier = await page.supplier();

    this.Store.set(supplier || []);
    this.Loading.set(false);
  }

  public async navigate(id: string) {
    if (!MessagingPages[id]) return false;

    this.Page.set(id);
    this.Message.set(null);

    await this.Update();

    return true;
  }

  public async openMessage(id: string) {
    const message = await getMessage(id);

    if (!message) return false;

    this.Message.set(message);
  }
}