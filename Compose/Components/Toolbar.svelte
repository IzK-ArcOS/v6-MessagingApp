<script lang="ts">
  import { ComposeRuntime } from "../ts/runtime";

  export let runtime: ComposeRuntime;

  const { Title, Body, Receivers, COMPOSE_LIMIT, Previewing, ReplyId } = runtime;

  function discard() {
    runtime.discard();
  }

  function send() {
    runtime.send();
  }
</script>

<div class="toolbar">
  <p class="quota">
    <span>{$Body.length} / {COMPOSE_LIMIT} characters</span>
    {#if $ReplyId}
      <span> - Replying to {$Receivers[0]}</span>
    {/if}
  </p>
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
      {$ReplyId ? "Reply" : "Send"}
    </button>
  </div>
</div>
