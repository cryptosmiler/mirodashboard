<template>
  <div
    id="photoUploadCheckpointModal"
    class="modal photoUploadCheckpointModal"
    tabindex="-1"
    role="dialog"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <b-container fluid>
            <b-row class="modal-header">
              <b-col>Select a checkpoint to upload</b-col>
            </b-row>
            <b-row>
              <b-col cols="12">
                <div class="dropdown" v-if="toCheckpoint">
                  <button
                    class="dropdown-btn dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {{ toCheckpoint.checkpoint_label }}
                  </button>
                  <div
                    class="dropdown-menu"
                    aria-labelledby="dropdownMenuButton"
                  >
                    <a
                      v-for="(item, index) in getCheckpoints"
                      :key="index"
                      class="dropdown-item"
                      @click="select(item)"
                      >{{ item.checkpoint_label }}</a
                    >
                  </div>
                </div>
              </b-col>
              <b-col cols="12">
                <button class="discard-btn" @click="discard()">DISCARD</button>
                <button
                  class="confirm-btn"
                  :disabled="checkSameCheckpoint"
                  @click="confirm()"
                >
                  CONFIRM UPLOAD TO THIS CHECKPOINT
                </button>
              </b-col>
            </b-row>
          </b-container>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import EventBus from "../../event-bus"
import $ from "jquery"

export default {
  name: "photos-upload-checkpoint-modal",
  data() {
    return {
      toCheckpoint: null,
      originalCheckpoint: null,
    }
  },
  computed: {
    ...mapGetters(["getSelectedImagesObjects"]),
    ...mapGetters("EventCheckpoint", [
      "getCheckpoints",
      "getCurrentCheckpoint",
    ]),
    checkSameCheckpoint() {
      return (
        this.getSelectedImagesObjects.length > 0 &&
        this.getCheckpoints &&
        this.originalCheckpoint &&
        this.toCheckpoint &&
        this.originalCheckpoint.checkpoint_id ===
          this.toCheckpoint.checkpoint_id
      )
    },
  },
  methods: {
    setUp() {
      this.toCheckpoint = this.searchCheckpoint(this.getCurrentCheckpoint)

      console.log(this.toCheckpoint)
      this.originalCheckpoint = JSON.parse(JSON.stringify(this.toCheckpoint))
      if (this.toCheckpoint) {
        $("#photoUploadCheckpointModal").modal("show")
      }
    },
    confirm() {
      if (!this.checkSameCheckpoint) {
        this.$store.dispatch(
          "EventCheckpoint/selectCheckpoint",
          this.toCheckpoint.checkpoint_id
        )
        EventBus.$emit("upload-selected-checkpoint", {
          id: this.toCheckpoint.checkpoint_id,
          confirmToProcess: true,
        })
        $("#photoUploadCheckpointModal").modal("hide")
      }
    },
    discard() {
      EventBus.$emit("upload-selected-checkpoint", {
        confirmToProcess: false,
      })
      $("#photoUploadCheckpointModal").modal("hide")
    },
    select(item) {
      this.toCheckpoint = item
    },
    searchCheckpoint(id) {
      if (id === 0) {
        return this.getCheckpoints.length > 0 ? this.getCheckpoints[0] : null
      } else {
        let cp = null
        this.getCheckpoints.forEach((element) => {
          if (element.checkpoint_id === this.getCurrentCheckpoint) {
            cp = element
          }
        })
        return cp
      }
    },
  },
  mounted() {
    EventBus.$on("open-photos-upload-checkpoint-modal", () => {
      this.setUp()
    })
  },
}
</script>

<style lang="scss" scoped>
.photoUploadCheckpointModal {
  .modal-body {
    padding: 0;
  }

  .modal-header {
    background: var(--main-theme);
    color: #d6eef8;
    font-size: 2em;
    padding: 1em 1.2em 0.5em;
    margin-bottom: 0;
    font-weight: 300;
  }
  .dropdown {
    width: 100%;
  }
  .dropdown-btn {
    text-align: left;
    -webkit-appearance: none;
    width: 100%;
    border: none;
    border-bottom: 2px solid var(--main-theme);
    padding: 0.5em;
    margin: 1em 0;
    background-color: transparent;
  }
  .dropdown-menu {
    width: 100%;
    .dropdown-item {
      cursor: pointer;
      width: 100%;
      max-width: none;
    }
  }
  .discard-btn {
    background: var(--miro-grey);
    width: 100%;
    border-radius: 0;
    font-weight: bold;
    // margin: 1em 0;
    color: #fff;
    padding: 0.5em;
    border: none;
    text-transform: uppercase;
  }
  .confirm-btn {
    background: var(--main-theme);
    width: 100%;
    border-radius: 0;
    font-weight: bold;
    margin: 1.5em 0;
    color: #fff;
    padding: 0.5em;
    border: none;
    text-transform: uppercase;

    &:disabled {
      background: var(--miro-grey);
    }
  }
}
</style>
