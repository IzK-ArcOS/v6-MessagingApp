<script lang="ts">
  import Sidebar from "./Components/Sidebar.svelte";
  import "./css/main.css";
  import { Runtime } from "./ts/runtime";

  export let runtime: Runtime;
</script>

<Sidebar {runtime} />
