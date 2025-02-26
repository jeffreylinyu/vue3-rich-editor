<template>
  <div class="container">
    <h2>Vue3 Rich Editor Demo</h2>

    <Vue3RichEditor :value="content" @update-html="handleUpdate"></Vue3RichEditor>

    <div class="preview" v-if="content">
      <h3>Current Content:</h3>
      <pre class="html-code">{{ content }}</pre>

      <h3>Rendered Result:</h3>
      <div class="rendered-content" v-html="content"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const content = ref('Initial content')

const handleUpdate = (html: string) => {
  content.value = html
  console.log('Content updated:', html)
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
}

.preview {
  margin-top: 20px;
  padding: 15px;
  border-top: 1px solid #ddd;
}

.html-code {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}

.rendered-content {
  margin-top: 10px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
}
</style>
