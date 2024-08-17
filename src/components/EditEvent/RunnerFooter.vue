<template lang="html">
  <div class="runner-footer">
    <b-pagination
      size="sm"
      :total-rows="totalRows"
      v-model="page"
      @input="changePage"
      :per-page="1"
      class="pagination-component"
      >
    </b-pagination>
  </div>
</template>

<script>
import EventBus from '../../event-bus.js'
export default {
  name: 'runner-footer',
  data () {
    return {
      totalPage: 1,
      page: 1,
    }
  },
  methods: {
    changePage (newVal) {
      EventBus.$emit('change-page-runner', this.page)
    }
  },
  watch: {
    currentPage (newVal, oldVal) {
      this.changePage(newVal)
    }
  },
  computed: {
    totalRows () {
      return this.totalPage
    },
    currentPage () {
      return this.page
    }
  },

  mounted () {
    EventBus.$on('reset-pagination-runner', payload => {
      this.totalPage = payload.totalPage
      this.page = payload.page
    })
  }
}
</script>

<style lang="css">
  .runner-footer {
    position: fixed;
    background: #9FA9BA;
    height: 3.5em;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    color: white;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    align-items: center;
    justify-items: end;
  }

  .runner-footer.selectMode {
    background: #00283D;
  }

  .pagination-component {
    grid-column: 11 / 12;
    margin-bottom: 0;
  }

  a.page-link {
    color: #fff;
  }

  .page-item.active .page-link {
    border-radius: 0;
    background: transparent;
    background-color: none;
    border: 1px solid #fff !important;
  }

  .page-link {
    background-color: transparent !important;
    border-color: transparent !important;
  }

  .page-link:hover {
    border-radius: 0;
    background: transparent;
    border: 1px solid #fff;
    color: #fff;
  }

  .page-link:focus {
    box-shadow: none;
    color: #fff;
    background-color: inherit;
  }
</style>
