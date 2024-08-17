<template lang="html">
  <b-col cols="4">
    <b-row class="justify-content-center">
      <b-col cols="auto">
        <font-awesome-icon size="3x" :icon="['fad', this.faIcon]" class="text-primary" />
      </b-col>
    </b-row>
    <b-row class="justify-content-center mt-2 mb-0">
      <b-col cols="auto">
        <span id="counter" class="text-body font-weight-bold">{{ counter | formatNumber }}</span>
      </b-col>
    </b-row>
    <b-row class="justify-content-center text-center">
      <b-col cols="auto">
        <span>{{ this.title }}</span>
      </b-col>
    </b-row>
  </b-col>
</template>

<script>
import EventBus from "../../event-bus";

/* eslint-disable */
export default {
  name: "account-balance-item",
  data() {
    return {};
  },
  props: {
    faIcon: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    counter: {
      type: Number,
      required: true
    }
  },
  mounted() {}
};
</script>


<style lang="css" scoped>
i {
  color: var(--main-theme);
}

#counter {
  font-size: 21px;
}
</style>
