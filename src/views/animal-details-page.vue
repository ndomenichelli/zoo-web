<template>
  <div class="animal-page">
    <div v-if="animal">
      <h1>{{ animal.name }}</h1>
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

  .image {
    border: 1px solid black;
    width: 100%;
    height: 100%;
  }
}
</style>
