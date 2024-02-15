<script lang="ts">
  import ComposeField from "./Components/ComposeField.svelte";
  import RecipientsField from "./Components/RecipientsField.svelte";
  import TitleField from "./Components/TitleField.svelte";
  import Toolbar from "./Components/Toolbar.svelte";
  import { ComposeRuntime } from "./runtime";

  import "./css/main.css";

  export let runtime: ComposeRuntime;
</script>

<TitleField {runtime} />
<RecipientsField {runtime} />
<ComposeField {runtime} />
<Toolbar {runtime} />
