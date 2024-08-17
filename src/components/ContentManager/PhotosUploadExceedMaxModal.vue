<template>
    <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="delete-modal-header">
        <p>Too Many Files! </p>
      </div>
      <div>
        <p class="delete-description">
          Exceeded Max Number of Photos Allowed. Limit: {{max}}
        </p>
      </div>
      <div class="buttons-grid">
        <button type="button" class="global-button" @click="closeModal">OK</button>
      </div>
    </div>
    </div>
</template>

<script>
import EventBus from '../../event-bus'
export default {
  methods: {
    closeModal () {
      EventBus.$emit('image-uploads-max-exceeded', {
        status: 'hide'
      })
    }
  },
  props: {
    max: {
      type: Number,
      required: true
    }
  }
}
</script>

<style scoped lang="css">
  .delete-modal-header {
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
    grid-template-columns: 1fr;
    grid-gap: 10px;
  }

  .modal.show .modal-dialog {
    top: 15%;
  }

  .delete-description {
    text-align: center;
    margin-top: 2em;
    color: var(--grey-text);
  }
</style>
