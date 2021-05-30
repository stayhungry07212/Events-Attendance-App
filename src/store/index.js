import Vue from 'vue'
import Vuex from 'vuex'
import firebase from '@/firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    events: [],
    fb: {
      db: firebase.database()
    },
    userUID: null,
    keysEvents: [],
    userDetails: null,
    eventsGoing: [],
    image: null,
    uploadPicture: [],
    error: null,
    loginSignupDialog: false,
    updateProfilePicture: '',
    currentEventDetails: ''
  },
  mutations: {
    setError(state, payload) {
      state.error = payload
    },
    setUserDetails(state, payload) {
      state.userDetails = payload
    },
    setUserUID(state, payload) {
      state.userUID = payload
    },
    getEvents: (state, payload) => {
      state.events.push(payload)
    },
    getKeys: (state, payload) => {
      state.keysEvents = payload
    },
    eventsGoing: (state, payload) => {
      state.eventsGoing = payload
    },
    uploadPicture(state, payload) {
      state.uploadPicture.push(payload)
    },
    updateProfilePicture(state, payload) {
      state.updateProfilePicture.push(payload)
    },
    emptyEvents: (state) => {
      state.events = []
    },
    emptyGoing: (state) => {
      state.eventsGoing = []
    },
    setLoginSignupDialog: (state, payload) => {
      state.loginSignupDialog = payload
    },
    setEventDetails: (state, payload) => {
      state.currentEventDetails = payload;
    }
  },
  actions: {
    readEvents({ commit }) {
      return firebase.database().ref('events')
        .on('value', snap => {
          commit('emptyEvents')
          const myObj = snap.val()
          const keys = Object.keys(snap.val())
          keys.forEach(key => {
            var eventdetails = {}
            eventdetails.avatar = myObj[key].avatar
            eventdetails.descriere = myObj[key].descriere
            eventdetails.id = key
            eventdetails.prezenta = myObj[key].prezenta
            eventdetails.titlu = myObj[key].titlu
            eventdetails.data = new Date(myObj[key].data)
            eventdetails.prezenti = myObj[key].prezenti
            commit('getEvents', eventdetails)
          })
          commit('getKeys', keys)
        }, function (error) {
          console.log('Error: ' + error.message)
        })
    },
    signUp({ commit }, payload) {
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('setUserUID', user.user.uid)
            commit('setLoginSignupDialog', false)
            this.dispatch('getUserDetails');
            firebase.database().ref('/users/' + user.user.uid).set({
              nume: payload.nume,
              prenume: payload.prenume,
              email: payload.email,
              image: '',
              attendings: ''
            })
          }
        )
        .catch(
          error => {
            console.log(error)
          }
        )
    },
    signIn({ commit }, payload) {
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('setUserUID', user.user.uid)
            commit('setLoginSignupDialog', false)
            this.dispatch('getUserDetails');
          })
        .catch(
          error => {
            commit('setError', error)
          }
        )
    },
    addAttendingToMeeting({ commit }, payload) {
      console.log(commit)
      firebase.database().ref('/users/' + this.state.userUID + '/attendings/' + payload).set(true);
      firebase.database().ref('/events/' + payload + '/participants/' + this.state.userUID).set(true);
    },
    getUserDetails({ commit }) {
      if (this.state && this.state.userUID) {
        firebase.database().ref('/users/' + this.state.userUID).on('value', snap => {
          commit('setUserDetails', snap.val());
        })
      } else {
        commit('setUserDetails', null);
      }
    },
    AuthChange({ commit }) {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          commit('setUserUID', user.uid);
          this.dispatch('getUserDetails');
        } else {
          commit('setUserUID', null)
        }
      })
    },
    signOut({ commit }) {
      firebase.auth().signOut().then(function () {
        commit('setUserUID', null)
        this.dispatch('getUserDetails');
      }).catch(
        error => {
          console.log(error)
        })
    },
    loginSignupDialog({ commit }, payload) {
      commit('setLoginSignupDialog', payload)
    },
    updateProfile({commit}, payload) {
      console.log(commit)
      firebase.database().ref('users/' + this.state.userUID).update({ nume: payload.nume, prenume: payload.prenume })
    },

    updateProfilePicture({commit}, payload) {
      console.log(commit)
      console.log(payload)
      firebase.database().ref('users/' + this.state.userUID).update({ image: payload})
    },
    getEventDetails({commit}, payload) {
      firebase.database().ref('/events/' + payload).on('value', snap => {
        let eventDetails = snap.val();
        if (eventDetails.participants) {
          let usersDetails = [];
          Object.keys(eventDetails.participants).forEach(userID => {
            firebase.database().ref('/users/' + userID).on('value', snap => {
              usersDetails.push(snap.val());
            })
          })
          eventDetails.participatingUsers = usersDetails;
        }
        commit('setEventDetails', eventDetails);
      })

    }
  },
  getters: {
    events: state => state.events,
    userUID: state => state.userUID,
    userDetails: state => state.userDetails,
    keysEvents: state => state.keysEvents,
    eventsGoing: state => state.eventsGoing,
    uploadPicture: state => state.uploadPicture,
    error: state => state.error,
    loginSignupDialog: state => state.loginSignupDialog,
    currentEventDetails: state => state.currentEventDetails
  }
})
