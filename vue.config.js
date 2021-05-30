module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  "configureWebpack": {
    "resolve": {
      "alias": {
        "vue$": "vue/dist/vue.esm.js"
      }
    }
  }
}