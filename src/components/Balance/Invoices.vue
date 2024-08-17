<template lang="html">
  <b-container class="" >
    <p class="profile-settings">{{ $t('balance.billing-history-title') }}</p>
    <b-pagination
          v-show="perPage < getTenantInvoices.length"
          v-model="currentPage"
          :total-rows="getTenantInvoices.length"
          :per-page="perPage"
          align="fill"
          size="sm"
          class="my-1"
        ></b-pagination>
    <b-table 
      :busy="!getTenantInvoices" 
      :current-page="currentPage"
      :per-page="perPage"
      stacked="md"
      responsive 
      small 
      class="table-borderless billing-invoices-container px-3 py-3" 
      :fields="fields" 
      :items="getTenantInvoices" 
      theadClass="row-titles text-left" 
      tbodyClass="form-group text-left"
    >
      <template #cell(status)="data">
        <span class="blue-text" v-if="data.item.status === 'paid'">
          <a :href="data.item.invoice_pdf" download class="download-text mr-2">
            <b-button
              class="rounded py-0 my-0"
              variant="outline-secondary"
            >
              PDF
              <font-awesome-icon :icon="['fad', 'download']" />
            </b-button>
          </a>
          <!-- <i class="material-icons orange-icon">picture_as_pdf</i> -->
        </span>
        <span class="blue-text" v-if="data.item.status === 'open'">
          <a :href="data.item.hosted_invoice_url" target="_blank" class="download-text mr-2">
            <b-button
              class="rounded py-0 my-0"
              variant="primary"
            >
              PAY
              <font-awesome-icon :icon="['fab', 'cc-stripe']" />
            </b-button>
          </a>
        </span>
        <font-awesome-icon v-if="data.value === 'paid'" :icon="['fad', 'check']" class="text-success"/>
        <font-awesome-icon v-else :icon="['fad', 'circle-exclamation']" class="text-danger"/>
      </template>
      <template #table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>
    </b-table>
    <div class="billing-invoices-container" v-if="getTenantInvoices.length == 0">
      <p class="row-titles my-3 px-3 py-3">{{ $t('balance.no-invoice')}}</p>
    </div>
    
  </b-container>
  
</template>

<script>
import EventBus from "../../event-bus";
import formatter from "@/utils/formatter";
import { mapGetters } from "vuex";
import PayInvoiceConfirmModal from "./PayInvoiceConfirmModal";

/* eslint-disable */
export default {
  name: "account-billing-invoices",
  data() {
    return {
      // items: [],
      formatter,
      currentPage: 1,
      perPage: 9,
      fields : [
        { label: "Date", key: "created", formatter: formatter.timestampAsDate },
        { label : "Invoice Number", key:"number" },
        { label : "Amount", key: "amount_due", formatter: formatter.usdFormat, tdClass: "text-left text-md-right", thClass: "text-right" },
        { label: "", key: "status", tdClass: "text-right" },
      ]
    };
  },
  
  methods: {
    payInvoice(item) {
      console.log(item)
      EventBus.$emit("show-pay-invoice-confirm-modal", { invoice: item });
    },
  },
  components: {
    PayInvoiceConfirmModal
  },
  created() {
    this.$store.dispatch("Billing/fetchTenantInvoices", {});
  },
  mounted() {},
  computed: {
    ...mapGetters("Billing", ["getTenantInvoices"])
  }
};
</script>

<style lang="css" scoped>
.profile-settings {
  color: #aeb4c3;
  font-size: 24px;
}

.billing-invoices-container {
  background: #fff;
  box-shadow: 0px 4px 10px 1px rgba(204, 204, 204, 1);
}

.billing-invoices-title {
  font-size: 20px;
  padding: 1.5em 2em;
  color: #a0a9b8;
  margin: 0;
  font-weight: 500;
  border-bottom: 1px solid #ccd0d8;
}

.billing-invoices {
  color: #a0a9b8 !important;
}
.material-icons {
  font-size: 12px;
}
.see-more {
  border: none;
  background: #afb7c3;
  color: #fff;
  padding: 1em 2em;
  float: right;
  border-radius: 5px;
  font-weight: 400;
  box-shadow: 0px 4px 10px 1px rgba(204, 204, 204, 1);
  position: relative;
  right: 1em;
}

.blue-text {
  color: #6ec2e3;
}

.orange-icon {
  color: #fa8a5c;
  position: relative;
}

.row-titles {
  font-size: 16px;
  color: #a0a9b8;
  margin: 0;
  font-weight: 500;
}
</style>
