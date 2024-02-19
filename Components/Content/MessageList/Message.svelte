<script lang="ts">
  import { Runtime } from "$apps/MessagingApp/ts/runtime";
  import ProfilePicture from "$lib/Components/ProfilePicture.svelte";
  import { filterPartialMessageBody } from "$ts/server/messaging/utils";
  import { getUserPfp } from "$ts/server/user/pfp";
  import { UserName } from "$ts/stores/user";
  import { PartialMessage } from "$types/messaging";
  import { AllUsers } from "$types/user";
  import { onMount } from "svelte";

  export let runtime: Runtime;
  export let message: PartialMessage;
  export let users: AllUsers;

  const { Message, SearchResults, SearchFilter } = runtime;

  let pfp = "";
  let username = "";
  let isUnread = false;

  onMount(async () => {
    const isReceived = message.receiver == $UserName;

    username = isReceived ? message.sender : message.receiver;
    isUnread = isReceived && !message.read;

    pfp = await getUserPfp(username, "", users);
  });

  function read() {
    runtime.openMessage(message.id);
  }
</script>

{#if $SearchFilter ? $SearchResults.includes(message.id) : true}
  <button
    class="message-link"
    on:click={read}
    class:selected={$Message && $Message.id == message.id}
    class:unread={isUnread}
    class:reply={!!message.replyingTo}
    class:sent={message.sender == $UserName}
  >
    <ProfilePicture height={32} src={pfp} />
    <div class="context">
      <span class="receiver">
        <span>{username}</span>
        <div class="unread-dot" />
      </span>
      <span class="partial">{filterPartialMessageBody(message.partialBody)}</span>
    </div>
  </button>
{/if}
