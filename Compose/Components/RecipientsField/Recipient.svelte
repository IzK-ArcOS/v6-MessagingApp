<script lang="ts">
  import ProfilePicture from "$lib/Components/ProfilePicture.svelte";
  import { getUserPfp } from "$ts/server/user/pfp";
  import { ProfilePictures } from "$ts/stores/pfp";
  import { sleep } from "$ts/util";
  import { AllUsers } from "$types/user";
  import { onMount } from "svelte";
  export let receiver: string;
  export let receivers: string[];
  export let users: AllUsers;

  let pfp: string;

  onMount(async () => {
    pfp = await getUserPfp(receiver, "", users);
  });

  async function remove() {
    if (!receivers.includes(receiver)) return;

    receivers.splice(receivers.indexOf(receiver), 1);

    const x = [...receivers];

    receivers = [];
    await sleep(0);
    receivers = [...x];
  }
</script>

<div class="receiver-pill">
  <ProfilePicture src={pfp || ProfilePictures.def} height={20} />
  <p class="name">{receiver}</p>
  <button class="material-icons-round remove" on:click={remove}>close</button>
</div>
