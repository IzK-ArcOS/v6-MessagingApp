<script lang="ts">
  import MarkdownRenderer from "$lib/Components/MarkdownRenderer.svelte";
  import { ComposeRuntime } from "../ts/runtime";

  export let runtime: ComposeRuntime;

  const { Previewing, Body, COMPOSE_LIMIT, ReplyId } = runtime;
</script>

<div class="compose-body">
  {#if !$Previewing}
    <textarea
      class="composer"
      bind:value={$Body}
      placeholder={$ReplyId ? "New Reply..." : "New Message..."}
      maxlength={COMPOSE_LIMIT}
    />
  {:else}
    <MarkdownRenderer content={$Body} />
  {/if}
</div>
