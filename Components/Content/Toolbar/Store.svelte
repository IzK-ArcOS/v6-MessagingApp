<script lang="ts">
  import { Runtime } from "$apps/MessagingApp/ts/runtime";
  import { isArchived } from "$ts/server/messaging/archive";
  import Message from "../MessageList/Message.svelte";

  export let runtime: Runtime;

  const { Message } = runtime;

  let archived = false;

  Message.subscribe((v) => {
    if (!v) return;

    console.log("updating");

    archived = isArchived(v.id);
  });

  function archive() {
    runtime.archiveMessage();
  }

  function saveMessage() {
    runtime.SaveMessage();
  }
</script>

<div class="group">
  <button class="material-icons-round" disabled={!$Message} on:click={saveMessage}>save</button>
  <button class="material-icons-round" disabled={!$Message}>delete</button>
  <button class="material-icons-round" disabled={!$Message} title={archived ? "Unarchive message" : "Archive message"} on:click={archive}>
    {archived ? "unarchive" : "archive"}
  </button>
</div>
