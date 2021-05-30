<template>
  <v-app>
    <el-menu class="el-menu-demo" mode="horizontal">
      <el-menu-item @click="openLoginSignupDialog" v-if="!userIsAuthenticated">Login / SignUp</el-menu-item>
      <el-menu-item v-if="userIsAuthenticated">
        <el-dropdown @command="handleAvatarDropdown">
          <el-avatar size="medium" :src="circleUrl"></el-avatar>

          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="goToProfilePage">Profile</el-dropdown-item>
            <el-dropdown-item command="signOut">Logout</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-menu-item>
    </el-menu>

    <v-main>
      <router-view />
    </v-main>

    <el-dialog :title="signInActivated ? 'Login' : 'Sign up'" :visible.sync="loginSignupDialog">
      <v-form v-if="signInActivated" class="custom-form">
        <el-input placeholder="Email" v-model="emailLogin"></el-input>
        <el-input placeholder="Password" v-model="passwordLogin" show-password></el-input>
        <v-alert
          :value="true"
          type="error"
          v-if="error !== null"
        >Incorrect email or password. Please try again.</v-alert>
        <a @click="forgotPassword" class="forgot-password">Forgot password?</a>
        <el-button plain type="primary" @click="userSignin">Sign in</el-button>
      </v-form>
      <div class="no-content" v-if="signInActivated">
        <div class="dialog-description-form">You don't have an account?</div>
        <el-button plain @click="signInActivated = false">Sign up</el-button>
      </div>
      <div class="no-content" v-if="!signInActivated">
        <div class="dialog-description-form">Do you have an account?</div>
        <el-button plain @click="signInActivated = true">Sign in</el-button>
      </div>
      <v-form v-if="!signInActivated" class="custom-form">
        <el-input placeholder="Name" v-model="numeSignUp"></el-input>
        <el-input placeholder="Surname" v-model="prenumeSignUp"></el-input>
        <el-input placeholder="Email" v-model="emailSignUp"></el-input>
        <el-input placeholder="Password" v-model="passwordSignUp" show-password></el-input>
        <el-button plain type="primary" @click="userSignUp">Sign Up</el-button>
      </v-form>
    </el-dialog>

    <el-dialog title="Profile" :visible.sync="profileDialog">
      <v-form class="custom-profile-form" v-if='userDetails'>
        <el-upload
          class="avatar-uploader"
          action=""
          :auto-upload="false"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="userDetails.image !== ''" :src="userDetails.image" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-input placeholder="Email" v-model="userDetails.email" class='email-input'></el-input>
        <el-input placeholder="Name" v-model="userDetails.nume" @change="changeName"></el-input>
        <el-input placeholder="Surname" v-model="userDetails.prenume"></el-input>
        <el-button type="primary" v-if="editProfile === false" @click="editProfile = true">Edit</el-button>
        <el-button type="primary" v-if="editProfile === true" @click="updateProfile">Save</el-button>
      </v-form>
    </el-dialog>
  </v-app>
</template>

<style>
.el-dialog__body {
  display: flex;
  flex-flow: row;
  padding: 0px !important;
  height: 50vh !important;
}
.el-dialog {
  background-size: cover !important;
  background-image: url("./assets/singinbackground.jpeg") !important;
  height: 50%;
  width: 50%;
}
.el-dialog__title {
  color: white !important;
}
form {
  width: 50%;
  height: 100%;
  text-align: -webkit-center;
}
.dialog-description-form {
  color: white;
  padding-bottom: 10px;
  font-size: 1.3rem;
}
.custom-form {
  background-color: white;
  padding: 34px;
  height: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
}

.custom-profile-form {
  background-color: white;
  padding: 34px;
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
}

.low-opacity-text {
  opacity: 0.5;
}
.el-input {
  padding: 5px;
}

