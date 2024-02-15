<script lang="ts">
  import { Runtime } from "$apps/MessagingApp/ts/runtime";
  import Spinner from "$lib/Components/Spinner.svelte";
  import { getUsers } from "$ts/server/user/get";
  import { AllUsers } from "$types/user";
  import { onMount } from "svelte";
  import Message from "./MessageList/Message.svelte";

  export let runtime: Runtime;

  const { Store, Loading } = runtime;

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
    {#if !$Store.length}
      {#if !$Loading}
        <p class="none">No messages here!</p>
      {:else}
        <Spinner height={32} />
      {/if}
    {/if}
  </div>
{/if}
