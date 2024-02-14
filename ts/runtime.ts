import { AppRuntime } from "$ts/apps/runtime";
import { Process } from "$ts/process";
import { GlobalDispatch } from "$ts/process/dispatch/global";
import { getMessage } from "$ts/server/messaging/get";
import { Store } from "$ts/writable";
import type { App, AppMutator } from "$types/app";
import { Message, PartialMessage } from "$types/messaging";
import Fuse from "fuse.js";
import { MessagingPages } from "./store";
import { archiveMessage, isArchived, unarchiveMessage } from "$ts/server/messaging/archive";

export class Runtime extends AppRuntime {
  public Store = Store<PartialMessage[]>([]);
  public Message = Store<Message>();
  public Page = Store<string>("inbox");
  public Loading = Store<boolean>(false);
  public SearchFilter = Store<string>("");
  public SearchResults = Store<string[]>([]);
  public LockRefresh = Store<boolean>(false);

  constructor(app: App, mutator: AppMutator, process: Process) {
    super(app, mutator, process);

    this.Update();
    this.assignDispatchers();
  }

  async Update() {
    const page = MessagingPages[this.Page.get()];

    if (this.LockRefresh.get() || !page) return;

    this.Store.set([]);
    this.Loading.set(true);

    const supplier = await page.supplier();
    const currentMessage = this.Message.get();

    this.Store.set(supplier || []);

    if (currentMessage) await this.openMessage(currentMessage.id, true);

    this.Loading.set(false);
  }

  public async navigate(id: string, reset = true) {
    if (this.Loading.get()) return false;

    const current = this.Page.get();

    if (!MessagingPages[id] || current == id) return false;

    this.Page.set(id);

    if (reset) this.Message.set(null);

    await this.Update();

    return true;
  }

  public async openMessage(id: string, force = false) {
    const current = this.Message.get();

    if (current && current.id == id && !force) return false;

    this.Message.set(null);

    const message = await getMessage(id);

    if (!message) return false;

    this.Message.set(message);
  }

  private assignDispatchers() {
    GlobalDispatch.subscribe("message-flush", () => this.Update());
  }

  public Search(query: string) {
    if (!query) {
      this.SearchResults.set([]);
      this.SearchFilter.set("");
      return;
    }
    const store = this.Store.get();
    const options = {
      keys: ["sender", "partialBody"],
    };

    if (!store) return;

    const fuse = new Fuse(store, options);
    const search = fuse.search(query);

    this.SearchResults.set(search.map((a) => a.item.id));
    this.SearchFilter.set(query);

    console.log(this.SearchFilter.get(), this.SearchResults.get());
  }

  public async archiveMessage(id?: string) {
    const message = this.Message.get();

    this.LockRefresh.set(true);

    id ||= message ? message.id : id;

    const archived = isArchived(id);

    if (archived) {
      unarchiveMessage(id);
    } else {
      archiveMessage(id);
    }

    const unsub = this.Loading.subscribe(async (v) => {
      if (v) return;

      this.LockRefresh.set(false);

      await this.navigate(message.id == id && !archived ? "archive" : "inbox", false);

      unsub();
    });
  }
}
