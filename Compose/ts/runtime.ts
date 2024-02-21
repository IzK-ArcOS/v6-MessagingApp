import { AppRuntime } from "$ts/apps";
import { WarningIcon } from "$ts/images/dialog";
import { Process } from "$ts/process";
import { createErrorDialog } from "$ts/process/error";
import { FileProgress } from "$ts/server/fs/progress";
import { getMessage } from "$ts/server/messaging/get";
import { replyToMessage, sendMessage } from "$ts/server/messaging/send";
import { focusedPid } from "$ts/stores/apps/focus";
import { ProcessStack } from "$ts/stores/process";
import { Store } from "$ts/writable";
import { App, AppMutator } from "$types/app";

export class ComposeRuntime extends AppRuntime {
  public ReplyId = Store<string>();
  public Title = Store<string>("");
  public Body = Store<string>("");
  public COMPOSE_LIMIT = 1940;
  public Previewing = Store<boolean>(false);
  public Receivers = Store<string[]>([]);

  constructor(app: App, mutator: AppMutator, process: Process) {
    super(app, mutator, process);

    const args = process.args;

    const replyId = args[0];
    const body = args[1];
    const title = args[2];

    if (replyId) this.setReply(replyId.toString());
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

    let sent = false;

    if (replyId) sent = await replyToMessage(replyId, receivers[0], content);
    else sent = await sendMessage(receivers, content);

    setDone(1);

    if (sent) ProcessStack.dispatch.dispatchToPid(this.process.parentPid, "open-latest-sent");

    focusedPid.set(this.process.parentPid);
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
              focusedPid.set(this.process.parentPid);
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
