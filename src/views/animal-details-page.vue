<template>
  <div class="animal-page">
    <div v-if="animal">
      <router-link class="back-button" :to="{name: 'Animals'}"> &lt; Back to Animal Gallery</router-link>
      <div class="nav-bar">
        <button class="nav-button">&lt; Back</button>
        <h1>{{ animal.name }}</h1>
        <button class="nav-button">Forward ></button>
      </div>
      <img v-if="animal.image != ''" class="image" :src="animal.image" />
      <p>Type of animal: {{ animal.type }}</p>
      <p>This animals was born on: {{ animal.birthdate }}</p>
      <p>{{ animal.description }}</p>
    </div>
  </div>
</template>

<script>
// import EventService from '@/services/EventService.js'
import { getDatabase, ref, onValue } from '@firebase/database'

export default {
  props: ['id'],
  data () {
    return {
      animal: null
    }
  },
  created () {
    const db = getDatabase()
    const animalsRef = ref(db, 'animals/' + this.id)

    onValue(animalsRef, (snapshot) => {
      console.log(snapshot.val())

      this.animal = snapshot.val()
    })
  }
}
</script>
<style lang="scss">
.animal-page {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 40%;
  .back-button {
    background-color: #4caf50;
    border: none;
    color: white;
    padding: 8px 16px;
    text-align: center;
    text-decoration: bold;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
  }
  .nav-bar {
    display: flex;
    margin-left: auto;
    margin-right: auto;
    justify-content: space-around;
    .nav-button {
      background-color: green;
      border: 2px soid black;
      color: white;
      padding: 8px 16px;
      text-align: center;
      display: inline-block;
      font-size: 16px;
      margin: 40px 20px;
      cursor: pointer;
    }
  }
  .image {
    border: 1px solid black;
    width: 100%;
    height: 100%;
  }
}
</style>
