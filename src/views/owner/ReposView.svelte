<script lang="ts">
  import configObj from "@app/lib/config";
  const config = configObj;

  import type { BaseUrl, NodeIdentity, NodeStats } from "@http-client";

  import * as router from "@app/lib/router";
  import * as utils from "@app/lib/utils";
  import {
    fetchRepoInfos,
    fetchRepoRidByNameAndDelegate,
  } from "@app/components/RepoCard";
  import { handleError } from "@app/views/nodes/error";

  import Loading from "@app/components/Loading.svelte";
  import Placeholder from "@app/components/Placeholder.svelte";
  import Badge from "@app/components/Badge.svelte";
  import Icon from "@app/components/Icon.svelte";
  import RepoCard from "@app/views/owner/RepoCard.svelte";

  export let baseUrl: BaseUrl;
  export let node: NodeIdentity;
  export let did: { prefix: string; pubkey: string };
  export let stats: NodeStats;

  let listState: "pinned" | "all" = "pinned";
  let page = 0;
  let hasPinnedRepos = true;

  // Reset state when baseUrl changes
  $: if (baseUrl) {
    listState = "pinned";
    page = 0;
    hasPinnedRepos = true;
  }

  let repos = [];

  $: perPage = config.owner.repos.perPage;
  $: totalPages = Math.ceil(repos.length / perPage);

  function showPinned() {
    listState = "pinned";
    page = 0;
  }

  function showAll() {
    listState = "all";
    page = 0;
  }

  async function fetchRepos(
    show: "pinned" | "all",
    perPage: number,
    page: number,
  ) {
    repos = await fetchRepoInfos(
      baseUrl,
      { show: "all", perPage, page },
      utils.formatDid(did),
    );
    if (show === "pinned") {
      repos = repos.filter(element =>
        config.owner.repos.pinned.includes(element.repo.rid),
      );
    }
    totalPages = Math.ceil(repos.length / perPage);

    if (
      hasPinnedRepos &&
      show === "pinned" &&
      page === 0 &&
      repos.length === 0
    ) {
      hasPinnedRepos = false;
      listState = "all";
      return [];
    }

    return repos;
  }
</script>

<style>
  .subtitle,
  .pagination {
    font-size: var(--font-size-small);
    color: var(--color-foreground-dim);
  }
  .pagination {
    display: flex;
    gap: 0.25rem;
    margin-left: auto;
  }
  .repos {
    margin-top: 0;
  }
  .repo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(21rem, 1fr));
    gap: 1rem;
  }
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    height: 35vh;
    font-size: var(--font-size-small);
  }
  .text-button {
    background: none;
    border: none;
    font: inherit;
    color: inherit;
    margin: 0;
    padding: 0;
  }
  .text-button:not(:disabled) {
    cursor: pointer;
  }
  .text-button:hover:not(:disabled) {
    text-decoration: underline;
  }
  .current-page {
    text-decoration: underline;
  }
  .footer {
    display: flex;
    gap: 0.5rem 1rem;
    margin-top: 1rem;
  }

  @media (max-width: 1010.98px) {
    .repos {
      margin-top: 3rem;
    }
    .footer {
      flex-direction: column;
    }
    .pagination {
      margin-left: 0;
    }
  }
</style>

<div class="repos">
  {#await fetchRepos(listState, perPage, page)}
    <div style:height="35vh">
      <Loading small center />
    </div>
  {:then repoInfos}
    {#if repoInfos.length > 0}
      <div class="repo-grid">
        {#each repoInfos as repoInfo}
          <RepoCard {baseUrl} {repoInfo}>
            <svelte:fragment slot="delegate">
              <Badge
                title={`${node.alias || utils.formatNodeId(did.pubkey)} is a delegate of this repository`}
                round
                variant="delegate"
                size="tiny"
                style="padding: 0 0.372rem; gap: 0.125rem;">
                <Icon name="badge" />
              </Badge>
            </svelte:fragment>
          </RepoCard>
        {/each}
      </div>
      <div class="footer">
        {#if listState === "pinned"}
          <div class="subtitle">
            {repoInfos.length}
            pinned {repoInfos.length === 1 ? "repository" : "repositories"} ·
            <button class="text-button" on:click={showAll}>Browse all</button>
          </div>
        {:else}
          <div class="subtitle">
            {repoInfos.length}
            {repoInfos.length === 1 ? "repository" : "repositories"}
            {#if hasPinnedRepos}
              ·
              <button class="text-button" on:click={showPinned}>
                See pinned
              </button>
            {/if}
          </div>

          {#if totalPages > 1}
            <div class="pagination">
              {#if page !== 0}
                <button class="text-button" on:click={() => (page = page - 1)}>
                  Previous
                </button>
                ·
              {/if}

              {#each Array.from({ length: Math.min(totalPages, 7) }) as _, i}
                {@const startPage = Math.max(page - 3, 0)}
                {@const pageNumber = startPage + i}
                <button
                  class="text-button"
                  class:current-page={page === pageNumber}
                  on:click={() => (page = pageNumber)}
                  disabled={page === pageNumber}>
                  {pageNumber + 1}
                </button>
              {/each}

              {#if page !== totalPages - 1}
                ·
                <button class="text-button" on:click={() => (page = page + 1)}>
                  Next
                </button>
              {/if}
            </div>
          {/if}
        {/if}
      </div>
    {:else}
      <div class="empty-state">
        {#if listState === "pinned"}
          <Placeholder
            iconName="desert"
            caption="This user doesn't have any pinned repositories." />
        {:else}
          <Placeholder
            iconName="desert"
            caption="This user doesn't have any repositories on this node." />
        {/if}
      </div>
    {/if}
  {:catch error}
    {router.push(handleError(error, utils.baseUrlToString(baseUrl)))}
  {/await}
</div>
