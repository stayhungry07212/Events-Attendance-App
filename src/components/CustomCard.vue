<template>
  <el-card class="box-card" shadow="hover">
    <div class="header">
      <img :src="item.avatar" class="avatar" />
      <span class="title">{{ item.titlu }}</span>
    </div>
    <div class="details">
      <div class="date-description">
        <div class="low-opacity-text date">{{ item.data | formatDate }}</div>
        <div  v-html="getTruncatedText(item.descriere)"></div>
      </div>
      <div class="actions">
        <div
          class="low-opacity-text attending-text"
          v-if="userLoggedIn && userIsParticipating"
        >
          Attending <i class="el-icon-check"></i>
        </div>
        <div
          @click="attend()"
          class="low-opacity-text not-attending-text"
          v-if="userLoggedIn && !userIsParticipating"
        >
          Click to attend
        </div>
        <div v-if="!userLoggedIn"></div>
        <el-button type="info" plain @click="goToDetailsPage()"
          >See details</el-button
        >
      </div>
    </div>
  </el-card>
</template>

<script>
import * as moment from "moment";
export default {
  name: "CustomCard",
  props: {
    item: null,
    userLoggedIn: null,
    userIsParticipating: null,
  },
  filters: {
    formatDate(date) {
      return moment(date).fromNow();
    }
  },
  methods: {
    getTruncatedText(text) {
      if (text.length > 100) {
        return text.substring(0, 100) + "...";
      }
      return text;
    },
    goToDetailsPage() {
      this.$router.push("/eventDetails/" + this.item.id);
    },
    attend() {
      this.$store.dispatch("addAttendingToMeeting", this.item.id);
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-flow: wrap;
}
.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  align-items: center;
}
.el-card {
  margin: 10px;
  border-radius: 5px;
  width: 250px;
}
.el-card__header {
  padding: unset;
}
.date {
  font-size: 14px;
}
.avatar {
  width: 100%;
  height: 200px;
  border-radius: 5px;
}
.el-card__body {
  padding: 0;
  height: 100%;
  height: 100% !important;
}
.attending-text {
  font-size: 10px;
  color: #17a398;
}
.not-attending-text {
  font-size: 10px;
}
.not-attending-text:hover {
  text-decoration: underline;
  cursor: pointer;
}
.details {
  flex-flow: column;
  display: flex;
  height: 185px;
  justify-content: space-between;
}
</style>
