<script lang="ts">
  import { Runtime } from "../ts/runtime";
  import { MessagingPages } from "../ts/store";
  import Page from "./Sidebar/Page.svelte";

  export let runtime: Runtime;
</script>

<div class="sidebar">
  {#each Object.entries(MessagingPages) as [id, page]}
    <Page {id} {page} {runtime} />
  {/each}
</div>
