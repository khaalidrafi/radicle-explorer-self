<script lang="ts">
  import configObj from "@app/lib/config";
  const config = configObj;

  import Button from "@app/components/Button.svelte";
  import Icon from "@app/components/Icon.svelte";
  import Link from "@app/components/Link.svelte";
  import Popover from "@app/components/Popover.svelte";

  import Help from "./Help.svelte";
  import Settings from "./Settings.svelte";
</script>

<style>
  .mobile-footer {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
    z-index: 1;
    gap: 0.5rem;
    border-top: 1px solid var(--color-fill-separator);
    background-color: var(--color-background-default);
  }
  .divider {
    border-bottom: 1px solid var(--color-fill-separator);
    margin: 1.5rem 0;
  }
</style>

<div class="mobile-footer">
  <Link
    style="width: 100%; display: flex; align-items: center; justify-content: center;"
    route={{
      resource: "users",
      baseUrl: {
        hostname: config.user.defaultNode.hostname,
        port: config.user.defaultNode.port,
        scheme: config.user.defaultNode.scheme,
      },
      did: config.user.did,
    }}>
    <img
      width="16"
      height="16"
      class="logo"
      alt="{config.user.sitename} logo"
      src="/logo.svg" />
  </Link>

  <slot />

  <div style:width="100%">
    <Popover popoverPositionBottom="3rem" popoverPositionRight="0">
      <Button
        let:expanded
        slot="toggle"
        variant={expanded ? "secondary" : "secondary-mobile-toggle"}
        styleWidth="100%"
        let:toggle
        on:click={toggle}>
        <Icon name="menu" />
      </Button>

      <div slot="popover">
        <Help hideShortcuts />
        <div class="divider"></div>
        <Settings />
      </div>
    </Popover>
  </div>
</div>
