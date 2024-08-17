<template lang="html">
  
  <div class="active-switch">
    <div class="share-site-card-new">
      <span class="span_2">Gallery Availability :</span>
      <button class="copy-url" @click="togglePublic">
          <div style="margin-right: 10px; font-size:28px">
            <i class="far fa-circle" v-if="!public"></i>
            <i class="far fa-circle bold-style" v-if="public"></i>
          </div>
          <span class="copy-link-text">Public</span>
      </button>

      <button class="copy-url" @click="togglePublic">
          <div style="margin-right: 10px; font-size:28px">
            <i class="far fa-circle" v-if="public"></i>
            <i class="far fa-circle bold-style" v-if="!public"></i>
          </div>
          <span class="copy-link-text">Private</span>
      </button>
    </div>
    <br />
    <div class="pin" v-show="!public">
      <p>
        <span>PIN:</span> 
        <strong v-show="!editPin" >{{pin}}</strong>
        <input v-show="editPin" type="text" pattern="\d*" maxlength="4" v-model="pin">
        <a @click="toggleEditPin" class="edit-pin-btn">{{getPinBtnText}}</a>
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'dashboard-manage-event-main-card-active-switch',
  data () {
    return {
      public: 0,
      editPin: false,
      pin: ''
    }
  },
  methods: {
    togglePublic() {
      this.public=!this.public
      let eventState = this.public === true ? 'public' : 'private'
      this.$store.dispatch('Events/setEventState', {eventState})
    },
    toggleEditPin() {
      if(this.editPin) {
        var check = true
        if(this.pin == '' || isNaN(this.pin) || this.pin.length != 4) {
          check = false
          this.$toasted.show(`Please enter a 4 digit number pin`, {
            duration: 5000,
            fullWidth: true,
            theme: 'bubble',
            className: 'verify-email',
            position: 'bottom-center'
          })
        }
        if(check) {
          this.$store.dispatch('EditEvent/changeEventValues', {fieldName: 'pin', fieldValue: this.pin})
          this.$store.dispatch('Events/setEventSetting')
          this.editPin = !this.editPin
        }
      } else {
        this.editPin = !this.editPin
      }
    }
  },
  computed: {
    ...mapGetters('Events', ['getSelectedEvent']),
    hiddenOrPublic () {
      return this.public === true ? 'Public' : 'Private'
    },
    hiddenOrPublicHint () {
      return this.public === true ? 'Toggle to make your event from public to private so people cannot view your gallery.' : 'Toggle to make your event from private to public so people can view your gallery.'
    },
    getPinBtnText() {
      return this.editPin === true ? 'Save' : 'Update PIN'
    }
  },
  mounted () {
    this.public = this.getSelectedEvent.state === 1
    this.pin = this.getSelectedEvent.setting.pin
  }
}
</script>

<style lang="css" scoped>

.bold-style{
  font-weight: bold;
}

.share-site-card-new{
    background: var(--dark-blue);
    color: #fff;
    padding: 1em 1em 1em 2em;
    font-weight: bold;
    font-size: 16px;
    height: 5em;
    position: sticky;
  }

  .span_2{
    font-size: 20px;
    margin-right: 50px;
  }

  .copy-url {
    display: inline-flex;
    background: none;
    border: none;
    color: #9FA9BA;
    justify-self: end;
    margin-right: 5px;
    margin-top: 2px;
  }
  
  .copy-link-text {
    align-self: center;
  }

  .hidden-active-text {
    position: relative;
    left: 40px;
    top: 3px;
    color: #afb7c3;
  }

  .active-switch {
    height: 80px;
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 35px;
    height: 20px;
  }

  /* Hide default HTML checkbox */
  .switch input {display:none;}

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #a1a9bb;
    -webkit-transition: .4s;
    transition: .4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 14px;
    width: 14px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
  }

  input:checked + .slider {
    background-color: var(--main-theme);
  }

  input:focus + .slider {
    box-shadow: 0 0 1px var(--main-theme);
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(15px);
    -ms-transform: translateX(15px);
    transform: translateX(15px);
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }

  .pin {
    color: #afb7c3;
  }

  .hidden-active-text .tooltiptext {
    visibility: hidden;
    width: 320px;
    background-color: rgba(0, 0, 0, 0.7);
    color: #fff;
    text-align: center;
    border-radius: 10px;
    padding: 10px 15px;
    font-family: 'Roboto';
    font-size: 14px;

    /* Position the tooltip */
    position: absolute;
    z-index: 1;
    line-height: 18px;
  }

  .pin .edit-pin-btn {
    margin-left: 15px;
    background: #fff;
    color: #12a6de;
    cursor: pointer;
    border: none;
    -webkit-box-shadow: 0px 3px 20px #ccc;
    box-shadow: 0px 3px 20px #ccc;
    border-radius: 0;
    font-size: 12px;
    padding: 0.5em 1em;
  }

  .pin .edit-pin-btn:hover {
    color: #6c757d;
    background-color: rgba(153, 153, 153, 0.2);
    border-color: rgba(153, 153, 153, 0.2);
  }

  .pin p strong, .pin p a, .pin p input, .pin p span {
    vertical-align: middle;
  }

  .pin p strong {
    padding: 0px 5px;
  }

  .pin p input {
    max-width: 50px;
    background: transparent;
    border: none;
    border-bottom: 1px solid #afb7c3;
    color: #afb7c3;
    padding: 0px 5px;
    outline: none;
    font-weight: bolder;
  }

  .pin p  input[type=number]::-webkit-outer-spin-button,
  .pin p  input[type=number]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .pin p  input[type="number"] {
    -moz-appearance: textfield;
  }

  @media only screen and (min-width: 768px) {
    .hidden-active-text:hover .tooltiptext {
      visibility: visible;
    }
  }
</style>
