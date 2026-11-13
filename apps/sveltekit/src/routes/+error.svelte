<script lang="ts">
  import { page } from "$app/state";
  import NotFound from "#lib/components/NotFound.svelte";
</script>

{#if page.status === 404}
  <NotFound />
{:else}
  <section class="not-found">
    <h1>Something went wrong</h1>
    <p>{page.error?.message}</p>
    <p><a class="button" href="/">Back to the home page</a></p>
  </section>
{/if}
