<template lang="html">
  <div class="share-site-card">
    <span>Share Site With Your Team Members for Review or Performance Disclosure</span>

    <button
      class="share-invite"
    >
      <div style='color: #fff; margin-right: 1em;'>
        <i class="fas fa-share-alt"></i> 
      </div>
      Invite
    </button>

    <button
      class="copy-url"
    >
      <div style="margin-right: 10px; font-size:28px">
        <i class="far fa-circle"></i>
      </div>
      <span class="copy-link-text">Copy link to site url.</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'share-site-card'
}
</script>

<style lang="css" scoped>
  .share-site-card {
    background: var(--dark-blue);
    height: 5em;
    display: grid;
    grid-template-columns: auto 100px 200px;
    grid-gap: 20px;
    color: #fff;
    align-items: center;
    font-weight: bold;
    font-size: 16px;
    padding: 0 3em;
  }

  .share-invite {
    background: none;
    border: 2px solid #fff;
    display: inline-flex;
    color:#fff;
    font-size: 16px;
    font-weight: bold;
  }

  .copy-url {
    display: inline-flex;
    background: none;
    border: none;
    color: #9FA9BA;
    justify-self: end;
  }

  button:hover {
    cursor: pointer;
  }

  .copy-link-text {
    align-self: center;
  }


</style>
