import { AppRuntime } from "$ts/apps/runtime";
import { Process } from "$ts/process";
import { Store } from "$ts/writable";
import type { App, AppMutator } from "$types/app";
import { Message, PartialMessage } from "$types/messaging";

export class Runtime extends AppRuntime {
  public Store = Store<PartialMessage[]>();
  public Message = Store<Message>();

  constructor(app: App, mutator: AppMutator, process: Process) {
    super(app, mutator, process);
  }

  async Update() {}
}
