<template>
  <div class="animals">
    <AnimalCard v-for="animal in animals" :key="animal.id" :animal="animal" />
    <!-- <div v-for="image in images" :key="image.id">
      <div>
        <span class="file-info">File: {{ image }}</span>
        <div>
          <img class="preview" height="268" width="356" :src="image" />
          <br />
        </div>
      </div>
    </div> -->
  </div>
  <div>{{ this.images }}</div>
</template>

<script>
// @ is an alias to /src
import AnimalCard from '../components/animal-card.vue'
// import EventService from "@/services/EventService.js";
import { getDatabase, ref as dbRef, onValue } from '@firebase/database'
import {
  getStorage,
  ref as storRef,
  listAll,
  getDownloadURL
} from 'firebase/storage'

export default {
  name: 'animals-page',
  components: {
    AnimalCard
  },
  data () {
    return {
      animals: [],
      animalData: [],
      images: [],
      videos: [],
      firebaseName: 'https://firebasestorage.googleapis.com/v0/b/'
    }
  },
  async mounted () {
    await this.getImages()
    await this.getData()
  },
  methods: {
    async getImages () {
      // get animal thumbnail
      const storage = getStorage()

      // Create a reference under which you want to list
      const listRef = storRef(storage, 'animals/')

      console.log('listRef ' + listRef)

      // Find all the prefixes and items.
      listAll(listRef)
        .then((res) => {
          // animals folder
          res.prefixes.forEach((folderRef) => {
            // id folder
            listAll(folderRef).then((res2) => {
              // images or video folder
              res2.prefixes.forEach((folderRef2) => {
                // image and video files
                listAll(folderRef2).then((res3) => {
                  res3.items.forEach((itemRef3) => {
                    getDownloadURL(storRef(storage, itemRef3)).then((url) => {
                      // `url` is the download URL for 'images/stars.jpg'
                      if (url.includes('.jpg') || url.includes('.png')) {
                        const imagesData = {
                          images: url
                        }
                        this.images.push(imagesData)
                        this.animals.images = this.images

                        console.log(
                          'animals images ' + JSON.stringify(this.images)
                        )
                      }
                    })
                  })
                })
              })
            })
          })
        })
        .catch((error) => {
          // Uh-oh, an error occurred!
          console.log(error)
        })
    },
    async getData () {
      // get all animal information
      const db = getDatabase()
      const animalsRef = dbRef(db, 'animals/')

      onValue(animalsRef, (snapshot) => {
        // console.log(snapshot.val())

        const data = snapshot.val()

        Object.entries(data).forEach(([animalKey, animalElement]) => {
          console.log(animalKey)
          this.animalData.push(animalElement)
          this.animals.images = this.images

          this.animals = Object.assign(this.animalData, this.images)
          // console.log('images 2 ' + JSON.stringify(this.images))
        })

        console.log('full animal object ' + JSON.stringify(this.animals))
      })
    }
  }
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
