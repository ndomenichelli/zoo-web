<template>
  <router-link
    class="animal-link"
    :to="{ name: 'AnimalDetails', params: { id: animal.id } }"
  >
    <div class="animal-card">
      <!-- <h4>{{ animal.name }}</h4> -->
      <img v-if="animal.images != ''" class="image" :src="animal.images" />
      <div>{{ animal.image }}</div>
      <!-- <div>Type of animal: {{ animal.type }}</div> -->
      <!-- <div>{{ animal.description }}</div> -->
      <!-- <div>{{ animal.birthdate }}</div> -->
      <!-- <div>{{ animal.imageLink }}</div> -->
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'AnimalCard',
  props: {
    animal: {
      type: Object,
      required: true
    }
  },
  methods: {
    // thumbUrl (filename) {
    //   return require(`../assets/images/${filename}`)
    // }
  }
}
</script>

<style scoped>
.animal-card {
  padding: 20px;
  width: 250px;
  cursor: pointer;
  border: 1px solid black;
  margin-bottom: 18px;
}

.image {
  border: 1px solid black;
  width: 100%;
  height: 100%;
}

</style>
