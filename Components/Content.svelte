<script lang="ts">
  import Titlebar from "$state/Desktop/Components/ProcessRenderer/Window/Titlebar.svelte";
  import { Runtime } from "../ts/runtime";
  import MessageBody from "./Content/MessageBody.svelte";
  import MessageList from "./Content/MessageList.svelte";
  import Toolbar from "./Content/Toolbar.svelte";

  export let runtime: Runtime;
</script>

<div class="content">
  <Titlebar pid={runtime.pid} app={runtime.appMutator} showIcon={false} showTitle={false}>
    <Toolbar {runtime} />
  </Titlebar>
  <div class="bottom">
    <MessageList {runtime} />
    <MessageBody {runtime} />
  </div>
</div>
