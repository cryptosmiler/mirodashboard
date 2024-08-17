<template>
    <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <p>Uploading Images</p>
      </div>

      <div>
        <p class="description">
          Navigating away will cancel photo uploads. Continue?
        </p>
      </div>
      
      <div class="buttons-grid">
        <button type="button" class="global-button" @click="closeModal">No</button>
        <button type="button" class="global-button global-submit-button" @click="navigateAway">Yes</button>
      </div>
    </div>
    </div>
</template>

<script>
import EventBus from '../../event-bus'
export default {
  methods: {
    navigateAway () {
      EventBus.$emit('navigate-warning-reply', {
        status: 'hide',
        navigateAway: true
      })
    },
    closeModal () {
      EventBus.$emit('navigate-warning-reply', {
        status: 'hide',
        navigateAway: false
      })
    }
  }
}
</script>

<style scoped lang="css">
  .modal-header {
    background: var(--main-theme);
    color: #d6eef8;
    font-size: 30px;
    padding: 1em 1.2em 0.5em;
    margin-bottom: 0;
    font-weight: 300;
  }

  .buttons-grid {
    display: grid;
    padding: 2em;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10px;
  }

  .modal.show .modal-dialog {
    top: 15%;
  }

  .description {
    text-align: center;
    margin-top: 2em;
    color: var(--grey-text);
  }
</style>
