<script lang="ts">
  import type { BaseUrl, NodeIdentity, NodeStats } from "@http-client";

  import * as router from "@app/lib/router";
  import * as utils from "@app/lib/utils";
  import { handleError } from "@app/views/nodes/error";
  import dompurify from "dompurify";
  import { markdown } from "@app/lib/markdown";
  import configObj from "@app/lib/config";
  const config = configObj;

  import Avatar from "@app/components/Avatar.svelte";
  import Button from "@app/components/Button.svelte";
  import Command from "@app/components/Command.svelte";
  import ExternalLink from "@app/components/ExternalLink.svelte";
  import Help from "@app/App/Help.svelte";
  import Icon from "@app/components/Icon.svelte";
  import IconButton from "@app/components/IconButton.svelte";
  import Id from "@app/components/Id.svelte";
  import Link from "@app/components/Link.svelte";
  import Loading from "@app/components/Loading.svelte";
  import MobileFooter from "@app/App/MobileFooter.svelte";
  import Placeholder from "@app/components/Placeholder.svelte";
  import Popover from "@app/components/Popover.svelte";
  import Separator from "@app/views/repos/Separator.svelte";
  import Settings from "@app/App/Settings.svelte";
  import UserAddress from "@app/views/owner/UserAddress.svelte";
  import ReposView from "./ReposView.svelte";

  export let baseUrl: BaseUrl;
  export let node: NodeIdentity;
  export let did: { prefix: string; pubkey: string };
  export let nodeAvatarUrl: string | undefined;
  export let stats: NodeStats;

  let scrollY: number;
  let top: number;

  $: if (scrollY >= 0 && scrollY < 289) {
    top = 288 - scrollY;
  } else if (scrollY >= 289) {
    top = 0;
  }

  $: background = node.bannerUrl
    ? `url("${node.bannerUrl}")`
    : `url("/images/default-seed-header.png")`;

  function render(content: string): string {
    return dompurify.sanitize(
      markdown({ linkify: true, emojis: true }).parse(content) as string,
    );
  }
</script>

