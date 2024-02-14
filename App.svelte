<script lang="ts">
  import Content from "./Components/Content.svelte";
  import Sidebar from "./Components/Sidebar.svelte";
  import "./css/main.css";
  import { Runtime } from "./ts/runtime";

  export let runtime: Runtime;
</script>

<Sidebar {runtime} />
<Content {runtime} />
