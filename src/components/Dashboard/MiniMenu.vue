<template lang="html">
    <b-container fluid class="edits-top-bar">
      
      <b-row  align-v="center" style="height: 100%;" class="d-flex justify-content-around flex-nowrap">
        
        <div>
          <button
            type="button"
            name="button"
            class="top-bar-buttons"
            :class="[isCurrentPage === 'Event' ? 'activePage' : '' ]"
            @click="changePage('data')"
            >
            <i class="fas fa-database"></i>
            DATA
          </button>
        </div>
        <div>
          <button
            type="button"
            name="button"
            class="top-bar-buttons"
            :class="[isCurrentPage === 'EventSettings' ? 'activePage' : '' ]"
            @click="changePage('settings')"
            >
            <i class="fas fa-cog"></i>
            SETTINGS
          </button>
        </div>
      </b-row>
    </b-container>
  </template>
  
  <script>
  import { mapGetters } from 'vuex'
  import platformHelper from '@/utils/platformHelper'

  
  export default {
    name: 'mini-menu',
    data () {
      return {
        role: null,
        platformHelper
      }
    },
    computed: {
      ...mapGetters('Events', ['getSelectedEvent']),
      ...mapGetters('Auth', ['profile']),
      isCurrentPage () {
        return this.$router.history.current.name
      },
    },
    mounted(){
      this.getRole()
    },
    methods: {
      getRole() {
        this.$nextTick(() => {
          this.role = this.profile.role
        });
      },
      changePage (page) {
        if(page == "data")
        {
          this.$router.push(`/events/${this.getSelectedEvent.event_id}`)
        }
        else if(page == "settings"){
          this.$router.push(`/events/${this.getSelectedEvent.event_id}/${page}`)
        }
      },
    }
  }
  </script>
  
  <style lang="css" scoped>
  
    .edits-top-bar {
      background: var(--main-theme);
      margin-bottom: 30px;
    }
  
    .top-bar-buttons {
      background: none;
      border: none;
      color: #FFFFFF;
      font-weight: 400;
      border-bottom: 5px solid var(--main-theme);
      height: 3.5em;
      width: 100%;
    }
  
    .top-bar-buttons:hover {
      border-bottom: 5px solid #fff;
      cursor: pointer;
    }
  
    .activePage {
      border-bottom: 5px solid white !important;
    }
  
    .event-home-router a {
      color: #a3a9b3;
    }
  
    .event-home {
      float: left;
    }
  
    .event-home-text {
      position: relative;
      top: -4px;
      color: #a3a9b3;
    }
  
    .event-home-router:hover {
      text-decoration: none;
    }
  
    .material-icons.arrow-back {
      top: 2px;
      position: relative;
      color: #a3a9b3;
    }
  
    @media only screen and (max-width: 768px) {
      .photos-main-view-header {
        padding: 1em;
      }
  
      .top-bar-buttons {
        font-size: 12px;
        height: 6em;
      }
  
      .filters-row {
        width: 100%;
        margin: 0 auto;
        padding: 1em 0;
      }
  
      .filter-buttons {
        height: 0;
      }
  
      .image-count-upload {
        padding-left: 0;
      }
  
      .image-count {
        margin-bottom: 5px;
      }
  
      .create-event-button {
        width: 100%;
        padding: 9px 5px 0px 5px;
      }
    }
  </style>
  