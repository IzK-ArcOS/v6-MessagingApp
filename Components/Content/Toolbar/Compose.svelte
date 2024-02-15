<script lang="ts">
  import { Runtime } from "$apps/MessagingApp/ts/runtime";

  export let runtime: Runtime;

  const { HasOverlay: Composing } = runtime;

  function compose() {
    runtime.Compose();
  }
</script>

<button class="compose-button suggested" on:click={compose} disabled={$Composing}>Compose</button>
