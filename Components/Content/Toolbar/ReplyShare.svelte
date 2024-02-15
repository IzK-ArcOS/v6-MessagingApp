<script lang="ts">
  import { Runtime } from "$apps/MessagingApp/ts/runtime";

  export let runtime: Runtime;

  const { Message, HasOverlay: Composing } = runtime;

  function forward() {
    runtime.ForwardMessage();
  }

  function reply() {
    runtime.ReplyToMessage();
  }
</script>

<div class="group">
  <button
    class="material-icons-round"
    disabled={!$Message || $Composing}
    title="Reply to Message"
    on:click={reply}
  >
    reply
  </button>
  <button
    class="material-icons-round"
    disabled={!$Message || $Composing}
    title="Forward Message"
    on:click={forward}
  >
    share
  </button>
</div>
