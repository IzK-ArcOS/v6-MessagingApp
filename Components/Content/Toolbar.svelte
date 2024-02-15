<script lang="ts">
  import { Runtime } from "$apps/MessagingApp/ts/runtime";
  import { UserDataStore } from "$ts/stores/user";
  import Code from "./Toolbar/Code.svelte";
  import Compose from "./Toolbar/Compose.svelte";
  import Left from "./Toolbar/Left.svelte";
  import ReplyShare from "./Toolbar/ReplyShare.svelte";
  import Store from "./Toolbar/Store.svelte";

  export let runtime: Runtime;

  const { HasOverlay: Composing } = runtime;
</script>

<div class="toolbar" class:disabled={$Composing}>
  {#if $UserDataStore.sh.window.lefttb}
    <div class="sep" />
  {/if}
  <Left {runtime} />
  <div class="sep" />
  <ReplyShare {runtime} />
  <div class="sep" />
  <Store {runtime} />
  <div class="sep" />
  <Code {runtime} />
  <Compose {runtime} />
  {#if !$UserDataStore.sh.window.lefttb}
    <div class="sep" />
  {/if}
</div>
