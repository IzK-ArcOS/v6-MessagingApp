<script lang="ts">
  import Spinner from "$lib/Components/Spinner.svelte";
  import { getUsers } from "$ts/server/user/get";
  import { AllUsers } from "$types/user";
  import { onMount } from "svelte";
  import Item from "./Components/Item.svelte";
  import "./css/main.css";
  import { ThreadViewRuntime } from "./ts/runtime";

  export let runtime: ThreadViewRuntime;

  const { Tree, MessageId, Loading } = runtime;

  let users: AllUsers;

  onMount(async () => {
    users = await getUsers();
  });

  function close() {
    runtime.closeApp();
  }
</script>

{#if $MessageId && $Tree && users}
  <div class="top">
    <Item item={$Tree} {runtime} {users} />
  </div>
  <div class="bottom">
    <p class="of">Thread of #{$Tree.id}</p>
    <button class="suggested" on:click={close}>Close</button>
  </div>
{/if}
{#if $Loading}
  <Spinner height={32} />
{/if}
