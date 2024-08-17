<template lang="html">
  <div
    class="photos-footer"
    :class="{selectMode: getSelectMode}"
    >
    <b-pagination
      size="sm"
      :total-rows="totalRows"
      :value="currentPage"
      @input="changePage"
      :per-page="1"
      class="pagination-component"
      >
    </b-pagination>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import EventBus from "../../event-bus.js";
export default {
  methods: {
    changePage(newVal) {
      let currentFilter = this.$store.getters["PhotosFilter/getCurrentFilter"];
      let maxPhotos = this.$store.getters["PhotosFilter/getMaxPhotosPerPage"];
      let checkpoint = this.getCurrentCheckpoint;
      let start = 1;
      // offset determines number of photos to show per page
      let offset = maxPhotos;
      let isRecent = currentFilter === "Recent";
      let state = "all";
      let order = this.$store.getters["Events/getEventContentSettings"].order;

      start = newVal * maxPhotos - (maxPhotos - 1);
      offset = start + (maxPhotos - 1);

      if (currentFilter !== "Uploading" && !isRecent) {
        state = currentFilter;
      }

      if (currentFilter === "Published") {
        state = "visible";
      }
      this.$store.dispatch("Events/getEventContent", {
        eventId: this.$route.params.id,
        start,
        offset,
        recent: isRecent,
        status: state,
        order,
        checkpoint
      });

      this.$store.dispatch("PhotosFilter/changePaginationValue", newVal);
    }
  },
  watch: {
    // currentPage (newVal, oldVal) {
    //   console.log(`${newVal} vs ${oldVal}`)
    //   if (newVal != oldVal) {
    //     this.changePage(newVal)
    //   }
    // }
  },
  computed: {
    ...mapGetters(["getSelectMode"]),
    ...mapGetters("EventCheckpoint", [
      "getCurrentCheckpoint",
      "getCheckpoints"
    ]),
    totalRows() {
      let summary = this.$store.getters["Events/getEventContentSummary"];
      let filter = this.$store.getters["PhotosFilter/getCurrentFilter"];
      let maxPhotos = this.$store.getters["PhotosFilter/getMaxPhotosPerPage"];

      if (filter === "Published") {
        return Math.ceil(summary.visible ? summary.visible / maxPhotos : 1)
      } else if (filter === "Hidden") {
        return Math.ceil(summary.hidden ? summary.hidden / maxPhotos : 1)
      } else {
        if (this.getCurrentCheckpoint == 0) {
          return Math.ceil(summary.objects / maxPhotos)
        } else {
          return this.getCheckpoints.filter(e => e.checkpoint_id == this.getCurrentCheckpoint).reduce((a,e) => e.images / maxPhotos, 1)
          /* for (
            let index = 0;
            index < this.getCheckpoints.length;
            index++
          ) {
            const checkpoint = this.getCheckpoints[index];
            if (checkpoint.checkpoint_id == this.getCurrentCheckpoint) {
              return checkpoint.images / maxPhotos;
            }
          } */
        }
      }
    },
    currentPage() {
      return this.$store.getters["PhotosFilter/getPaginationValue"];
    }
  },

  mounted() {
    // reset pagination for now
    // Anthony
    this.$store.dispatch("PhotosFilter/changePaginationValue", 1);
    EventBus.$on("reset-pagination", () => {
      this.$store.dispatch("PhotosFilter/changePaginationValue", 1);
    });
  }
};
</script>

<style lang="css">
.photos-footer {
  position: fixed;
  background: #9fa9ba;
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

.photos-footer.selectMode {
  background: #00283d;
}

.pagination-component {
  grid-column: 11 / 12;
  margin-bottom: 0;
}

a.page-link {
  color: #fff;
}

.page-link {
  background-color: transparent;
  border: 0px;
}

.page-item.disabled .page-link {
  background-color: transparent;
}

.page-item.active .page-link {
  border-radius: 0;
  background: transparent;
  background-color: none;
  border: 1px solid #fff;
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
