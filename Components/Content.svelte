<script lang="ts">
  import { Runtime } from "../ts/runtime";
  import MessageBody from "./Content/MessageBody.svelte";
  import MessageList from "./Content/MessageList.svelte";

  export let runtime: Runtime;
</script>

<div class="content">
  <div class="toolbar">toolbar</div>
  <div class="bottom">
    <MessageList {runtime} />
    <MessageBody {runtime} />
  </div>
</div>
