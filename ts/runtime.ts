import { spawnOverlay } from "$ts/apps";
import { AppRuntime } from "$ts/apps/runtime";
import { ErrorIcon } from "$ts/images/dialog";
import { SaveIcon, TrashIcon } from "$ts/images/general";
import { Process } from "$ts/process";
import { GlobalDispatch } from "$ts/process/dispatch/global";
import { createErrorDialog } from "$ts/process/error";
import { textToBlob } from "$ts/server/fs/convert";
import { writeFile } from "$ts/server/fs/file";
import { FileProgress } from "$ts/server/fs/progress";
import { pathToFriendlyName, pathToFriendlyPath } from "$ts/server/fs/util";
import { archiveMessage, isArchived, unarchiveMessage } from "$ts/server/messaging/archive";
import { deleteMessage } from "$ts/server/messaging/delete";
import { getMessage } from "$ts/server/messaging/get";
import { GetSaveFilePath } from "$ts/stores/apps/file";
import { ProcessStack } from "$ts/stores/process";
import { UserName } from "$ts/stores/user";
import { Store } from "$ts/writable";
import type { App, AppMutator } from "$types/app";
import { Message, PartialMessage } from "$types/messaging";
import dayjs from "dayjs";
import Fuse from "fuse.js";
import { ComposeApp } from "../Compose/ts/app";
import { MessagingPages } from "./store";
import { parseTitle } from "$ts/server/messaging/utils";
import { ThreadViewApp } from "../ThreadView/ts/app";

export class Runtime extends AppRuntime {
  public Store = Store<PartialMessage[]>([]);
  public Message = Store<Message>();
  public Page = Store<string>("unread");
  public Loading = Store<boolean>(false);
  public SearchFilter = Store<string>("");
  public SearchResults = Store<string[]>([]);
  public LockRefresh = Store<boolean>(false);
  public ViewingMessageSource = Store<boolean>(false);
  public ViewingThread = Store<boolean>(false);
  public HasOverlay = Store<boolean>(false);

  constructor(app: App, mutator: AppMutator, process: Process) {
    super(app, mutator, process);

    this.Update();
    this.assignDispatchers();
  }

  async Update(reset = true) {
    const page = MessagingPages[this.Page.get()];

    if (this.LockRefresh.get() || !page) return;

    this.setWindowTitle(page.name, true);

    this.Store.set([]);
    this.Loading.set(true);

    const supplier = ((await page.supplier()) || []).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    const currentMessage = this.Message.get();

    if (reset) this.Message.set(null);

    this.Store.set(supplier);

    if (currentMessage) await this.openMessage(currentMessage.id, true);
    else if (supplier[0]) await this.openMessage(supplier[0].id);

    this.Loading.set(false);
  }

  public async navigate(id: string, reset = true) {
    if (this.Loading.get()) return false;

    const current = this.Page.get();
    const page = MessagingPages[id];

    if (!page || current == id) return false;

    this.Page.set(id);

    await this.Update(reset);

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

  public openMessagePage() {
    const message = this.Message.get();
    const username = UserName.get();

    if (!message) return;

    if (message.receiver == username) this.navigate(message.read ? "inbox" : "unread");
    else if (message.sender == username) this.navigate("sent");
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
  }

  public async ArchiveMessage(id?: string) {
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

  public async SaveMessage() {
    const message = this.Message.get();

    if (!message) return false;

    const filename = `${message.id} from ${message.sender}.md`;

    const path = await GetSaveFilePath(this.pid, {
      title: "Where do you want to save the message?",
      icon: SaveIcon,
      saveName: filename,
      isSave: true,
    });

    const { setDone, mutErr } = await FileProgress(
      {
        max: 1,
        done: 0,
        caption: `Saving message to ${pathToFriendlyName(path)}...`,
        type: "quantity",
        icon: SaveIcon,
        subtitle: `To ${pathToFriendlyPath(path)}`,
        waiting: false,
        working: false,
        errors: 0,
      },
      this.pid,
      false
    );

    const written = await writeFile(path, textToBlob(message.body), true);

    if (!written) mutErr(+1);
    else setDone(1);
  }

  public async DeleteMessage() {
    const message = this.Message.get();
    const currentUser = UserName.get();

    if (!message) return;

    if (message.sender == currentUser && message.receiver !== currentUser) {
      createErrorDialog(
        {
          title: "Can't delete message",
          message: `You have to be the recipient of a message in order to delete it. Please ask <b>${message.receiver}</b> to delete it for you.`,
          buttons: [{ caption: "Okay", action() {}, suggested: true }],
          image: ErrorIcon,
          sound: "arcos.dialog.error",
        },
        this.pid,
        true
      );

      return;
    }

    createErrorDialog(
      {
        title: "Delete message?",
        message: `Are you sure you want to <b>permanently</b> delete message <code>#${message.id}</code> from ${message.sender}? This cannot be undone.`,
        buttons: [
          { caption: "Cancel", action() {} },
          {
            caption: "Delete",
            action: async () => {
              const deleted = await deleteMessage(message.id);

              if (!deleted) {
                createErrorDialog(
                  {
                    title: "Delete failed!",
                    message: `An error occured while deleting this message. Please make sure it exists, and then try again.`,
                    image: ErrorIcon,
                    buttons: [{ caption: "Okay", action() {}, suggested: true }],
                    sound: "arcos.dialog.error",
                  },
                  this.pid,
                  true
                );

                return;
              }

              this.Message.set(null);
              this.Update();
            },
            suggested: true,
          },
        ],
        image: TrashIcon,
        sound: "arcos.dialog.info",
      },
      this.pid,
      true
    );
  }

  public async Compose(body?: string, title?: string, replyId?: string) {
    if (this.HasOverlay.get()) return;

    const proc = await spawnOverlay(ComposeApp, this.pid, [replyId, body, title]);

    if (typeof proc === "string") return;

    this.HasOverlay.set(true);

    const subscriber = ProcessStack.processes.subscribe(() => {
      if (!ProcessStack.isPid(proc.pid, true)) {
        this.HasOverlay.set(false);

        subscriber();
      }
    });
  }

  public async ViewThread(id: string) {
    if (this.HasOverlay.get()) return;

    const proc = await spawnOverlay(ThreadViewApp, this.pid, [id]);

    if (typeof proc === "string") return;

    this.HasOverlay.set(true);

    const subscriber = ProcessStack.processes.subscribe(() => {
      if (!ProcessStack.isPid(proc.pid, true)) {
        this.HasOverlay.set(false);

        subscriber();
      }
    });
  }

  public async ReplyToMessage() {
    const message = this.Message.get();

    if (!message) return;

    const { title } = parseTitle(message.body);

    this.Compose("", title ? `Re: ${title}` : "", message.id);
  }

  public ForwardMessage() {
    const message = this.Message.get();

    if (!message) return;

    const { title, body: source } = parseTitle(message.body);
    const sender = message.sender;
    const receiver = message.receiver;
    const ts = dayjs(message.timestamp).format("[on] D MMMM YYYY [at] H:mm:ss");
    const body = `${source}\n\n---\n\nSent to **${receiver}** by **${sender}** ${ts} (timezone of server). `;

    this.Compose(body, title ? `Fw: ${title}` : "");
  }

  private assignDispatchers() {
    GlobalDispatch.subscribe("message-flush", () => this.Update());

    this.process.handler.dispatch.subscribe<string>(this.pid, "open-message", async (data) => {
      await this.openMessage(data);

      await this.openMessagePage();
    });
  }
}