<style>
  .below-header {
    display: grid;
    grid-template: auto 1fr auto / auto 1fr auto;
  }
  .breadcrumbs {
    display: flex;
    gap: 0.5rem;
    flex-direction: row;
    align-items: center;
    height: 3.5rem;
    font-weight: var(--font-weight-semibold);
    font-size: var(--font-size-small);
    padding: 0.5rem 0.5rem 0.5rem 1rem;
    justify-content: flex-end;
  }

  .bio {
    word-break: break-word;
  }

  .header {
    grid-column: 1 / 4;
    border-bottom: 1px solid var(--color-fill-separator);
    height: 18rem;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    position: sticky;
    z-index: 5;
    background-color: var(--color-background-default);
    background-position: center;
    background-size: cover;
  }
  .sidebar {
    grid-column: 1 / 2;
    border-right: 1px solid var(--color-fill-separator);
    width: 30rem;
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1.5rem;
    height: 100%;
    z-index: 1;
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-small);
  }
  .empty-state,
  .loading {
    height: 100%;
  }

  .content {
    grid-column: 2 / 3;
    margin-left: 30rem;
  }
  .mobile-header {
    height: 8rem;
    display: flex;
    align-items: flex-end;
    border-bottom: 1px solid var(--color-fill-separator);
    background-color: var(--color-background-default);
    background-position: center;
    background-size: cover;
  }
  .container {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .wrapper {
    padding: 1.5rem;
    max-width: 78rem;
    margin: 0 auto;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .sidebar-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 2rem;
  }

  .logo {
    height: var(--button-regular-height);
    margin: 0 0.5rem;
  }

  .mobile-footer {
    display: none;
  }
  .footer {
    display: flex;
    border-right: 1px solid var(--color-fill-separator);
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
  }
  .subtitle {
    font-size: var(--font-size-small);
    color: var(--color-foreground-dim);
    padding: 1rem 0;
  }
  .avatar {
    border-radius: var(--border-radius-tiny);
    margin-right: 0.5rem;
  }

  .user-info {
    display: grid;
    grid-template-columns: 64px minmax(0, 30rem) max-content;
    column-gap: 1rem;
    margin-bottom: 1.5rem;
  }
  .follow-label {
    display: block;
    font-size: var(--font-size-small);
    font-weight: var(--font-weight-regular);
    margin-bottom: 0.75rem;
  }
  .id {
    max-width: 22rem;
  }
  @media (max-width: 1010.98px) {
    .wrapper {
      padding: 1.5rem;
    }
    .sidebar {
      width: 325px;
    }
    .id {
      max-width: 12rem;
    }
    .layout {
      grid-template-columns: 325px auto;
      grid-template-areas:
        "header header"
        "sidebar main"
        "footer main";
    }
  }

  @media (max-width: 719.98px) {
    .layout {
      height: 100%;
    }

    .content {
      overflow-x: hidden;
      margin-left: 0;
    }
    .below-header {
      height: 100%;
    }
    .header {
      display: none;
    }
    .wrapper {
      padding: 1rem;
    }
    .empty-state,
    .loading {
      height: calc(100% - 6rem);
    }
    .footer {
      display: none;
    }
    .mobile-footer {
      grid-area: footer;
      margin-top: auto;
      display: grid;
      grid-column: 1 / 4;
    }
  }
</style>

<svelte:window bind:scrollY />

<div class="layout">
  <div class="header" style:background-image={background}>
    <div class="breadcrumbs">
      <Link
        style="display: flex; align-items: center;"
        route={{ resource: "owner", baseUrl: undefined }}>
        <div
          style="background-color: var(--color-background-default);border-radius: var(--border-radius-small); display: flex;">
          <img
            style:margin="0 0.5rem"
            width="24"
            height="24"
            class="logo"
            alt="{config.owner.sitename} logo"
            src="/logo.svg" />
        </div>
      </Link>
    </div>
  </div>

  <div class="below-header">
    <div
      class="sidebar global-hide-on-mobile-down"
      style:top={`${top}px`}
      style:height={`calc(100% - ${top}px)`}>
        <div class="title">
            <div class="user-info">
                <div style:margin-right="0.5rem">
                    <Avatar nodeId={did.pubkey} variant="large" />
                </div>
                <div style:margin-top="0.25rem">
                    <div class="txt-medium txt-semibold txt-overflow">
                        {node.alias || utils.formatNodeId(did.pubkey)}
                    </div>
                    <div style:margin-top="0.25rem">
                        <UserAddress {did} />
                    </div>
                </div>
                <div
                    class="global-hide-on-small-desktop-down"
                    style="justify-self: end;">
                    <Popover popoverPositionTop="2.5rem">
                        <Button
                            slot="toggle"
                            let:toggle
                            on:click={toggle}
                            variant="secondary">
                            <div class="global-flex-item">
                                <Icon name="plus" />
                                <span>Follow</span>
                            </div>
                        </Button>
                        <div slot="popover" style:width="24rem">
                            <span class="follow-label">
                                Use the <ExternalLink href="https://radicle.xyz">
                                Radicle CLI
                                </ExternalLink> to start following this user.
                            </span>
                            <span class="follow-label">
                                Following a user ensures that their contributions are fetched
                                onto your device.
                            </span>
                            <Command command={`rad follow ${did.pubkey}`} />
                        </div>
                    </Popover>
                </div>
            </div>
            {#if config.owner.bio}
                <div class="bio txt-small">
                    {@html render(config.owner.bio)}
                </div>
            {:else}
                <div
                    class="global-flex-item txt-small txt-missing"
                    style:align-items="center"
                    style:justify-content="space-between"
                    style:gap="0.25rem">
                    No description configured.
                    <Popover popoverPositionTop="0" popoverPositionLeft="2.25rem">
                        <IconButton slot="toggle" let:toggle on:click={toggle}>
                            <Icon name="info" />
                        </IconButton>

                        <div slot="popover" class="box">
                            If you're the owner of this node, you can customize this page by
                            setting the
                            <code>avatarUrl</code>
                            ,
                            <code>bannerUrl</code>
                            and
                            <code>description</code>
                            fields under the
                            <code>web</code>
                            object in your node config.
                            <div style:margin-top="1rem">
                                <Command command="rad config edit" fullWidth />
                            </div>
                        </div>
                    </Popover>
                </div>
            {/if}

            <div style:margin-bottom="1rem">
                <div class="sidebar-item txt-small">
                    <span>SSH Key</span>
                    <Id id={node.ssh.full}>
                        <div class="id txt-overflow">{node.ssh.full}</div>
                    </Id>
                </div>
                <div class="sidebar-item txt-small">
                    <span>SSH Hash</span>
                    <Id id={node.ssh.hash}>
                        <div class="id txt-overflow">{node.ssh.hash}</div>
                    </Id>
                </div>
            </div>
        </div>
        <div class="sidebar-footer">
        <div
          style:margin-top="1.5rem"
          style:display="flex"
          style:justify-content="space-between"
          style:flex-direction="row">
          <div class="horizontal-buttons">
            <Popover popoverPositionBottom="2.5rem" popoverPositionLeft="0">
              <Button
                variant="outline"
                title="Settings"
                slot="toggle"
                let:toggle
                on:click={toggle}>
                <Icon name="settings" />
                Settings
              </Button>

              <Settings slot="popover" />
            </Popover>
          </div>
          <div class="horizontal-buttons">
            <Popover popoverPositionBottom="2.5rem" popoverPositionLeft="0">
              <Button
                variant="outline"
                title="Help"
                slot="toggle"
                let:toggle
                on:click={toggle}>
                <Icon name="help" />
                Help
              </Button>
              <Help slot="popover" />
            </Popover>
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="global-hide-on-small-desktop-up">
        <div
          class="mobile-header txt-huge txt-semibold"
          style:background-image={background}>
        </div>
      </div>
      <div class="container">
        <div class="wrapper">
          <div class="global-hide-on-small-desktop-up user-info">
            <div style:margin-right="0.5rem">
              <Avatar nodeId={did.pubkey} variant="large" />
            </div>
            <div style:margin-top="0.25rem">
              <div class="txt-medium txt-semibold txt-overflow">
                {node.alias || utils.formatNodeId(did.pubkey)}
              </div>
              <div style:margin-top="0.25rem">
                <UserAddress {did} />
              </div>
            </div>
          </div>
          {#if config.owner.bio}
            <div
              class="global-hide-on-small-desktop-up"
              style:margin-top="1.5rem"
              style:display="flex"
              style:flex-direction="column"
              style:gap="0.25rem">
              <div class="bio txt-small">
                {config.owner.bio}
              </div>
            </div>
          {:else}
            <div
              class="global-flex-item txt-small txt-missing global-hide-on-small-desktop-up"
              style:margin-top="1.5rem">
              No description configured.
            </div>
          {/if}

          <ReposView {baseUrl} {did} {node} {stats} />
        </div>
      </div>
    </div>
    <div class="mobile-footer">
      <MobileFooter>
        <div style:width="100%">
          <Popover popoverPositionBottom="3rem" popoverPositionRight="-7.5rem">
            <Button
              let:expanded
              slot="toggle"
              variant={expanded ? "secondary" : "secondary-mobile-toggle"}
              styleWidth="100%"
              let:toggle
              on:click={toggle}>
              <Icon name="info" />
            </Button>

            <div slot="popover" style:width="20rem">
              <div class="sidebar-item txt-small">
                <span>SSH Key</span>
                <Id id={node.ssh.full}>
                  <div class="id txt-overflow">{node.ssh.full}</div>
                </Id>
              </div>
              <div class="sidebar-item txt-small">
                <span>SSH Hash</span>
                <Id id={node.ssh.hash}>
                  <div class="id txt-overflow">{node.ssh.hash}</div>
                </Id>
              </div>
            </div>
          </Popover>
        </div>
      </MobileFooter>
    </div>
  </div>
</div>
