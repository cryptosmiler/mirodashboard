<template lang="html">
  <div>
    <invite-modal :_email = "email" :_password = "password" />
  </div>
</template>

<script>
import EventBus from '../event-bus'
import inviteModal from '../components/InviteModal'

export default {
  name: 'invite',
  data(){
    return {
      email: "",
      password: "",
    }
  },
  mounted () {
    this.email = this.$route.params.email;
    this.password = this.$route.params.password;
  },
  components :{
    inviteModal
  }
}
</script>