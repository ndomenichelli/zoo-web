<template>
  <div
    @dragenter.prevent="toggleActive"
    @dragleave.prevent="toggleActive"
    @dragover.prevent
    @drop.prevent="toggleActive"
    :class="{'active-dropzone': active}"
    class="dropzone"
  >
    <span>Drag or Drop File</span>
    <span>OR</span>
    <label for="dropzoneFile">Select File</label>
    <input type="file" id="dropzoneFile" class="dropzoneFile" />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'DropZone',
  setup () {
    const active = ref(false)

    const toggleActive = () => {
      active.value = !active.value
    }

    return { active, toggleActive }
  }
}
</script>

<style scoped lang="scss">
.dropzone {
  width: 400px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 16px;
  border: 2px dashed green;
  transition: 0.3s ease all;

  label {
    padding: 8px 12px;
    color: white;
    background-color: green;
    transition: 0.3s ease all;
  }
  input {
    display: none;
  }
}

.active-dropzone {
  color: white;
  border-color: white;
  background-color: green;
  label {
    background-color: white;
    color: green;
  }
}
</style>
