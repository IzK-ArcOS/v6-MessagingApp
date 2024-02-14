<script lang="ts">
  import { Runtime } from "$apps/MessagingApp/ts/runtime";
  import { onMount } from "svelte";
  import Message from "./MessageList/Message.svelte";
  import { AllUsers } from "$types/user";
  import { getUsers } from "$ts/server/user/get";

  export let runtime: Runtime;

  const { Store } = runtime;

  let users: AllUsers;

  onMount(async () => {
    users = await getUsers();
  });
</script>

{#if users}
  <div class="message-list">
    {#each $Store as message}
      <Message {message} {runtime} {users} />
    {/each}
  </div>
{/if}
