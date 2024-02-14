<script lang="ts">
  import { Runtime } from "$apps/MessagingApp/ts/runtime";
  import Code from "./Toolbar/Code.svelte";
  import Compose from "./Toolbar/Compose.svelte";
  import Left from "./Toolbar/Left.svelte";
  import ReplyShare from "./Toolbar/ReplyShare.svelte";
  import Store from "./Toolbar/Store.svelte";

  export let runtime: Runtime;
</script>

<div class="toolbar">
  <Left {runtime} />
  <div class="sep" />
  <ReplyShare {runtime} />
  <div class="sep" />
  <Store {runtime} />
  <div class="sep" />
  <Code {runtime} />
  <Compose {runtime} />
  <div class="sep" />
</div>
