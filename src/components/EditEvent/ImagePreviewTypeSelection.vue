<template lang="html">
  <b-container fluid>
    <div class="row header-band d-flex justify-content-around align-items-center">
      <b-link class="preview-btn" @click="getEventUrl()" target="_blank">
        <i class="fa fa-eye red-theme"></i>
        VIEW SITE  
      </b-link>
      <b-form-checkbox v-model="checked" name="check-button" switch class="lowercase-text d-flex">
        Mobile Preview
      </b-form-checkbox>
    </div>
  </b-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import EventBus from '../../event-bus'

export default {
  name: 'edit-event-preview-type-selection',
  data(){
    return{
      checked: false,
    }
  },
  methods: {
    ...mapActions([
      'changeSelectedType'
    ]),
    changePreviewType (type) {
      this.$store.dispatch('changeSelectedType', type)
    },
    async getEventUrl(){
      EventBus.$emit('EventUrlRequest');
      EventBus.$on('EventUrlResponse', (payload)=>{
        //return payload
        //this.$router.push(payload)
        console.log("payload ===> ", payload)
        window.location.href = payload
      })
    }
  },
  watch:{
    checked(newVal){
      if(newVal == true){
        this.changePreviewType('mobile')
      }
      else if(newVal == false){
        this.changePreviewType('desktop')
      }
    },
  },
  computed: {
    ...mapGetters([
      'getSelectedType'
    ])
  }
}
</script>

<style lang="css" scoped>
  .edit-event-preview-type-selection {
    max-width: 190px;
    min-width: 190px;
    float: right;
    margin: 0;
  }

  .desktop-type {
    opacity: 0.55;
    border: 3px solid #FFFFFF;
    height: 35px;
    width: 100%;
    margin-bottom: 1em;
  }

  .mobile-type {
    opacity: 0.55;
    border: 3px solid #FFFFFF;
    height: 23px;
    width: 16px;
    margin-bottom: 1em;
  }

  .selected-type {
    opacity: 1;
    background: #5A3296;
  }

  .selector-bottom {
    border-bottom: 5px solid rgba(0,0,0,0.10);
    padding-left: 0;
    padding-right: 0;
  }

  .selector-bottom:hover {
    cursor: pointer;
  }

  .selected-bar {
    border-bottom: 5px solid #fff;
  }

  .header-band{
    background-color: #fff;
    padding: 7px;
    margin: 15px 0px 3px 0px;
  }

  .red-theme{
    color: var(--main-theme);
  }

  .lowercase-text{
    font-size: 20px;
  }

</style>
