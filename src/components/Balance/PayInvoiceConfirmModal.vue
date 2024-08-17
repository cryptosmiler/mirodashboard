<template >
  <b-modal
    ref="payInvoiceConfirmModal"
    class="pay-invoice-confirm-modal"
    id="pay-invoice-confirm-modal"
    body-class="body px-0 py-0"
    no-close-on-backdrop
    no-close-on-esc
    hide-header
    hide-footer
    centered
  >
    <template #modal-header>
      <b-col cols="12" class="modal-header">
        <p>{{ title }}</p>
      </b-col>
    </template>
    <b-container>
      <b-row>
        <b-col cols="12" class="modal-body">
          <p>Purchasing {{ value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }} credits for ${{ price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}?</p>
        </b-col>
      </b-row>
      <b-row class="buttons-grid">
        <button type="button" class="global-button" @click="closeModal">
          No
        </button>
        <button
          type="button"
          class="global-button global-submit-button"
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
import formatter from "@/utils/formatter";
// import { payInvoice } from "../../api";
// import { payInvoicePaymentMethod } from "../../api";

export default {
  name: "pay-invoice-confirm-modal",
  data() {
    return {
      title: "Confirm Credits Purchase",
      price: 0,
      value: 0,
      planId: -1,
      formatter
      // body: `Purchasing ${this.plan.value} for $${this.plan.price}?`
    };
  },
  watch: {},
  computed: {

  }, 
  mounted() {
    let self = this;
    EventBus.$on("show-pay-invoice-confirm-modal", data => {
      // self.card = [card];
      self.invoice_no = data.invoice.id
      console.log(data.invoice)
      self.price = data.invoice.metadata.price / 100 
      self.value = data.invoice.metadata.credit_purchased
      self.planId = data.invoice.metadata.plan_purchased
      // if (self.$bvModal()) {
      console.log(self.$refs)
      if (self.$refs.payInvoiceConfirmModal) {
        self.$refs.payInvoiceConfirmModal.show();
      }
        // self.$bvModal.show('pay-invoice-confirm-modal')
      // }
    });
  },
  destroyed() {},
  methods: {
    closeModal() {
      if (this.$refs.payInvoiceConfirmModal) {
        this.$refs.payInvoiceConfirmModal.hide();
      }
    },
    confirmPurchase() {
      let self = this;
      EventBus.$emit("change-loader-state", true);
      this.$store.dispatch("Billing/toPayInvoice", { invoice_no: this.invoice_no });
      if (this.$refs.payInvoiceConfirmModal) {
          this.$refs.payInvoiceConfirmModal.hide();
        }
      //  payInvoice({
      //   invoice_no: self.invoice_no
      // }).then(
        
      // )
      // console.log(`${self.planId}`);
      //  this.$store.dispatch("Billing/payInvoice", { plan_id: self.planId });
      //  if (this.$refs.payInvoiceConfirmModal) {
      //     this.$refs.payInvoiceConfirmModal.hide();
      //   }
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
