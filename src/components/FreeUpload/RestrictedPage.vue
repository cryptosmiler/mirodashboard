<template lang="html">
  <div class="restrictedPageBoard">
    <br><br><br>
    <b-img class="roundImg" :src="getImage()"></b-img>
    <div>
      The link you provided has been restricted!
    </div>
  </div>
</template>

<script>

import platformHelper from "@/utils/platformHelper"

export default {
  name: 'stressRestrictedPage',
  methods: {
    getImage(){
      return platformHelper.getRestrictedImage()
    }
  }
}
</script>

<style lang="css" scoped>
.restrictedPageBoard{
  text-align: center;
  font-size: 50px;
  font-weight: bold;
  animation-name: fadeIn;
  animation-duration: 2s;
  color: var(--main-theme);
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

.roundImg {
  width: 300px;
  height: 300px;
  border-radius: 150px;
  margin-bottom: 30px;
  animation-name: fall;
  animation-duration: 4s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

@keyframes fall {
  0% {
    transform: translateY(-140px) rotate(-50deg) translateX(-130px);
  }
  30% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-120px) rotate(50deg) translateX(130px);
  }
  80% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-140px) rotate(-50deg)  translateX(-130px);
  }
}
</style>
