<template lang="html">
  <div class="blankPageBoard">
    <br><br>
    <b-img class="roundImg" :src="getImage()"></b-img>
    <div>
      Sorry. We couldn't find the link you provided!
    </div>
  </div>
</template>

<script>
import platformHelper from "@/utils/platformHelper"

export default {
  name: 'stressBlankPage',
  methods: {
    getImage(){
      return platformHelper.get404Image()
    }
  }
}
</script>

<style lang="css" scoped>
.blankPageBoard{
  text-align: center;
  font-size: 50px;
  font-weight: bold;
  animation-name: fadeIn;
  animation-duration: 2s;
  color: #9b4339;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(-100px);
  }
  30% {
    opacity: 0.7;
    transform: translateY(60px) scale(1.2, 1.2);
  }
  80% {
    opacity: 1;
    transform: translateY(0) scale(1, 1);
  }
}

.roundImg{
  width: 300px;
  height: 300px;
  border-radius: 150px;
  margin-bottom: 30px;
  animation-name: rotate;
  animation-duration: 10s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>
