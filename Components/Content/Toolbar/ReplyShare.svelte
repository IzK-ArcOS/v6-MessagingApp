<script lang="ts">
  import { Runtime } from "$apps/MessagingApp/ts/runtime";

  export let runtime: Runtime;

  const { Message } = runtime;
</script>

<div class="group">
  <button class="material-icons-round" disabled={!$Message}>reply</button>
  <button class="material-icons-round" disabled={!$Message}>share</button>
</div>
