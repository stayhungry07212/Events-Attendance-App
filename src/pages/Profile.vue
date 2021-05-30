 <template>
   <v-container>
      <!-- <v-layout justify-center>
        <v-flex xs6>
          <img :src="getuserdetails.image" height="200" v-if="getuserdetails.image !== ''">
          <input type="file"  style="display:none" ref="pictureInput" accept="image/*" @change="pictureSelect">
          <v-btn id="imagine"
          :loading="loading3"
          :disabled="loading3"
          color="blue-grey"
          class="white--text"
          @click.native="loader = 'loading3'"
          @click="addPicture"
          :value = "pictureSelect"
          >
            Select profile pic
            <v-icon right dark>cloud_upload</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
      <v-layout justify-center>
          <v-flex xs6>
          <v-layout>
            <v-flex>
              <v-card>
                <v-card-text>
                  <v-text-field
                    name="nume"
                    label="Last name"
                    :value = getuserdetails.nume
                    id="nume"
                  ></v-text-field>
                  <v-spacer></v-spacer>
                  <v-text-field
                    name="prenume"
                    label="First name"
                    :value = getuserdetails.prenume
                    id="prenume"
                  ></v-text-field>
                  <v-text-field
                    name="parolaactuala"
                    label="Current password"
                    hint="Minim 8 caractere"
                    v-model="oldpass"
                    min="8"
                    :type="e1 ? 'password' : 'text'"
                    id = "oldpsw"
                    required
                  >
                  </v-text-field>
                  <v-text-field
                      label="New password"
                      name="parolanoua"
                      hint="Minim 8 caractere"
                      v-model="password"
                      min="8"
                      :append-icon-cb="() => (e1 = !e1)"
                      :type="e1 ? 'password' : 'text'"
                      counter
                    >
                    </v-text-field>
                    <v-text-field
                      name="parolanouaconfirm"
                      label="Confirm new password"
                      hint="Minim 8 caractere"
                      v-model="confirmPassword"
                      min="8"
                      :type="e1 ? 'password' : 'text'"
                      :rules="[comparePasswords]"
                      id = "newpsw"
                    >
                  </v-text-field>
                  <v-btn color="primary" @click="savenewdetails">Save</v-btn>
                  <v-btn color="primary" router to = "/">Back</v-btn>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout> -->
      Future profile dialog
   </v-container>
 </template>

<!-- <style>
img {
  margin: 0;
  padding: 0;
}
#imagine {
  display: block;
}
</style> -->

<script>
import firebase from '@/firebase'
export default {
  name: 'Profile',
  data () {
    return {
      password: '',
      email: '',
      e1: true,
      oldpass: '',
      confirmPassword: '',
      user1: null,
      imageUrl: '',
      image: null,
      selectedFile: null,
      downloadURL: null,
      loading3: false,
      rules: {
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Email invalid.'
        }
      }
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    },
    comparePasswords () {
      return this.password !== this.confirmPassword ? 'Parolele nu corespund' : ''
    },
    events () {
      return this.$store.getters.events
    },
    userdetails () {
      return this.$store.getters.userdetails
    }
  },
  created () {
    return this.$store.getters.userdetails
  },
  methods: {
    savenewdetails () {
      const nume = document.getElementById('nume').value
      const prenume = document.getElementById('prenume').value
      const cale = firebase.database().ref('users/' + this.user.uid)
      const parolanoua = document.getElementById('newpsw').value
      cale.update({nume: nume, prenume: prenume})
      firebase.auth().signInWithEmailAndPassword(this.user.email, this.oldpass).then(function () {
        cale.update({nume: nume, prenume: prenume})
        firebase.auth().currentUser.updatePassword(parolanoua).then(function () {
          window.alert('Parola a fost schimbată')
        }).catch(function (error) {
          console.log(error.message)
        })
      }).catch(function (error) {
        console.log(error.message)
      })
    },
    addPicture () {
      this.$refs.pictureInput.click()
    },
    pictureSelect (payload) {
      const selectedFile = payload.target.files[0]
      const filesName = this.user.uid
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.imageUrl = fileReader.result
      })
      fileReader.readAsDataURL(selectedFile)
      this.imageUrl = selectedFile
      const storageRef = firebase.storage().ref('/users/' + filesName)
      console.log(storageRef)
      const uploadTask = storageRef.put(selectedFile)
      uploadTask.on('state_changed', snapshot => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log('Upload is ' + progress + '% done')
      }, error => {
        console.log(error)
      }, () => {
        console.log('succes')
        var downloadURL = uploadTask.snapshot.downloadURL
        console.log('Done. Enjoy', downloadURL)
        this.image = downloadURL
        firebase.database().ref('/users/' + this.user.uid).update({
          image: downloadURL
        })
      })
    }
  }
}
</script>