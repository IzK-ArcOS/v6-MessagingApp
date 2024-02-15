<script lang="ts">
  import MarkdownRenderer from "$lib/Components/MarkdownRenderer.svelte";
  import { ComposeRuntime } from "../runtime";

  export let runtime: ComposeRuntime;

  const { Previewing, Body, COMPOSE_LIMIT } = runtime;
</script>

<div class="compose-body">
  {#if !$Previewing}
    <textarea
      class="composer"
      bind:value={$Body}
      placeholder="New Message..."
      maxlength={COMPOSE_LIMIT}
    />
  {:else}
    <MarkdownRenderer content={$Body} />
  {/if}
</div>
