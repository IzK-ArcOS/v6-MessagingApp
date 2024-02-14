<script lang="ts">
  import { Runtime } from "$apps/MessagingApp/ts/runtime";
  import { Store } from "$ts/writable";

  export let runtime: Runtime;

  let value = Store<string>();

  value.subscribe((v) => {
    runtime.Search(v);
  });

  function refresh() {
    runtime.Update();
  }
</script>

<div class="left">
  <div class="search-box">
    <span class="material-icons-round">search</span>
    <input type="text" bind:value={$value} placeholder="Search" />
  </div>
  <button class="material-icons-round" on:click={refresh}>refresh</button>
</div>
