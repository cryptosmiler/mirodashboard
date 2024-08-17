<template lang="html">
  <div style="width:100%;">
    <b-container class="info-body" slot="body">
      <b-row>
        <b-col cols="12">
          <label class="checkpoint-header-label">Create different checkpoints to better organize your photos (Optional)</label>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="12">
          <table id="checkpointtable" class="table table-bordered">
            <tbody>
              <tr v-for="(checkpoint, index) in getCheckpointList" v-show="!checkpoint.delete">
                <td>
                  <i v-show="index != 0" @click="deleteCheckpointModal(checkpoint.checkpoint_id)" class="fas fa-minus-square red"></i>
                  <i v-show="index == 0" class="default-text">Default</i>
                </td>
                <td>
                  <input type="text" v-model="checkpoint.checkpoint_label" @keydown="changed"/>
                </td>
              </tr>
            </tbody>
          </table>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="12">
          <button class="btn checkpoint-btn" @click="addCheckpoint()"><i class="fas fa-plus"></i> <span>Add Checkpoint</span></button>
        </b-col>
      </b-row>
    </b-container>
    <div class="modal" tabindex="-1" role="dialog" id="delete-checkpoint-modal">
      <delete-checkpoint-modal></delete-checkpoint-modal>
    </div>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import EventBus from '../../event-bus.js'
import deleteCheckpointModal from './DeleteCheckpointModal.vue'
import JQuery from 'jquery'
const $ = JQuery

export default {
  name: 'edit-event-side-checkpoint',
  computed: {
    ...mapGetters('EventCheckpoint', ['getCheckpoints']),
    getCheckpointList() {
      return this.getCheckpoints ? this.getCheckpoints : []
    }
  },
  data () {
    return {
      selectedDeleteCheckpointId: 0,
    }
  },
  methods: {
    deleteCheckpointModal(checkpoint_id) {
      $('#delete-checkpoint-modal').modal('show')
        this.selectedDeleteCheckpointId = checkpoint_id
      },
    addCheckpoint() {
      this.$store.dispatch('EventCheckpoint/addCheckpoint')
    },
    changed (event) {
      setTimeout(()=> {
        this.$store.dispatch('EventCheckpoint/setIsDifferentValues', true)
      }, 100)
    },
  },
  mounted () {
    EventBus.$on('delete-checkpoint-modal', deleteCheckpoint => {
      if(deleteCheckpoint) {
        this.$store.dispatch('EventCheckpoint/deleteCheckpoint', this.selectedDeleteCheckpointId)
      }
      $('#delete-checkpoint-modal').modal('hide')
    })
  },
  components: {
    deleteCheckpointModal: deleteCheckpointModal,
  },
}
</script>

<style lang="css" scoped>

  .basic-info-body {
    background: #fff;
    padding-top: 1em;
    padding-bottom: 1em;
  }

  .basic-info-body div {
    margin-bottom: 1em;
  }

  .info-body {
    background: #fff;
    padding: 2em 2em 1em 2em;
  }

  .row-margin-bottom {
    margin-bottom: 1em;
  }

  .icons {
    font-size:1.5em;
    color: #9FA9BA;
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

  #checkpointtable {
    -webkit-box-shadow: 0 5px 5px 0 rgba(0,0,0,0.05);
    box-shadow: 0 5px 5px 0 rgba(0,0,0,0.15);
  }

  #checkpointtable input {
    width: 100%;
    border: none;
    border-bottom: 1px solid #cdd0d5;
    width: 100%;
    resize: none;
    color: var(--input-text-color);
    outline: none;
    background: transparent;
  }

  #checkpointtable .default-text {
    font-style: normal;
    margin-top: 5px;
    display: inline-block;
  }

  #checkpointtable .fas.fa-minus-square.red {
    margin-top: 8px;
    color: red;
  }

  .checkpoint-header-label {
    font-style: italic;
    margin-bottom: 24px;
    cursor: pointer;
  }

  .checkpoint-btn {
    color: #FFF;
    padding: 10px 15px;
    background: var(--main-theme);
    -webkit-box-shadow: 0px 3px 10px 1px rgba(204,204,204,0.4);
    box-shadow: 0px 3px 10px 1px rgba(204,204,204,0.4);
    cursor: pointer;
    border: none;
    border-radius: 5px;
  }

  .checkpoint-btn span {
    font-family: Roboto;
    font-size: 14px;
    text-decoration: none;
  }
</style>
