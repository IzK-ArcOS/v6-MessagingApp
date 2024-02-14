<script lang="ts">
  import { Runtime } from "$apps/MessagingApp/ts/runtime";
  import { filterPartialMessageBody } from "$ts/server/messaging/utils";
  import { getUserPfp } from "$ts/server/user/pfp";
  import { UserName } from "$ts/stores/user";
  import { PartialMessage } from "$types/messaging";
  import { onMount } from "svelte";

  export let runtime: Runtime;
  export let message: PartialMessage;

  let pfp = "";
  let username = "";

  onMount(async () => {
    console.log($UserName, message.sender, message.receiver);
    username = message.receiver == $UserName ? message.sender : message.receiver;

    pfp = await getUserPfp(username);
  });

  function read() {
    runtime.openMessage(message.id);
  }
</script>

<button class="message-link" on:click={read}>
  <img src={pfp} alt="" />
  <div class="context">
    <span class="receiver">{username}</span>
    <span class="partial">{filterPartialMessageBody(message.partialBody)}</span>
  </div>
</button>

<style scoped>
  img {
    height: 32px;
  }
</style>
