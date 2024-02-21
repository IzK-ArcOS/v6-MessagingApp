<script lang="ts">
  import ProfilePicture from "$lib/Components/ProfilePicture.svelte";
  import { filterPartialMessageBody } from "$ts/server/messaging/utils";
  import { getUserPfp } from "$ts/server/user/pfp";
  import { PartiallyExtendedMessage } from "$types/messaging";
  import { AllUsers } from "$types/user";
  import { onMount } from "svelte";
  import { ThreadViewRuntime } from "../ts/runtime";
  import Branch from "./Branch.svelte";

  export let item: PartiallyExtendedMessage;
  export let users: AllUsers;
  export let runtime: ThreadViewRuntime;

  let pfp = "";

  onMount(async () => {
    pfp = await getUserPfp(item.sender, "", users);
  });

  function openThis() {
    runtime.viewMessage(item.id);
  }
</script>

<button class="item" on:click={openThis}>
  <ProfilePicture src={pfp} height={32} />
  <div class="context">
    <p class="name">{item.sender}</p>
    <p class="partial">
      {filterPartialMessageBody(item.partialBody)}{item.partialBody.length > 29 ? "..." : ""}
    </p>
  </div>
</button>
{#if item.replies}
  <Branch items={item.replies} {users} {runtime} />
{/if}
