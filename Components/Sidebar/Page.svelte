<script lang="ts">
  import { Runtime } from "$apps/MessagingApp/ts/runtime";
  import { MessagingPage } from "$apps/MessagingApp/ts/types";

  export let id: string;
  export let page: MessagingPage;
  export let runtime: Runtime;

  const { Page } = runtime;

  function navigate() {
    runtime.navigate(id);
  }
</script>

<button class="page" class:active={$Page == id} on:click={navigate}>
  <span class="material-icons-round">{page.icon}</span>
  <span>{page.name}</span>
</button>
