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
        <div v-if="progress != 0">{{ progress.toFixed() }} %</div>
        <div class="dropzone-container">
          <div>Pictures to Upload:</div>
          <DropZone @drop.prevent="drop" @change="selectedFile" />
        </div>
        <div v-for="picture in uploadPictureData" :key="picture.id">
          <div>{{ picture.name }}</div>
          <!-- <div v-if="data.image != null">
            <span class="file-info">File: {{ data.image }}</span>
            <div>
              <img class="preview" height="268" width="356" :src="img1" />
              <br />
            </div>
          </div> -->
          <!-- <video
            v-if="data.videoLink != null"
            width="320"
            height="240"
            controls
            muted
          >
            <source :src="data.videoLink" type="video/mp4" />
            <source :src="data.videoLink" type="video/ogg" />
            Your browser does not support the video tag.
          </video> -->
        </div>
        <div v-for="video in uploadVideoData" :key="video.id">
          <div>{{ video.name }}</div>
        </div>
      </form>
    </div>
    <div>
      <button @click="onSubmitForm">Upload Data</button>
    </div>
  </div>
</template>

<script>
import { getDatabase, ref as dbRef, push, set, update } from 'firebase/database'
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
      uploadPictureData: [],
      uploadVideoData: [],
      img1: null,
      dropData: null,
      videoLink: null,
      progress: 0,
      images: [],
      videos: []
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

      set(newAnimalsRef, {
        id: newAnimalsRef.key,
        name: this.name,
        type: this.type,
        description: this.description,
        birthdate: this.birthdate,
        dateAdded: Date.now(),
        images: [],
        videos: []
      })

      // console.log('data ' + newAnimalsRef.key)
      this.id = newAnimalsRef.key

      this.onUpload()

      console.log('uploadPictureData after upload: ' + this.uploadPictureData)
      console.log('uploadVideoData after upload: ' + this.uploadVideoData)

      this.images = this.uploadPictureData
      this.videos = this.uploadVideoData

      // update same key with images and videos
      const postData = {
        id: newAnimalsRef.key,
        name: this.name,
        type: this.type,
        description: this.description,
        birthdate: this.birthdate,
        images: this.images,
        videos: this.videos
      }

      const updates = {}
      updates['animals/' + this.id] = postData

      update(dbRef(db), updates)
    },

    click1 () {
      this.$refs.input1.click()
    },

    // previewImage (event) {
    //   // console.log('previewImage')
    //   this.uploadValue = 0
    //   this.img1 = null
    // },
    // drop picture into dropbox
    drop (event) {
      this.dropData = event.dataTransfer.files[0]

      const filename = this.dropData.name

      if (filename.includes('.jpg') || filename.includes('.png')) {
        this.uploadPictureData.push(event.dataTransfer.files[0])
      } else if (filename.includes('.mp4')) {
        this.uploadVideoData.push(event.dataTransfer.files[0])
      }
      this.previewImage()
    },
    // manually select file
    selectedFile () {
      this.dropData = document.querySelector('.dropzoneFile').files[0]

      const filename = this.dropData.name

      if (filename.includes('.jpg') || filename.includes('.png')) {
        this.uploadPictureData.push(
          document.querySelector('.dropzoneFile').files[0]
        )
      } else if (filename.includes('.mp4')) {
        this.uploadVideoData.push(
          document.querySelector('.dropzoneFile').files[0]
        )
      }
      // this.previewImage()
    },
    onUpload () {
      this.img1 = null

      this.uploadPictureData.forEach(this.upload)
      this.uploadVideoData.forEach(this.upload)
    },
    upload (uploadMedia) {
      console.log('uploadPicture: ' + uploadMedia.name)
      let mediaType = ''

      if (
        uploadMedia.name.includes('.jpg') ||
        uploadMedia.name.includes('.png')
      ) {
        mediaType = 'images'
      } else if (uploadMedia.name.includes('.mp4')) {
        mediaType = 'videos'
      }

      const storage = getStorage()
      const storageRef = storRef(
        storage,
        `animals/${this.id}/${mediaType}/${uploadMedia.name}`
      )
      const uploadTask = uploadBytesResumable(storageRef, uploadMedia)
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
          this.progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log('Upload is ' + this.progress + '% done')
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
      width: 30%;
      margin: 0 30% 0 2%;
    }
    label + textarea {
      width: 30%;
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
