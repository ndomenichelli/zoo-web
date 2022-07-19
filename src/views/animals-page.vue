<template>
  <div class="animals">
    <AnimalCard v-for="animal in animals" :key="animal.id" :animal="animal" />
  </div>
</template>

<script>
// @ is an alias to /src
import AnimalCard from '../components/animal-card.vue'
// import EventService from "@/services/EventService.js";
import { getDatabase, ref, onValue } from '@firebase/database'

export default {
  name: 'animals-page',
  components: {
    AnimalCard
  },
  data () {
    return {
      animals: []
    }
  },
  created () {
    const db = getDatabase()
    const animalsRef = ref(db, 'animals/')

    onValue(animalsRef, (snapshot) => {
      console.log(snapshot.val())

      const data = snapshot.val()

      Object.entries(data).forEach(([animalKey, animalElement]) => {
        console.log(animalKey)
        this.animals.push(animalElement)
      })

      console.log(this.animals)
    })
  },
  mounted () {}
}
</script>

<style scoped>
.animals {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  /* grid-gap: 1rem; */
  max-width: 80rem;
  margin: 5rem auto;
  padding: 0 10rem;
  align-items: center;
}
.gallery-panel img {
  width: 100%;
  height: 22vw;
  object-fit: cover;
  border-radius: 0.75rem;
}
</style>
