<script lang="ts">
  import { Runtime } from "$apps/MessagingApp/ts/runtime";

  export let runtime: Runtime;

  const { ViewingMessageSource } = runtime;

  function toggle() {
    $ViewingMessageSource = !$ViewingMessageSource;
  }
</script>

<button class="material-icons-round" title={$ViewingMessageSource ? "View Parsed" : "View Source"} on:click={toggle}>
  {$ViewingMessageSource ? "code_off" : "code"}
</button>
