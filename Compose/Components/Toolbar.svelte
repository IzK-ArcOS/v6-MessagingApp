<script lang="ts">
  import { ComposeRuntime } from "../runtime";

  export let runtime: ComposeRuntime;

  const { Title, Body, Receivers, COMPOSE_LIMIT, Previewing } = runtime;

  function discard() {
    runtime.discard();
  }

  function send() {
    runtime.send();
  }
</script>

<div class="toolbar">
  <p class="quota">{$Body.length} / {COMPOSE_LIMIT} characters</p>
  <div class="view-modes">
    <button
      class="material-icons-round"
      class:suggested={$Previewing}
      on:click={() => ($Previewing = true)}
    >
      visibility
    </button>
    <button
      class="material-icons-round"
      class:suggested={!$Previewing}
      on:click={() => ($Previewing = false)}
    >
      edit
    </button>
  </div>
  <div class="sep" />
  <div class="actions">
    <button on:click={discard}>Discard</button>
    <button class="suggested" disabled={!$Body || !$Receivers.length || !$Title} on:click={send}>
      Send
    </button>
  </div>
</div>
