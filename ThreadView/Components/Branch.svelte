<script lang="ts">
  import { PartiallyExtendedMessage } from "$types/messaging";
  import { AllUsers } from "$types/user";
  import { ThreadViewRuntime } from "../ts/runtime";
  import Item from "./Item.svelte";

  export let items: PartiallyExtendedMessage[] = [];
  export let users: AllUsers;
  export let runtime: ThreadViewRuntime;
</script>

<div class="branch">
  {#if items}
    {#each items as item}
      <Item {item} {users} {runtime} />
    {/each}
  {/if}
</div>
