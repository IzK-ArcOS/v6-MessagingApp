<script lang="ts">
  import { Runtime } from "$apps/MessagingApp/ts/runtime";
  import ApiReveal from "$lib/Components/ApiReveal.svelte";
  import { UserName } from "$ts/stores/user";
  import { Plural } from "$ts/util";

  export let runtime: Runtime;

  const { Store, Page, Loading, Message, HasOverlay: Composing, ViewingMessageSource } = runtime;
</script>

<div class="statusbar">
  <div class="segment">
    {$UserName}
  </div>
  <div class="segment">Server <ApiReveal /></div>
  <div class="segment">
    {#if $Store && !$Loading}
      {$Store.length} {Plural("message", $Store.length)} in {$Page}
    {:else}
      Please wait...
    {/if}
  </div>
  {#if $Message}
    <div class="segment">
      From: {$Message.sender}
    </div>
  {/if}
  <div class="segment right">
    <span class="material-icons-round" class:disabled={$Message ? !$Message.replyingTo : true}>
      reply
    </span>
    <span class="material-icons-round" class:disabled={!$Loading}>sync</span>
    <span class="material-icons-round" class:disabled={!$Composing}>edit</span>
    <span class="material-icons-round" class:disabled={!$ViewingMessageSource}>code</span>
  </div>
  <div class="segment">
    {$Loading ? "Loading..." : "Ready."}
  </div>
</div>
