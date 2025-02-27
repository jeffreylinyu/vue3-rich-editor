# Vue3 Rich Editor

A Vue 3 rich text editor component that provides a customizable editing experience with a built-in toolbar. It supports text formatting, color changes, font size adjustments, text alignment, and paste filtering with limited styling.

## Installation

Install the package via npm:

```sh
npm install vue3-rich-editor
```

## Usage

Import and register the component in your Vue 3 project. For example, in `main.ts`:

```ts
import { createApp } from 'vue'
import App from './App.vue'
import Vue3RichEditor from 'vue3-rich-editor'
// Import styles
import 'vue3-rich-editor/dist/vue3-rich-editor.css'

const app = createApp(App)
app.use(Vue3RichEditor)
app.mount('#app')
```

Then use it in your Vue component:

```vue
<template>
  <div>
    <vue3-rich-editor v-model="editorContent" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const editorContent = ref('<p>Start editing...</p>')
    return { editorContent }
  },
})
</script>
```

## Features

- **Toolbar Controls**:

  - **Text Color**: Change the color of the text.
  - **Background Color**: Change the background color of the text.
  - **Font Size**: Select a preset font size from a dropdown.
  - **Formatting**: Bold, italic, underline, and strike-through.
  - **Alignment**: Left, center, or right text alignment.

- **Editable Area**:

  - Uses a `contenteditable` div to allow rich text editing.
  - Automatically emits updated HTML content for v-model binding.

- **Paste Handling**:
  - Filters pasted content to retain only allowed styles such as `color`, `background-color`, `font-size`, `font-style`, `font-weight`, and `text-decoration`.

## Props

| Prop  | Type   | Default | Description                              |
| ----- | ------ | ------- | ---------------------------------------- |
| value | String | `""`    | The initial HTML content for the editor. |

## Emits

| Event       | Payload Type | Description                              |
| ----------- | ------------ | ---------------------------------------- |
| update-html | String       | Emitted when the editor content changes. |

## Component Details

- **Toolbar**: Contains controls for adjusting text color, background color, font size, and various text styles.
- **Editable Area**: A `div` with `contenteditable="true"` that displays the HTML content and handles user input and paste events.
- **Paste Filtering**: On paste, the component processes the HTML content to only allow a limited set of CSS properties.

## Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check the [issues page](https://github.com/jeffreylinyu/vue3-rich-editor/issues) if you want to contribute.

## License

[MIT License](LICENSE)
