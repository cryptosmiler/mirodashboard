<template >
  <b-modal
    ref="purchaseConfirmModal"
    class="purchase-confirm-modal"
    id="purchase-confirm-modal"
    body-class="body px-0 py-0"
    no-close-on-backdrop
    no-close-on-esc
    hide-footer
    centered
    style="border:0"
  >
    <template #modal-header>
      {{ title }}
    </template>
    <b-container fluid>
      <b-row>
        <b-col cols="12" class="modal-body">
          <p>Purchasing {{ value | formatNumber }} credits for {{ price | usdFormat }}?</p>
        </b-col>
      </b-row>
      <b-row class="buttons-grid">
        <button type="button" class="global-button" @click="closeModal">
          No
        </button>
        <button
          type="button"
          class="btn-primary global-button global-submit-button"
          @click="confirmPurchase"
        >
          Yes
        </button>
      </b-row>
    </b-container>
  </b-modal>
</template>

<script>
import EventBus from "../../event-bus";
import * as clipboard from "clipboard-polyfill";
import is from "is_js";
// import { purchasePaymentMethod } from "../../api";

export default {
  name: "purchase-confirm-modal",
  data() {
    return {
      title: "Confirm Credit Purchase",
      price: 0,
      value: 0,
      planId: -1,
      // body: `Purchasing ${this.plan.value} for $${this.plan.price}?`
    };
  },
  watch: {},
  computed: {

  }, 
  mounted() {
    let self = this;
    EventBus.$on("show-purchase-confirm-modal", data => {
      // self.card = [card];
      console.log(data.plan.price)
      self.price = data.plan.price
      self.value = data.plan.value
      self.planId = data.plan.planId
       console.log(self.$refs)
      if (self.$refs.purchaseConfirmModal) {
        self.$refs.purchaseConfirmModal.show();
      }
    });
  },
  destroyed() {},
  methods: {
    closeModal() {
      if (this.$refs.purchaseConfirmModal) {
        this.$refs.purchaseConfirmModal.hide();
      }
    },
    confirmPurchase() {
      let self = this;
      EventBus.$emit("change-loader-state", true);
      console.log(`${self.planId}`);
       this.$store.dispatch("Billing/purchase", { plan_id: self.planId });
       if (this.$refs.purchaseConfirmModal) {
          this.$refs.purchaseConfirmModal.hide();
        }
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
  margin: 2em 2em 0 2em;
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
