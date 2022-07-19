<template>
  <div class="dropzone">
    <span>Drag or Drop File</span>
    <span>OR</span>
    <label for="dropzoneFile"></label>
    <input type="file" id=" dropzoneFile" />
  </div>
</template>

<script>
export default {}
</script>

<style scoped lang="scss">
.dropzone {
  width: 400;
  height: 200;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 16px;
  border: 2px dashed black;
  transition: 0.3s ease all;

  label {
    padding: 8px 12px;
    color: white;
    background: black;
    transition: 0.3s ease all;
  }
  input {
    display: none;
  }
}
</style>
