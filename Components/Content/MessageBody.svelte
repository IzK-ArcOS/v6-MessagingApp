<script lang="ts">
  import { Runtime } from "$apps/MessagingApp/ts/runtime";
  import MarkdownRenderer from "$lib/Components/MarkdownRenderer.svelte";
  import { sleep } from "$ts/util";

  export let runtime: Runtime;

  const { Message, ViewingMessageSource } = runtime;

  let isThread = false;
  let body = "";

  Message.subscribe(async (v) => {
    if (!v) return (isThread = false);

    isThread = !!(v.replyingTo || (v.replies && v.replies.length));

    body = "";
    await sleep(5);
    body = v.body;
  });

  function thread() {
    runtime.ViewThread($Message.id);
  }
</script>

<div class="message-body" class:threading={isThread}>
  <div class="message-content">
    {#if !$ViewingMessageSource}
      <MarkdownRenderer content={body} />
    {:else}
      <textarea readonly value={body} class="source" />
    {/if}
  </div>
  {#if isThread}
    <div class="threading-notice">
      <p class="notice">Message is part of a thread.</p>
      <button class="suggested" on:click={thread}>View Thread</button>
    </div>
  {/if}
</div>
