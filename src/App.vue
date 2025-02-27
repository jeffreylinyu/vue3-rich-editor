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
