<template>
  <div>
    <div class="admin">
      <h1>This is an admin page to add Animals</h1>
    </div>
    <div class="form-container">
      <form @submit.prevent="onSubmit">
        <div class="form-group">
          <label>Name:</label>
          <input v-model="name" class="form-control" />
        </div>
        <div class="form-group">
          <label>Type:</label>
          <input v-model="type" class="form-control" />
        </div>
        <div class="form-group">
          <label>Description:</label>
          <textarea v-model="description" class="form-control"></textarea>
        </div>
        <div class="form-group">
          <label>Birthdate:</label>
          <input v-model="birthdate" class="form-control" />
        </div>
        <!-- <div class="image-uploader">
        <button @click="click1">choose a photo</button>
        <input
          type="file"
          ref="input1"
          style="display: none"
          @change="previewImage"
          accept="image/*"
        />
      </div> -->
        <div class="dropzone-container">
          <DropZone @drop.prevent="drop" @change="selectedFile" />
        </div>
        <div v-if="img1 != null">
          <span class="file-info">File: {{ img1 }}</span>
          <div>
            <img class="preview" height="268" width="356" :src="img1" />
            <br />
          </div>
        </div>
        <video v-if="videoLink != null" width="320" height="240" controls muted>
          <source :src="videoLink" type="video/mp4" />
          <source :src="videoLink" type="video/ogg" />
          Your browser does not support the video tag.
        </video>
      </form>
    </div>
    <div>
      <button @click="onSubmitForm">Upload Data</button>
    </div>
  </div>
</template>

<script>
import { getDatabase, ref as dbRef, push, set } from 'firebase/database'
import {
  getStorage,
  uploadBytesResumable,
  ref as storRef,
  getDownloadURL
} from 'firebase/storage'
import DropZone from '@/components/drop-zone.vue'
// import { ref as vueRef } from 'vue'

export default {
  name: 'admin-page',
  components: {
    DropZone
  },
  data () {
    return {
      events: null,
      animals: [],
      id: '',
      name: '',
      type: '',
      description: '',
      birthdate: '',
      imageLink: '',
      image: '',
      img1: null,
      imageData: null,
      videoLink: null
    }
  },
  methods: {
    onSubmitForm () {
      if (this.name === '' || this.img1 === '') {
        alert('enter name')

        alert(this.dropzoneFile.value)
        return
      }
      const db = getDatabase()
      const animalsRef = dbRef(db, 'animals')

      const newAnimalsRef = push(animalsRef)

      console.log('videoLink before upload: ' + this.videoLink)

      set(newAnimalsRef, {
        id: newAnimalsRef.key,
        name: this.name,
        type: this.type,
        description: this.description,
        birthdate: this.birthdate,
        image: this.img1,
        dateAdded: Date.now(),
        videoLink: this.videoLink
      })

      // console.log('data ' + newAnimalsRef.key)
      this.id = newAnimalsRef.key
    },

    click1 () {
      this.$refs.input1.click()
    },

    previewImage (event) {
      // console.log('previewImage')
      this.uploadValue = 0
      this.img1 = null
      this.onUpload()
    },
    // drop picture into dropbox
    drop (event) {
      this.imageData = event.dataTransfer.files[0]
      // console.log(this.imageData)
      this.previewImage()
    },
    // manually select picture
    selectedFile () {
      this.imageData = document.querySelector('.dropzoneFile').files[0]
      console.log(this.imageData)
      this.previewImage()
    },

    onUpload () {
      this.img1 = null
      const storage = getStorage()
      const storageRef = storRef(storage, `animals/${this.imageData.name}`)
      const uploadTask = uploadBytesResumable(storageRef, this.imageData)

      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      // console.log('upload task check')
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          // const progress =
          //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          // console.log('Upload is ' + progress + '% done')
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused')
              break
            case 'running':
              console.log('Upload is running')
              break
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          console.log('Unsuccessful Upload: ' + error)
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          this.uploadValue = 100
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // console.log('File available at', downloadURL)
            if (downloadURL.includes('.jpg') || downloadURL.includes('.png')) {
              this.img1 = downloadURL
              console.log('img1: ' + this.img1)
            } else if (downloadURL.includes('.mp4')) {
              this.videoLink = downloadURL
              console.log('videoLink: ' + this.videoLink)
            }
          })
        }
      )
    }
  }
}
</script>
<style scoped lang="scss">
.form-container {
  .form-group {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 10px;
    column-gap: 16px;
    label {
      width: 30%;
      text-align: right;
    }
    label + input {
      width: 15%;
      margin: 0 30% 0 2%;
    }
    label + textarea {
      width: 15%;
      margin: 0 30% 0 2%;
      resize: vertical;
    }
  }
  .dropzone-container {
    height: auto;
    width: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: white;

    .file-info {
      margin-top: 32px;
    }
  }
}
</style>
