<script lang="ts">
  import { Runtime } from "$apps/MessagingApp/ts/runtime";
  import MarkdownRenderer from "$lib/Components/MarkdownRenderer.svelte";
  import { formatBytes } from "$ts/bytes";
  import { sleep } from "$ts/util";
  import dayjs from "dayjs";

  export let runtime: Runtime;

  const { Message, ViewingMessageSource } = runtime;

  let isThread = false;
  let body = "";
  let sent = "on 1 January 1970 at 12:00";

  Message.subscribe(async (v) => {
    if (!v) return (isThread = false);

    isThread = !!(v.replyingTo || (v.replies && v.replies.length));

    body = "";
    await sleep(5);
    body = v.body;
    sent = dayjs(v.timestamp).format("[on] D MMMM YYYY [at] H:mm");
  });

  function thread() {
    runtime.ViewThread($Message.id);
  }
</script>

<div class="message-body" class:threading={isThread}>
  <div class="message-content">
    {#if !$ViewingMessageSource}
      <MarkdownRenderer content={body} />
      {#if $Message && body}
        <div class="timestamp">
          Sent by {$Message.sender}
          {sent} ({formatBytes(body.length)})
        </div>
      {/if}
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
