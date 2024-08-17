<template>
    <div>
      <b-button @click="showModal">Open Modal</b-button>
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
              <p>Purchasing {{ formatter.formatNumber(value)}} credits for ${{ price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}?</p>
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
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        title: 'Purchase Confirmation',
        value: 10,
        price: 9.99,
        formatter: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }),
      }
    },
    methods: {
      showModal() {
        this.$refs.purchaseConfirmModal.show()
      },
      closeModal() {
        this.$refs.purchaseConfirmModal.hide()
      },
      confirmPurchase() {
        // Add your logic for confirming the purchase here
        this.$refs.purchaseConfirmModal.hide()
      },
    },
  }
  </script>
  