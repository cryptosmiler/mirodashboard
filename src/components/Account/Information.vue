<template lang="html">
  <b-container> 
    <div class="account-information-container">
      <p class="account-information-title">Profile<div class="text-right required-fields">*required fields</div></p>
      <div class="account-information">
        <b-form @submit="onSubmit">
          <b-row>
            <b-col cols="12" md="6">
              <b-form-group label="First Name *"
                            label-for="firstName"
                            breakpoint="md"
                            >
                <b-form-input id="firstName"
                              type="text"
                              v-model="form.first_name"
                              @input="inputAccountInfo()"
                              required >
                </b-form-input>
              </b-form-group>
            </b-col>
            <b-col cols="12" md="6">
              <b-form-group label="Last Name *"
                            label-for="lastName"
                            breakpoint="md"
                            >
                <b-form-input id="lastName"
                              type="text"
                              v-model="form.last_name"
                              @input="inputAccountInfo()"
                              required >
                </b-form-input>
              </b-form-group>
            </b-col>
            
            <b-col cols="12" md="6" v-if="profile.role!== 1">
              <b-form-group label="Email"
                            label-for="email">
                <b-form-input id="email"
                              type="text"
                              disabled
                              v-model="form.email"
                              @input="inputAccountInfo()"
                              title="Contact support to update your email address."
                              required >
                </b-form-input>
              </b-form-group>
            </b-col>

            <b-col cols="12" md="6" v-else>
              <b-form-group label="Email"
                            label-for="email">
                <b-form-input id="email"
                              type="text"
                              v-model="form.email"
                              disabled >
                </b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <button type="submit" variant="secondary" class="save-button" :class="{hasChanges: changesMade}" :disabled="!changesMade">SAVE</button>
        </b-form>
      </div>
    </div>
  </b-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'account-information',
  data () {
    return {
      form: {},
      originalForm: {},
      changesMade: false,
    }
  },
  methods: {
    onSubmit (e) {
      e.preventDefault()
      this.$store.dispatch('Auth/putProfile', this.form).then((resp) => {
        if (resp.status) {
          this.originalForm.first_name = resp.first_name
          this.originalForm.last_name = resp.last_name
          this.originalForm.email = resp.email
        }
      })

      this.changesMade = false
    },
    inputAccountInfo () {
      //  Checks to see if form is changed
      for (let key in this.originalForm) {
        if (this.originalForm[key] !== this.form[key]) {
          this.changesMade = true
          break
        }
        this.changesMade = false
      }
    }
  },
  computed: {
    ...mapGetters('Auth', ['profile']),
    email_address(){
      return this.profile.email
    }
  },
  created () {
    this.form = JSON.parse(JSON.stringify(this.profile))
    this.originalForm.first_name = this.form.first_name
    this.originalForm.last_name = this.form.last_name
    this.originalForm.email = this.form.email
  }
}
</script>

<style lang="css" scoped>
  .account-information-container {
    background: #fff;
    box-shadow: 0px 4px 10px 1px rgba(204,204,204,1);
  }

  .account-information-title {
    font-size: 20px;
    padding: 1.5em 2em;
    color: #a0a9b8;
    margin: 0;
    font-weight: 500;
    border-bottom: 1px solid #ccd0d8;
  }

  .account-information {
    padding: 3em;
    margin-bottom: 2em;
    color: #a0a9b8 !important;
    padding-bottom: 5em;
  }

  .form-control {
    border-bottom: 1px solid #ccd0d8;
    border-radius: 0;
    padding: 0 0 0.5em 0;
    color: #a0a9b8;
    font-weight: 400;
    background-image: none;
  }

  .form-control:focus {
    box-shadow: none;
    border-bottom: 1px solid var(--main-theme);
  }

  .form-control:invalid {
    background: none;
  }

  .save-button {
    border: none;
    background: #afb7c3;
    color: #fff;
    padding: 1em 2em;
    float: right;
    border-radius: 5px;
    font-weight: 400;
    box-shadow: 0px 4px 10px 1px rgba(204,204,204,1);
  }

  .save-button:hover {
    cursor: pointer;
  }

  .save-button.hasChanges {
    background: var(--main-theme);
  }

  .toasted-container .toasted {
    background: red;
    justify-content: center;
  }

  .red{
    color: red;
  }

  .required-fields{
    margin-right: 30px;
    transform: translate(0, -55px);
    color: #a0a9b8;
  }
</style>