.forgot-password {
  padding: 10px 0px;
}
.no-content {
  display: flex;
  flex-flow: column;
  margin-top: -10%;
  align-items: center;
  justify-content: center;
  padding: 34px;
  width: 50%;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.email-input {
  background-color: white;
}
</style>

<script>
import firebase from "@/firebase";
import router from "./router";
export default {
  name: "App",
  data() {
    return {
      clipped: true,
      signInActivated: true,
      drawer: false,
      fixed: false,
      email: "",
      description: "",
      items: [
        {
          icon: "bubble_chart",
          title: "Inspire",
        },
      ],
      miniVariant: false,
      showPasswordIcon: true,
      passwordLogin: "",
      emailLogin: "",
      showPasswordIcon2: true,
      passwordSignUp: "",
      emailSignUp: "",
      numeSignUp: null,
      prenumeSignUp: null,
      editProfile: false,
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      profileDialog: false,
   
    };
  },
  created: function () {
    this.$store.dispatch("readEvents");
    this.$store.dispatch("AuthChange");
    this.$store.dispatch("getUserDetails");
  },
  computed: {
  
    events() {
      return this.$store.getters.events;
    },
    totalEvents() {
      return this.$store.getters.events.length;
    },
    totalAttendings() {
      return this.$store.getters.eventsGoing.length;
    },
    value() {
      return Math.floor((this.totalAttendings * 100) / this.totalEvents);
    },
    color() {
      if (this.value < 30) return "red";
      if (this.value < 60) return "green";
      if (this.value < 80) return "blue";
      return "yellow";
    },
    userIsAuthenticated() {
      return (
        this.$store.getters.userUID !== null &&
        this.$store.getters.userUID !== undefined
      );
    },
    loginSignupDialog() {
      return this.$store.getters.loginSignupDialog;
    },
    userDetails() {
      return this.$store.getters.userDetails;
    },
    user() {
      return this.$store.getters.userUID;
    },
    error() {
      return this.$store.getters.error;
    },
    comparePasswords() {
      return this.password !== this.confirmPassword
        ? "Passwords do not match"
        : "";
    },
  },
  methods: {
    onSignOut() {
      this.$store.dispatch("signOut");
    },
    userSignin() {
      this.$store.dispatch("signIn", {
        email: this.emailLogin,
        password: this.passwordLogin,
      });
    },
    forgotPassword() {
      this.loginDialog = false;
      const emailprompt = prompt("Introdu adresa de email", "");
      firebase
        .auth()
        .sendPasswordResetEmail(emailprompt)
        .then(function () {
          window.alert(
            "A fost trimis un email de recuperare a parolei la adresa: " +
              emailprompt
          );
        })
        .catch(function (error) {
          window.alert(error.message);
        });
    },
    userSignUp() {
      this.$store.dispatch("signUp", {
        email: this.emailSignUp,
        password: this.passwordSignUp,
        nume: this.numeSignUp,
        prenume: this.prenumeSignUp,
      });
    },
    openLoginSignupDialog() {
      this.$store.dispatch("loginSignupDialog", true);
    },

    goToHp() {
      router.push("/");
    },
    changeName() {
      console.log(this.details)
    },
    updateProfile() {
      this.$store.dispatch("updateProfile", {
        nume: this.userDetails.nume,
        prenume: this.userDetails.prenume,
      });
    },

    handleAvatarDropdown(command) {
      switch (command) {
        case "goToProfilePage":
          this.profileDialog = true;
          break;
        case "signOut":
          this.onSignOut();
          break;
      }
    },

    handleAvatarSuccess(res, file) {
      console.log(res, file)
      let currentUserImage = URL.createObjectURL(file.raw);
      this.$store.dispatch("updateProfilePicture", {
        image: currentUserImage
      });
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("Avatar picture must be JPG format!");
      }
      if (!isLt2M) {
        this.$message.error("Avatar picture size can not exceed 2MB!");
      }
      return isJPG && isLt2M;
    },
  },
};
</script>
