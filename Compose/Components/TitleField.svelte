<script lang="ts">
  import { ComposeRuntime } from "../runtime";

  export let runtime: ComposeRuntime;

  const { Title } = runtime;
</script>

<div class="field">
  <p class="caption">Title</p>
  <div class="input">
    <input
      type="text"
      bind:value={$Title}
      placeholder="Something very important..."
      maxlength="50"
    />
  </div>
</div>
