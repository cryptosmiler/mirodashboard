<template lang="html">
  <div class="">
    <transition class="side-nav-menu-main" name="slide">
      <side-bar v-show="show"></side-bar>
    </transition>
    <menu-bar/>
    <settings-top-bar/>
    <b-container 
      fluid 
      v-bind:class="{sideMenuOpen: sideMenuIsOpen, sideMenuClosed: sideMenuIsClosed}" 
      class="payment-container">
      <b-row class="main-account-view">
        <b-col cols="2" class="payment-method-side-menu">
        </b-col>


        <b-col cols="12" md="8">
           <p  class="title">Prepay Options</p>
          <b-table class="bucket-table" striped hover :items="items" :fields="fields">
            <template slot="buy" slot-scope="data">
              <a v-if="data.item.price != 'FREE'" :href="`buy-now-${data.item.price}`">Purchase</a>
            </template>
          </b-table>
          *Can be used across multiple races.
        </b-col>


        
      </b-row>
    </b-container>

  </div>


</template>

<script>
import EventBus from '../event-bus'
import SettingsTopBar from '../components/SettingsTopBar'

export default {
  name: 'prepay',
  data () {
    return {
      show: false,
      sideMenuIsOpen: false,
      sideMenuIsClosed: true,
      fields:[        
        {
          key: 'price',
          formatter: value => {
            if(value == 'FREE'){
              return 'FREE'
            } else {
              return `$${value / 100}`
            }
          }
        },
        {
          key: 'id',
          label: 'Athlete ID Quantity*',
        },
        {
          key: 'attributes',
          label: 'Per Additional ID',
          formatter: value => {
            return value.info
          }
        },
        {
          key: 'buy',
          label: ' ',
        }
        ],
      items: [
         {
      "id": "200",
      "attributes": {
        "size": "1000",
        "info": "please upgrade"
      },
      "price": 'FREE',
      "product": "prod_F4mogKJxKLhHPP",
      "updated": 1557989999
    },
    {
      "id": "1000",
      "object": "sku",
      "active": true,
      "attributes": {
        "size": "1000",
        "info": "40¢ per runner"
      },
      "created": 1557989999,
      "currency": "usd",
      "image": null,
      "inventory": {
        "quantity": null,
        "type": "infinite",
        "value": null
      },
      "livemode": false,
      "metadata": {
      },
      "package_dimensions": null,
      "price": 35000,
      "product": "prod_F4mogKJxKLhHPP",
      "updated": 1557989999
    },
    {
      "id": "2000",
      "object": "sku",
      "active": true,
      "attributes": {
        "size": "2000",
        "info": "35¢ per runner"
      },
      "created": 1557990038,
      "currency": "usd",
      "image": null,
      "inventory": {
        "quantity": null,
        "type": "infinite",
        "value": null
      },
      "livemode": false,
      "metadata": {
      },
      "package_dimensions": null,
      "price": 60000,
      "product": "prod_F4mogKJxKLhHPP",
      "updated": 1557990038
    },
    {
      "id": "4000",
      "object": "sku",
      "active": true,
      "attributes": {
        "size": "4000",
        "info": "30¢ per runner"
      },
      "created": 1557990061,
      "currency": "usd",
      "image": null,
      "inventory": {
        "quantity": null,
        "type": "infinite",
        "value": null
      },
      "livemode": false,
      "metadata": {
      },
      "package_dimensions": null,
      "price": 100000,
      "product": "prod_F4mogKJxKLhHPP",
      "updated": 1557990061
    },
    {
      "id": "10000",
      "object": "sku",
      "active": true,
      "attributes": {
        "size": "10000",
        "info": "25¢ per runner"
      },
      "created": 1557990101,
      "currency": "usd",
      "image": null,
      "inventory": {
        "quantity": null,
        "type": "infinite",
        "value": null
      },
      "livemode": false,
      "metadata": {
      },
      "package_dimensions": null,
      "price": 230000,
      "product": "prod_F4mogKJxKLhHPP",
      "updated": 1557990101
    },
    {
      "id": "20000",
      "object": "sku",
      "active": true,
      "attributes": {
        "size": "20000",
        "info": "23¢ per runner"
      },
      "created": 1557990133,
      "currency": "usd",
      "image": null,
      "inventory": {
        "quantity": null,
        "type": "infinite",
        "value": null
      },
      "livemode": false,
      "metadata": {
      },
      "package_dimensions": null,
      "price": 400000,
      "product": "prod_F4mogKJxKLhHPP",
      "updated": 1557990133
    }
  ]
    }
  },
  created () {
     EventBus.$on('change-side-nav', () => {
      this.show = !this.show
      this.sideMenuIsOpen = !this.sideMenuIsOpen
      this.sideMenuIsClosed = !this.sideMenuIsClosed
    })
  },
  components: {
    SettingsTopBar
  },
  methods: {
       
    }
}
</script>

<style lang="css" scoped>

.title{
  color: #aeb4c3;
  font-size: 24px;

}

.bucket-table{
  font-weight: bold;
  text-align: center;
}

.prepay-view{
  margin-top:3em;
}

  .slide-enter-active {
    transition: all .3s ease;
  }

  .slide-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-enter {
    transform: translateX(-220px);
  }

  .slide-leave-to {
    transform: translateX(-220px);
  }

  .sideMenuOpen {
    transition: all 0.3s ease;
    padding-left: 260px;
    left: 260px;
    opacity: 0.5;
    box-sizing: content-box;
  }

  .sideMenuClosed {
    transition: all 0.3s linear;
    padding-left: -260px;
  }


  @media only screen and (max-width: 768px) {
    .payment-method-side-menu {
      display: none;
    }
  }


</style>