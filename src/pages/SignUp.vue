<template>
  <v-main>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Sign up</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  label="Nume"
                  v-model="nume"
                  :rules="[rules.required]"
                >
                </v-text-field>
                <v-text-field
                  label="Prenume"
                  v-model="prenume"
                  :rules="[rules.required]"
                >
                </v-text-field>
                <v-text-field
                  label="Enter your E-mail"
                  v-model="email"
                  :rules="[rules.required, rules.email]"
                >
                </v-text-field>
                <v-text-field
                  name="input-10-1"
                  label="Enter your password"
                  hint="At least 8 characters"
                  v-model="password"
                  min="8"
                  :append-icon-cb="() => (e1 = !e1)"
                  :type="e1 ? 'password' : 'text'"
                  :rules="[rules.required]"
                  counter
                >
                </v-text-field>
                <v-text-field
                  name="input-10-1"
                  label="Confirm password"
                  hint="At least 8 characters"
                  v-model="confirmPassword"
                  min="8"
                  :type="e1 ? 'password' : 'text'"
                  :rules="[comparePasswords]"
                >
                </v-text-field>
              </v-form>
            </v-card-text>
              <v-btn color="primary" type="submit" @click="userSignUp">Sign Up</v-btn>
              <v-btn color="primary" type="submit" to="/login">Back</v-btn>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-main>
</template>

<style scoped>
</style>


<script>
  export default {
    name: 'login',
    data () {
      return {
        e1: true,
        password: '',
        confirmPassword: '',
        email: '',
        nume: null,
        prenume: null,
        image: null,
        rules: {
          required: (value) => !!value || 'Required.',
          email: (value) => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          }
        }
      }
    },
    computed: {
      comparePasswords () {
        return this.password !== this.confirmPassword ? 'Passwords do not match' : ''
      },
      user () {
        return this.$store.getters.user
      }
    },
    methods: {
      userSignUp () {
        this.$store.dispatch('signUp', {email: this.email, password: this.password, nume: this.nume, prenume: this.prenume})
      }
    }
  }
</script>