<template>
  <b-modal
    ref="PhotosUploadClearQueueModal"
    id="clear-queue-modal"
    hide-header
    hide-footer
    body-class="px-0 py-0"
  >
    <div class="modal-content">
      <div class="modal-header">
        <p>Uploading Images</p>
      </div>

      <div>
        <p class="description">
          Clear queue will stop upload and the remaining images will not be
          uploaded, confirm to proceed?
        </p>
      </div>

      <div class="buttons-grid">
        <button type="button" class="global-button" @click="closeModal">
          Cancel
        </button>
        <button
          type="button"
          class="global-button global-submit-button"
          @click="navigateAway"
        >
          Yes
        </button>
      </div>
    </div>
  </b-modal>
</template>

<script>
import EventBus from "../../event-bus";
export default {
  name: "photos-upload-clear-queue-modal",
  methods: {
    navigateAway() {
      EventBus.$emit("clear-queue-warning-reply");
      this.closeModal();
    },
    closeModal() {
      if (this.$refs.PhotosUploadClearQueueModal) {
        this.$refs.PhotosUploadClearQueueModal.hide();
      }
    }
  },
  mounted() {
    EventBus.$on("show-clear-queue-modal", () => {
      if (this.$refs.PhotosUploadClearQueueModal) {
      this.$refs.PhotosUploadClearQueueModal.show();
      }
    });
  }
};
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

.modal-content .modal-body {
  padding: 0px !important;
}

.description {
  text-align: center;
  margin-top: 2em;
  color: var(--grey-text);
}
</style>
