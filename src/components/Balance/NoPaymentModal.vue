<template >
  <b-modal
    ref="noPaymentModal"
    class="no-payment-modal"
    id="no-payment-modal"
    body-class="body px-0 py-0"
    no-close-on-backdrop
    no-close-on-esc
    hide-header
    hide-footer
    centered
  >
    <b-container>
      <b-row>
        <b-col cols="12" class="modal-header">
          <p>{{ title }}</p>
        </b-col>
        <!-- <b-col cols="12" class="modal-body">
          <p>Purchasing {{ value }} credits for ${{ price }}?</p>
        </b-col> -->
      </b-row>
      <b-row class="buttons-grid">
        <button type="button" class="global-button" @click="closeModal">
          Cancel
        </button>
        <button
          type="button"
          class="global-button global-submit-button"
          @click="goBilling"
        >
          Ok
        </button>
      </b-row>
    </b-container>
  </b-modal>
</template>

<script>
import EventBus from "../../event-bus";
import * as clipboard from "clipboard-polyfill";
import is from "is_js";
import formatter from "@/utils/formatter";
import router from '../../router'
// import { purchasePaymentMethod } from "../../api";

export default {
  name: "no-payment-modal",
  data() {
    return {
      title: "Setup Your payment",
      formatter
      // body: `Purchasing ${this.plan.value} for $${this.plan.price}?`
    };
  },
  watch: {},
  computed: {

  }, 
  mounted() {
    let self = this;
    EventBus.$on("show-no-payment-modal", () => {
      // self.card = [card];
      console.log('init')
      if (self.$refs.noPaymentModal) {
        self.$refs.noPaymentModal.show();
      }
    });
  },
  destroyed() {},
  methods: {
    closeModal() {
      if (this.$refs.noPaymentModal) {
        this.$refs.noPaymentModal.hide();
      }
     
    },
    goBilling() {
      if (this.$refs.noPaymentModal) {
        this.$refs.noPaymentModal.hide();
      }
      //  self.$router.replace('billing')
      router.push('/billing')
    }
  }
};
</script>

<style lang="css" scoped>
.close span {
  font-size: 24px;
}

.modal.show .modal-dialog {
  top: 15%;
}

.modal-header {
  background: var(--main-theme);
  color: #d6eef8;
  font-size: 30px;
  padding: 1em 1.2em 0.5em;
  margin-bottom: 0;
  font-weight: 300;
}
.modal-body {
  margin-top: 2em;
}
.buttons-grid {
  display: grid;
  padding: 2em;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
}

.description {
  text-align: center;
  margin-top: 2em;
  color: var(--grey-text);
}
</style>
