<template>
  <div class="animal-page">
    <div v-if="animal">
      <router-link class="back-button" :to="{name: 'Animals'}">
        &lt; Back to Animal Gallery</router-link
      >
      <div class="nav-bar">
        <button
          :class="{invisible: !currentIndex != 0}"
          class="nav-button back"
          @click="getPreviousAnimal"
        >
          &lt; Back
        </button>
        <h1>{{ animal.name }}</h1>
        <!-- <h1>{{ currentIndex }}</h1> -->
        <button
          :class="{invisible: this.currentIndex == this.animals.length - 1}"
          class="nav-button forward"
          @click="getNextAnimal"
        >
          Forward >
        </button>
      </div>
      <img v-if="animal.image != ''" class="image" :src="animal.image" />
      <video width="320" height="240" controls muted>
        <source :src="animal.videoLink" type="video/mp4" />
        <source :src="animal.image" type="video/ogg" />
        Your browser does not support the video tag.
      </video>
      <p>Type of animal: {{ animal.type }}</p>
      <p>This animals was born on: {{ animal.birthdate }}</p>
      <p>{{ animal.description }}</p>
      <p>Date Added: {{ formatDate(animal.dateAdded) }}</p>
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
      animal: null,
      animals: [],
      keys: [],
      currentKey: '',
      currentIndex: -1
      // videoLink: 'https://firebasestorage.googleapis.com/v0/b/petting-zoo-c54f3.appspot.com/o/animals%2Ftest1.mp4?alt=media&token=8d10122c-e26f-4b99-bac1-fb5f275edbb7'
    }
  },
  created () {
    // get current animal
    const db = getDatabase()
    const animalsRef = ref(db, 'animals/' + this.id)

    onValue(animalsRef, (snapshot) => {
      console.log(snapshot.val())

      this.animal = snapshot.val()
      this.currentKey = animalsRef.key
    })

    // get all animals to cycle through
    const allAnimalsRef = ref(db, 'animals/')

    onValue(allAnimalsRef, (snapshot) => {
      const data = snapshot.val()

      // get array of just keys
      Object.entries(data).forEach(([animalKey, animalElement]) => {
        this.keys.push(animalKey)
        this.animals.push(animalElement)
      })

      this.currentIndex = this.keys.findIndex(this.getKey)
    })
  },
  methods: {
    formatDate (dateString) {
      const date = new Date(dateString)
      return date.toDateString()
    },
    getKey (key) {
      return key === this.currentKey
    },
    getPreviousAnimal () {
      if (this.currentIndex !== 0) {
        this.animal = this.animals[this.currentIndex - 1]

        this.$router.push({
          name: 'AnimalDetails',
          params: { id: this.keys[this.currentIndex - 1] }
        })
        this.currentIndex--
      } else {
        alert('cant go back')
      }
    },
    getNextAnimal () {
      if (this.currentIndex !== this.animals.length - 1) {
        this.animal = this.animals[this.currentIndex + 1]

        this.$router.push({
          name: 'AnimalDetails',
          params: { id: this.keys[this.currentIndex + 1] }
        })
        this.currentIndex++
      }
    }
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
    .invisible {
      visibility: hidden;
    }
  }
  .image {
    border: 1px solid black;
    width: 100%;
    height: 100%;
  }
}
</style>
