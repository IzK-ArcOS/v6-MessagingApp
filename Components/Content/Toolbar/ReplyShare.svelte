<script lang="ts">
  import { Runtime } from "$apps/MessagingApp/ts/runtime";

  export let runtime: Runtime;

  const { Message, Composing } = runtime;

  function forward() {
    runtime.ForwardMessage();
  }
</script>

<div class="group">
  <button class="material-icons-round" disabled={!$Message || $Composing} title="Reply to Message">
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
