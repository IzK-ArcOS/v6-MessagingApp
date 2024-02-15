<script lang="ts">
  import { sleep } from "$ts/util";
  import { AllUsers } from "$types/user";
  import { onMount } from "svelte";
  import { ComposeRuntime } from "../runtime";
  import Recipient from "./RecipientsField/Recipient.svelte";
  import { getUsers } from "$ts/server/user/get";

  export let runtime: ComposeRuntime;

  const { Receivers, ReplyId } = runtime;

  let users: AllUsers;

  onMount(async () => {
    users = await getUsers();
  });

  async function add() {
    if (input == "none") return;

    $Receivers.push(input);

    const x = [...$Receivers];

    $Receivers = [];
    await sleep(0);
    $Receivers = [...x];

    input = "none";
  }

  let input: string;
</script>

{#if users}
  <div class="field recipients">
    <p class="caption">Recipients</p>
    <div class="input">
      {#if $Receivers.length}
        <div class="current">
          {#each $Receivers as receiver}
            <Recipient bind:receivers={$Receivers} {receiver} {users} />
          {/each}
        </div>
      {/if}
      {#if Object.entries(users).length !== $Receivers.length && $Receivers.length < 11 && !($ReplyId && $Receivers.length > 0)}
        <select class="adder" bind:value={input} on:change={add}>
          <option value="none" disabled selected>Add...</option>
          {#each Object.entries(users) as [name, _]}
            {#if !$Receivers.includes(name)}
              <option value={name}>{name}</option>
            {/if}
          {/each}
        </select>
      {/if}
    </div>
  </div>
{/if}
