<template >
  <b-modal
    ref="detachConfirmModal"
    class="detach-confirm-modal"
    id="detach-confirm-modal"
    body-class="body px-0 py-0"
    no-close-on-backdrop
    no-close-on-esc
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
        <b-col cols="12">
          <b-table
            responsive
            borderless
            small
            :fields="fields"
            :items="card"
            class="table-borderless mt-3"
            theadClass="text-center"
            tbodyClass="form-group text-center"
          >
            <template #cell(card.brand)="data" class="text-right">
                <font-awesome-icon :icon='brands[data.item.card.brand]' size="lg"  v-if="`${data.item.card.brand}` in brands"/>
                <b-badge v-else >{{ formatter.formatBrand(data.item.card.brand) }}</b-badge>
            </template>
            <template #cell(cardExpiry)="data">
                {{ data.item.card.exp_month }}/{{  data.item.card.exp_year }}
              </template>
            <template slot="created" slot-scope="data">
              <p>{{ data.item.created | formatTime }}</p>
            </template>
          </b-table>
        </b-col>
      </b-row>
      <b-row class="buttons-grid">
        <button type="button" class="global-button" @click="closeModal">
          No
        </button>
        <button
          type="button"
          class="global-button global-submit-button"
          @click="confirmDetach"
        >
          Yes
        </button>
      </b-row>
    </b-container>
  </b-modal>
</template>

<script>
import EventBus from "../../event-bus";
import { detachPaymentMethod } from "../../api";
import formatter from "@/utils/formatter";

export default {
  name: "detach-confirm-modal",
  data() {
    return {
      formatter,
      title: "Confrim Card Removal",
      brands: [],
      card: [],
      fields: [
        { 
          key: "card.brand",
          label: "Card Type"
        },
        { 
          key: "card.last4",
          label: "Last 4 Digits"
        },
        { 
          key: "cardExpiry",
          label: "Expiry Date"
        }
      ],
    };
  },
  watch: {},
  mounted() {
    let self = this;
    EventBus.$on("show-detach-confirm-modal", ({card, brands})  => {
      self.card = [card]
      self.brands = brands
      if (self.$refs.detachConfirmModal) {
        self.$refs.detachConfirmModal.show();
      }
    });
  },
  destroyed() {},
  methods: {
    closeModal() {
      if (this.$refs.detachConfirmModal) {
        this.$refs.detachConfirmModal.hide();
      }
    },
    confirmDetach() {
      let self = this;
      EventBus.$emit("change-loader-state", true);
      console.log(`${self.card[0].id}`);
      detachPaymentMethod({
        payment_method_id: self.card[0].id
      })
        .then(response => {
          console.log(`${response}`);
          self.closeModal();
          self.$toasted.global.payment_method_success();
          EventBus.$emit("update-payment-methods-list");
        })
        .catch(err => {
          console.error(`${err.message}`);
          self.closeModal();
          EventBus.$emit("change-loader-state", false);
          self.$toasted.global.payment_method_error();
        });
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
