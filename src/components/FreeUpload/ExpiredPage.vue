<template lang="html">
  <div class="expiredPageBoard">
    <br><br>
    <b-img class="roundImg" :src="getImage()"></b-img>
    <div>
      Sorry. The link you provided has expired!
    </div>
  </div>
</template>

<script>
import platformHelper from "@/utils/platformHelper"

export default {
  name: 'stressExpiredPage',
  methods: {
    getImage(){
      return platformHelper.getExpiredImage()
    }
  }
}
</script>

<style lang="css" scoped>
.expiredPageBoard{
  text-align: center;
  font-size: 50px;
  font-weight: bold;
  animation-name: fadeIn;
  animation-duration: 2s;
  color: #1fa896;
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
  animation-name: heartbeat;
  animation-duration: 1.2s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

@keyframes heartbeat {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

</style>
