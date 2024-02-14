<script lang="ts">
  import { Runtime } from "$apps/MessagingApp/ts/runtime";
  import MarkdownRenderer from "$lib/Components/MarkdownRenderer.svelte";
  import { sleep } from "$ts/util";

  export let runtime: Runtime;

  const { Message, ViewingMessageSource } = runtime;

  let body = "";

  Message.subscribe(async (v) => {
    if (!v) return;

    body = "";
    await sleep(5);
    body = v.body;
  });
</script>

<div class="message-body">
  {#if !$ViewingMessageSource}
    <MarkdownRenderer content={body} />
  {:else}
    <textarea readonly value={body} class="source" />
  {/if}
</div>
