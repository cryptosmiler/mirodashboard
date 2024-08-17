<template lang="html">
  <b-modal v-model="modalShow" centered hide-header hide-footer no-close-on-backdrop no-close-on-esc>
    <div class="modal-header2">
      Please Select The Checkpoint
    </div>
    <div class="modal-body2">
      <div v-for="(item, index) in _checkpoint_array" :key="item.checkpoint_id" class="form-check">
        <input type="radio" :id="item.checkpoint_id" v-model="selectedItem" :value="index" class="custom-radio" />
        <label :for="item.checkpoint_id" class="form-check-label">{{ item.checkpoint_label }}</label>
      </div>
    </div>
    <div class="modal-footer2">
      <button v-if="selectedItem !== -2" @click="moveNextStep" class="btn btn-danger">Next</button>
      <button v-else disabled class="btn btn-danger">Next</button>
    </div>
  </b-modal>
</template>

<script>
import platformHelper from "@/utils/platformHelper"
import EventBus from '../../event-bus'

export default {
  name: 'stressCheckpointPage',
  props: ['_checkpoint_array'],
  data(){
    return {
      selectedItem: -2,
      modalShow: true
    }
  },
  methods: {
    moveNextStep(){
      const payload = {
        checkpoint_id: this._checkpoint_array[this.selectedItem].checkpoint_id,
        checkpoint_label: this._checkpoint_array[this.selectedItem].checkpoint_label,
      };
      console.log('payload->', payload)
      EventBus.$emit('checkpoint-selected', payload);
    }
  }
}
</script>

<style lang="css" scoped>
  .modal-header2{
    font-size: 25px;
    font-weight: bold;
    text-align: center !important;
    /* margin: 10px 15px 30px 15px; */
    margin: 3px 5px 10px 5px;
    padding: 10px;
    color: rgb(238, 238, 238);
    background-color: var(--main-theme);
    border-radius: 5px;
  }
  .modal-body2 {
    padding: 20px;
  }
  .form-check {
    margin-bottom: 10px;
  }
  .form-check-label {
    font-size: 16px;
    transform: translate(10px, -5px);
  }
  .modal-footer2 {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 20px;
    background-color: #f8f9fa;
  }
  .btn {
    font-size: 16px;
    font-weight: bold;
    padding: 10px 20px;
    border-radius: 5px;
    transition: all 0.3s ease;
  }
  .btn:hover {
    transform: translateY(-2px);
  }
  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .btn-danger {
    color: #fff;
    background-color: #dc3545;
    border-color: #dc3545;
  }

  .custom-radio {
    /* Hide the default radio button */
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    /* Create a custom radio button */
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 3px solid #ccc;
    outline: none;
    /* Customize the checked state */
    background-color: #fff;
    transition: 0.3s;
  }

  .custom-radio:checked {
    background-color: #ffffff;
    border-color: #dc3545;
  }
</style>
