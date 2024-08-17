<template>
    <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="delete-modal-header">
        <p>Delete Event</p>
      </div>

      <div>
        <p v-if="event.setting" class="delete-description">Are you sure you want to delete event {{event.setting.title}}?</p>
      </div>
      
      <div class="buttons-grid">
        <button type="button" class="global-button" @click="closeModal">Cancel</button>
        <button type="button" class="global-button global-submit-button" @click="deleteEvent">Delete</button>
      </div>
    </div>
    </div>
</template>

<script>
import EventBus from '../event-bus'
export default {
  props: {
    event: {
      type: Object,
      required: true,
       default: function () {
        return {setting: {title: ''}}
      }
    }  
  },
  methods: {
    deleteEvent () {
      this.$store.dispatch('Events/deleteEvent', this.event.event_id)

      EventBus.$emit('delete-event-modal-state', {
        status: 'hide'
      })
    },
    closeModal () {
      EventBus.$emit('delete-event-modal-state', {
        status: 'hide'
      })
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
    grid-template-columns: repeat(2, 1fr);
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
