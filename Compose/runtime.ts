import { AppRuntime } from "$ts/apps";
import { DefaultIcon } from "$ts/images/apps";
import { WarningIcon } from "$ts/images/dialog";
import { Process } from "$ts/process";
import { createErrorDialog } from "$ts/process/error";
import { FileProgress } from "$ts/server/fs/progress";
import { getMessage } from "$ts/server/messaging/get";
import { replyToMessage, sendMessage } from "$ts/server/messaging/send";
import { Store } from "$ts/writable";
import { App, AppMutator } from "$types/app";

export class ComposeRuntime extends AppRuntime {
  public ReplyId = Store<string>();
  public Title = Store<string>("");
  public Body = Store<string>("");
  public COMPOSE_LIMIT = 2000;
  public Previewing = Store<boolean>(false);
  public Receivers = Store<string[]>([]);

  constructor(app: App, mutator: AppMutator, process: Process) {
    super(app, mutator, process);

    const args = process.args;

    const replyId = args[0];
    const body = args[1];
    const title = args[2];

    if (replyId && typeof replyId == "string") this.setReply(replyId);
    if (body && typeof body == "string") this.Body.set(body);
    if (title && typeof title == "string") this.Title.set(title);
  }

  public async setReply(id: string) {
    const message = await getMessage(id);

    if (!message) return false;

    this.ReplyId.set(message.id);
    this.Receivers.set([message.sender]);
  }

  public async send() {
    const receivers = this.Receivers.get();
    const body = this.Body.get();
    const title = this.Title.get();
    const replyId = this.ReplyId.get();

    if (!receivers.length || !body || !title) return;

    const content = `### ${title}\n${body}`;

    const { setDone } = await FileProgress(
      {
        caption: "Sending message...",
        subtitle: `${title}`,
        max: 1,
        done: 0,
        errors: 0,
        working: false,
        waiting: false,
        type: "quantity",
        icon: this.app.metadata.icon,
      },
      this.pid
    );

    if (replyId) await replyToMessage(replyId, receivers[0], content);
    else await sendMessage(receivers, content);

    setDone(1);

    this.closeApp();
  }

  public discard() {
    const body = this.Body.get();

    if (!body) return this.closeApp();

    createErrorDialog(
      {
        title: "Discard message?",
        message:
          "Are you sure you want to discard this message? The message will be permanently deleted.",
        image: WarningIcon,
        buttons: [
          { action() {}, caption: "Cancel" },
          {
            caption: "Discard",
            action: () => {
              this.closeApp();
            },
            suggested: true,
          },
        ],
        sound: "arcos.dialog.warning",
      },
      this.pid,
      true
    );
  }
}
