<script lang="ts">
  import { Runtime } from "$apps/MessagingApp/ts/runtime";
  import ApiReveal from "$lib/Components/ApiReveal.svelte";
  import { UserName } from "$ts/stores/user";
  import { Plural } from "$ts/util";

  export let runtime: Runtime;

  const { Store, Page, Loading, Message } = runtime;
</script>

<div class="statusbar">
  <div class="segment">
    Logged in as {$UserName}
  </div>
  <div class="segment">Server <ApiReveal /></div>
  <div class="segment">
    {#if $Store && !$Loading}
      {$Store.length} {Plural("message", $Store.length)} in {$Page}
    {:else}
      Please wait...
    {/if}
  </div>
  <div class="segment">
    {#if $Message}
      Viewing #{$Message.id} from {$Message.sender}
    {:else}
      Not viewing any message.
    {/if}
  </div>
  <div class="segment right">
    {$Loading ? "Loading..." : "Ready."}
  </div>
</div>
