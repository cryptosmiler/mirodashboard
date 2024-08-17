<template>
  <div class="passwordForm">
    <b-img class="roundImg" :src="getImage()"></b-img>
    <h2>Enter Password</h2>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required :style="{ border: password ? '2px solid #4CAF50' : '2px solid #ccc' }">
      </div>
      <button @click="submitForm">Submit</button>
  </div>
</template>

<script>
import platformHelper from "@/utils/platformHelper"
import EventBus from '../../event-bus'

export default {
  name: 'passwordForm',
  props: ['_password'],
  data() {
    return {
      password: '',
      link_name: this.$route.params.link,
    };
  },
  methods: {
    submitForm() {
      if(this.password==this._password){
        EventBus.$emit("password-correct");
      }
    },
    getImage(){
      return platformHelper.getPasswordImage()
    }
  }
};
</script>

<style scoped>
.passwordForm {
  text-align: center;
  margin-top: 50px;
  animation-name: fadeUp;
  animation-duration: 1s;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: bold;
}

input[type="password"] {
  padding: 10px;
  border-radius: 5px;
}

button {
  padding: 10px 20px;
  background-color: #E85C4D;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #A24036;
}

.roundImg {
  width: 200px;
  height: 200px;
  border-radius: 100px;
  border: 5px solid rgb(200, 200, 200);
  margin-bottom: 50px;
  margin-top: 100px;
  /* animation-name: heartbeat;
  animation-duration: 1.7s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite; */
}

@keyframes heartbeat {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.03, 1.03);
  }
  100% {
    transform: scale(1);
  }
}
</style>