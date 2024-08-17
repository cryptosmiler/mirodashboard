<template >
  <b-modal
    ref="uploadLogsModal"
    hide-header
    hide-footer
    class="upload-logs-modal"
    id="upload-logs-modal"
    body-class="body"
    no-close-on-backdrop
    no-close-on-esc
  >

    <b-container>
      <b-row class="text-center">
        <b-col class="ml-auto px-1 col-auto">
          <b-button class="px-0 py-0 close" block @click="copyAndClose" aria-label="Close"><span aria-hidden="true">&times;</span></b-button>
        </b-col>
        <b-col sm="12" class="px-0">
          <p class="header my-1">{{ title }} - {{ succeeded }} / {{ total }} images was uploaded</p>
        </b-col>
        <b-col sm="12" class="px-0 my-3">
          <span>Below are images were not uploaded</span>
          <b-button variant="outline-secondary" id="btn-copy-log" @click="copyFileName">Copy File List
            <i class="material-icons content-copy">
              content_copy
            </i>
          </b-button>
        </b-col>
      </b-row>
      <b-row v-show="duplicated.length > 0">
        <p><span class="text-break">Duplicated: </span>
        <span class="text-break">{{ duplicated.length }}</span>
        </p>
      </b-row>
      <b-row v-show="overSize.length > 0">
        <p><span class="text-break">Over Size: </span>
        <span class="text-break">{{ overSize.length }}</span>
        </p>
      </b-row>
      <b-row v-show="connection.length > 0">
        <p><span class="text-break">Connection Error: </span>
        <span class="text-break">{{ connection.length }}</span>
        </p>
      </b-row>
      <!-- <b-row v-for="(log, index) in logs" :key="index">
        <b-col sm="12" md="6" class="px-0">
          <span class="text-break">{{ log.fileName }}</span>
        </b-col>
        <b-col sm="12" md="6" class="px-0 text-right">
          <span class="text-break">{{ log.msg }}</span>
        </b-col>
      </b-row> -->
    </b-container>
    <b-button class="mt-3" block @click="retryModal" v-show="connection.length > 0">Retry</b-button>
    <b-button class="mt-3" block @click="closeModal">Close and clear queue</b-button>
  </b-modal>
</template>

<script>
import EventBus from "@/event-bus"
import * as clipboard from "clipboard-polyfill"
import is from "is_js"
import _ from "lodash"

export default {
  name: "upload-logs-modal",
  data() {
    return {
      title: "Process Logs",
      logs: [],
      total: 0,
      failed: 0,
      succeeded: 0,
      duplicated: [],
      connection: [],
      overSize: []
    }
  },
  watch: {
    logs(newVal, oldVal) {
      if (newVal.length > 0) {
        console.log(`logs - ${newVal}`)
        this.duplicated = _.filter(newVal, function(o) { return o.msg.includes('duplicated'); });
        this.overSize = _.filter(newVal, function(o) { return o.msg.includes('file size'); });
        this.connection = _.filter(newVal, function(o) { return o.msg.includes('connection error') || o.msg.includes('Server responded with') });
      }
    }
  },
  mounted() {
    EventBus.$on("open-upload-error-logs-modal", payload => {
      console.log(`open-upload-error-logs-modal - ${JSON.stringify(payload)}`)
      this.logs = payload.logs
      this.total = payload.total
      this.failed = payload.failed
      this.succeeded = payload.succeeded
      if (this.logs.length > 0) {
        this.$refs.uploadLogsModal.show()
      }
    })
    EventBus.$on("close-upload-error-logs-modal", payload => {
      this.reset()
      EventBus.$emit("dropzone-clear-queue")
      if (this.$refs.uploadLogsModal) {
        this.$refs.uploadLogsModal.hide()
      }
    })
    EventBus.$on("retry-upload-error-modal", () => {
      EventBus.$emit("retry-failed-uploads", this.connection)
      this.reset()
      if (this.$refs.uploadLogsModal) {
        this.$refs.uploadLogsModal.hide()
      }
    })
  },
  destroyed() {
    this.reset()
    EventBus.$emit("dropzone-clear-queue")
    EventBus.$off("open-upload-error-logs-modal")
  },
  methods: {
    reset() {
      this.logs = []
      this.duplicated = []
      this.connection = []
      this.overSize = []
      this.total = 0
      this.failed = 0
      this.succeeded = 0
    },
    closeModal() {
      EventBus.$emit("close-upload-error-logs-modal")
    },
    retryModal() {
      EventBus.$emit("retry-upload-error-modal")
    },
    copyFileName() {
      console.log(this.logs)
      const list = this.logs.map(x => `${x.fileName}`).reduce((a,e) => `${a}\n${e}`)
      clipboard.writeText(list)
      this.$toasted.global.logs_copied()
    },
    copyAndClose() {
      this.copyFileName()
      this.closeModal()
    }
  }
}
</script>


<style lang="css" scoped>
  .close span {
    font-size: 24px;
  }

  .modal-body {
    color: #000;
    padding: 20px 24px 24px !important;
  }

  .modal-content {
    font-size: 12px;
    line-height: 13px;
    font-weight: 400;
    color: #2c3e50;
  }

  .header {
    font-size: 14px;
    color: #000;
  }

  span {
    color: #000;
  }

  #btn-copy-log {
    font-size: 12px !important;
    line-height: 13px;
    font-weight: 400;
    position: relative;
    bottom: 2px;
    .material-icons.content-copy {
      font-size: 12px !important;
      line-height: 13px;
      font-weight: 400;
      position: relative;
      top: 2px;
    }
  }
  </style>
