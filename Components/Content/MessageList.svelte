<script lang="ts">
  import { Runtime } from "$apps/MessagingApp/ts/runtime";
  import Message from "./MessageList/Message.svelte";

  export let runtime: Runtime;

  const { Store } = runtime;
</script>

<div class="message-list">
  {#each $Store as message}
    <Message {message} {runtime} />
  {/each}
</div>
