<template>
  <b-modal centered :size="size" content-class="shadow" :id="id">
    <div slot="modal-header">
      <b-col order="1">{{ title }}</b-col>
      <b-col cols="4" order="2">
        <b-img fluid right :src="getMainLogo()"></b-img>
      </b-col>
    </div>
    <div class="share-site-body">
      <slot name="body"></slot>
    </div>
  </b-modal>
</template>

<script>
import platformHelper from "@/utils/platformHelper"

export default {
  name: "miro-style-modal",
  props: {
    id: {
      type: String,
      required: false
    },
    title: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: "sm",
    },
  },
  methods: {
    getMainLogo() {
      return platformHelper.getLogo()
    },
  },
  computed: {},
}
</script>

<style scoped lang="css">
.share-site-modal {
  display: grid;
  grid-template-rows: 6em auto;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
}

.share-site-header {
  background: var(--main-theme);
  color: #d6eef8;
  font-size: 2em;
  padding: 1em 1.2em 0.5em;
  margin-bottom: 0;
  font-weight: 300;
}

.share-site-header span {
  font-size: 30px;
}

.share-site-body {
  display: grid;
  padding: 2.5em;
  padding-top: 3em;
}
label {
  text-transform: uppercase;
}
</style>
