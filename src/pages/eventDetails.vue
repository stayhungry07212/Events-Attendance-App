<template>
  <v-layout>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">Homepage</el-breadcrumb-item>
      <el-breadcrumb-item>{{ eventDetails.titlu }}</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="header">
      <img :src="eventDetails.avatar" class="meeting-image" />
      <span class="title">{{ eventDetails.titlu }}</span>
      <div class="low-opacity-text date">
        {{ eventDetails.data | formatDate }}
      </div>
    </div>

    <div class="attend-button">
      <el-button type="success" plain v-if="userUID && !userParticipate"
        @click="attend()">Attend</el-button
      >
      <div
        class="low-opacity-text attending-text"
        v-if="userUID && userParticipate"
      >
        Attending <i class="el-icon-check"></i>
      </div>
    </div>

    <div class="description" v-html="eventDetails.descriere"></div>

    <div class="users">
      <div
        v-for="(user, index) in eventDetails.participatingUsers"
        :key="index"
        class="user-details"
      >
        <el-avatar
          :src="
            user.image
              ? user.image
              : 'https://cdn1.iconfinder.com/data/icons/material-core/20/account-circle-512.png'
          "
        ></el-avatar>
        <div>{{ user.prenume }}</div>
      </div>
    </div>
  </v-layout>
</template>

<style scoped>
.date {
  font-size: 14px;
}
.attending-text {
  font-size: 10px;
  color: #17a398;
}
.layout {
  margin: 0 43px;
  display: flex;
  flex-flow: column;
}
.el-breadcrumb {
  padding: 20px 0;
}
.title {
  padding: 10px 0;
}
.description {
  padding: 16px 0;
}
.users {
  display: flex;
  flex-flow: wrap;
  align-items: center;
  justify-content: center;
}
.header {
  display: flex;
  flex-flow: column;
  align-items: center;
}
.user-details,
.attend-button {
  display: flex;
  padding: 10px;
  flex-flow: column;
  align-items: center;
}
.meeting-image {
  width: 60vw;
  border-radius: 2%;
}
.el-avatar {
  width: 80px;
  height: 80px;
}
</style>

<script>
import * as moment from "moment";
export default {
  name: "events",
  data() {
    return {
      id: this.$route.params.id,
    };
  },
  filters: {
    formatDate(date) {
      return moment(date).fromNow();
    },
  },
  computed: {
    eventDetails() {
      return this.$store.getters.currentEventDetails;
    },
    userUID() {
      return this.$store.getters.userUID;
    },
    userParticipate() {
      if (this.eventDetails.participants) {
        return Object.keys(this.eventDetails.participants).includes(
          this.userUID
        );
      } else {
        return false;
      }
    },
  },
  mounted() {
    this.$store.dispatch("getEventDetails", this.id);
  },
  methods: {
    attend() {
      this.$store.dispatch("addAttendingToMeeting", this.id);
    }
  }
};
</script>
