<template>
    <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="delete-modal-header">
        <p>Delete Images</p>
      </div>

      <div>
        <p class="delete-description">{{description}}</p>
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
    contentCount: {
      type: Number,
      required: true
    },
    isSingleImage: {
      type: Boolean,
      required: false,
      default: false
    },
    objectId: {
      type: Array,
      required: false
    }
  },
  methods: {
    deleteEvent () {
      this.$store.dispatch('Events/deleteEventContent', {
        eventId: this.$route.params.id,
        singleImage: this.isSingleImage,
        objectId: this.objectId
      })

      EventBus.$emit('delete-event-content-modal-display', {status: 'hide'})
      if(this.objectId) EventBus.$emit('update-bib-search-array', this.objectId[0].index)
    },
    closeModal () {
      EventBus.$emit('delete-event-content-modal-display', {status: 'hide'})
    }
  },
  computed: {
    description () {
      return this.contentCount > 1 ? `Are you sure you want to delete these ${this.contentCount} images?` : `Are you sure you want to delete this 1 image?`
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
