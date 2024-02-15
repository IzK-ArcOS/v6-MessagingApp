import { AppRuntime } from "$ts/apps";
import { Process } from "$ts/process";
import { getPartialTree } from "$ts/server/messaging/thread";
import { ProcessStack } from "$ts/stores/process";
import { Store } from "$ts/writable";
import { App, AppMutator } from "$types/app";
import { PartiallyExtendedMessage } from "$types/messaging";

export class ThreadViewRuntime extends AppRuntime {
  public MessageId = Store<string>();
  public Tree = Store<PartiallyExtendedMessage>(null);
  public Loading = Store<boolean>(false);

  constructor(app: App, mutator: AppMutator, process: Process) {
    super(app, mutator, process);

    const args = process.args;

    const replyId = args[0];

    if (replyId) this.setMessage(replyId.toString());
    else this.closeApp();
  }

  public async setMessage(id: string) {
    this.Loading.set(true);

    const tree = await getPartialTree(id);

    if (!tree) return false;

    this.Tree.set(tree);
    this.MessageId.set(id);
    this.Loading.set(false);
  }

  public viewMessage(id: string) {
    ProcessStack.dispatch.dispatchToPid(this.process.parentPid, "open-message", id);

    this.closeApp();
  }
}
