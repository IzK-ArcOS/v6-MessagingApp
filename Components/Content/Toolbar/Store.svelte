<script lang="ts">
  import { Runtime } from "$apps/MessagingApp/ts/runtime";
  import { isArchived } from "$ts/server/messaging/archive";
  import { UserName } from "$ts/stores/user";

  export let runtime: Runtime;

  const { Message, HasOverlay: Composing } = runtime;

  let archived = false;

  Message.subscribe((v) => {
    if (!v) return;

    archived = isArchived(v.id);
  });

  function archive() {
    runtime.ArchiveMessage();
  }

  function saveMessage() {
    runtime.SaveMessage();
  }

  function deleteMessage() {
    runtime.DeleteMessage();
  }
</script>

<div class="group">
  <button
    class="material-icons-round"
    disabled={!$Message || $Composing}
    on:click={saveMessage}
    title="Save Message..."
  >
    save
  </button>
  <button
    class="material-icons-round"
    disabled={!$Message || $Message.receiver !== $UserName || $Composing}
    on:click={deleteMessage}
    title="Delete Message"
  >
    delete
  </button>
  <button
    class="material-icons-round"
    disabled={!$Message || $Composing}
    title={archived ? "Unarchive message" : "Archive message"}
    on:click={archive}
  >
    {archived ? "unarchive" : "archive"}
  </button>
</div>
