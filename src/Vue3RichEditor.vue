<template>
  <div class="rich-text-editor">
    <!-- 工具列 -->
    <div class="toolbar">
      <!-- 文字顏色 -->
      <label>
        文字顏色：
        <input
          type="color"
          @mousedown="saveSelection"
          @input="(event) => handleColorInput(event, 'color')"
        />
      </label>

      <!-- 背景顏色 -->
      <label>
        背景顏色：
        <input
          type="color"
          @mousedown="saveSelection"
          @input="(event) => handleColorInput(event, 'background-color')"
        />
      </label>

      <!-- 字體大小：一般下拉選單 -->
      <label>
        字體大小：
        <select @mousedown.stop="saveSelection" @change="handleFontSizeChange">
          <option v-for="size in presetFontSizes" :key="size" :value="size">{{ size }}px</option>
        </select>
      </label>

      <!-- 粗體 -->
      <button @mousedown="saveSelection" @click="toggleBold">粗體</button>
      <!-- 斜體 -->
      <button @mousedown="saveSelection" @click="toggleItalic">斜體</button>
      <!-- 下劃線 -->
      <button @mousedown="saveSelection" @click="toggleUnderline">下劃線</button>
      <!-- 刪除線 -->
      <button @mousedown="saveSelection" @click="toggleLineThrough">刪除線</button>

      <!-- 文字對齊 -->
      <button @mousedown="saveSelection" @click="setAlign('left')">靠左</button>
      <button @mousedown="saveSelection" @click="setAlign('center')">置中</button>
      <button @mousedown="saveSelection" @click="setAlign('right')">靠右</button>
    </div>

    <!-- 編輯區 -->
    <div
      class="editor"
      contenteditable="true"
      v-html="value"
      @input="onInput"
      @paste="handlePaste"
      style="min-height: 120px"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'

/** ============ Props & Emits ============ */
defineProps({
  value: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['update-html'])

/** ============ 狀態與常數 ============ */
let savedRange: Range | null = null // 暫存使用者選取
/** 預設常用字體大小列表 (顯示在下拉選單) */
const presetFontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72]

/** ============ 核心函式 ============ */

/** 編輯器內容改變 => 通知外部 v-model */
function onInput(e: Event) {
  emit('update-html', (e.target as HTMLElement).innerHTML)
}

/** 在點擊按鈕 / 下拉選單前，先保存當前的 Range */
function saveSelection() {
  const sel = window.getSelection()
  if (sel && sel.rangeCount > 0) {
    savedRange = sel.getRangeAt(0)
  }
}

/** 還原選取 */
function restoreSelection() {
  if (!savedRange) return
  const sel = window.getSelection()
  if (!sel) return
  sel.removeAllRanges()
  sel.addRange(savedRange)
}

/**
 * 先用 <span style="font-size:0"> 包住選取內容
 * 以避免第一次執行 fontSize 時，瀏覽器出現 xxx-large。
 */
function preWrapSelection() {
  if (!savedRange) return

  // 複製範圍內容
  const fragment = savedRange.cloneContents()
  if (!fragment || !fragment.firstChild) return

  // 建立一個 span style="font-size:0"
  const span = document.createElement('span')
  span.style.fontSize = '0'

  // 把範圍內容放入該 span
  span.appendChild(fragment)

  // 刪除原範圍內容
  savedRange.deleteContents()

  // 再插回帶有包裹的 span
  savedRange.insertNode(span)

  // 重新選取該 span
  savedRange.selectNode(span)
}

/**
 * 當使用者選擇字體大小 => 執行
 */
function handleFontSizeChange(event: Event) {
  const select = event.target as HTMLSelectElement
  if (!select.value) return
  const sizeNum = parseFloat(select.value)
  if (isNaN(sizeNum) || sizeNum <= 0) return

  applyFontSize(sizeNum)
}

/**
 * 套用字體大小：
 * 1. preWrapSelection() (避免第一次執行時跳出 xxx-large)
 * 2. execCommand("fontSize", "7")
 * 3. 後處理 <font size="7"> => style="font-size: ?? px"
 * 4. 若有 xxx-large / x-large / large / small => 覆蓋成指定 px
 */
function applyFontSize(num: number) {
  restoreSelection()

  // 包住選取(避免第一次產生 xxx-large)
  preWrapSelection()
  restoreSelection()

  // 若支援 styleWithCSS => inline-style
  if (document.queryCommandSupported('styleWithCSS')) {
    document.execCommand('styleWithCSS', false, 'true')
  }

  // 統一把選取文字設成 size="7"
  document.execCommand('fontSize', false, '7')

  // 後處理
  const editor = document.querySelector('.editor')
  if (!editor) return

  // (1) 把 <font size="7"> => style="font-size: num px"
  editor.querySelectorAll('font[size="7"]').forEach((fontEl) => {
    fontEl.removeAttribute('size')
    ;(fontEl as HTMLElement).style.fontSize = num + 'px'
  })

  // (2) 若瀏覽器還是產生 large / x-large / xxx-large => 一律改回 num + px
  editor.querySelectorAll('span[style*="font-size"]').forEach((spanEl) => {
    const styleVal = (spanEl as HTMLElement).style.fontSize.toLowerCase().trim()
    if (styleVal.includes('large') || styleVal.includes('small')) {
      ;(spanEl as HTMLElement).style.fontSize = num + 'px'
    }
  })
}

/** 文字顏色、背景顏色 */
function handleColorInput(e: Event, styleType: 'color' | 'background-color') {
  restoreSelection()
  const input = e.target as HTMLInputElement
  if (!input.value) return

  if (document.queryCommandSupported('styleWithCSS')) {
    document.execCommand('styleWithCSS', false, 'true')
  }

  if (styleType === 'color') {
    document.execCommand('foreColor', false, input.value)
  } else {
    if (document.queryCommandSupported('hiliteColor')) {
      document.execCommand('hiliteColor', false, input.value)
    } else {
      document.execCommand('backColor', false, input.value)
    }
  }
}

/** 粗體 / 斜體 / 下劃線 / 刪除線 */
function toggleBold() {
  restoreSelection()
  document.execCommand('bold', false)
}
function toggleItalic() {
  restoreSelection()
  document.execCommand('italic', false)
}
function toggleUnderline() {
  restoreSelection()
  document.execCommand('underline', false)
}
function toggleLineThrough() {
  restoreSelection()
  document.execCommand('strikeThrough', false)
}

/** 左 / 中 / 右 對齊 */
function setAlign(direction: 'left' | 'center' | 'right') {
  restoreSelection()
  switch (direction) {
    case 'left':
      document.execCommand('justifyLeft', false)
      break
    case 'center':
      document.execCommand('justifyCenter', false)
      break
    case 'right':
      document.execCommand('justifyRight', false)
      break
  }
}

/** ============ 貼上過濾 (保留有限樣式) ============ */
const allowedStyles = [
  'color',
  'background-color',
  'font-size',
  'font-style',
  'font-weight',
  'text-decoration',
]

function transformHTML(container: HTMLElement) {
  const allEl = container.querySelectorAll('*')
  Array.from(allEl).forEach((el) => {
    const element = el as HTMLElement
    const div = document.createElement('div')

    allowedStyles.forEach((style) => {
      const value = element.style[style as keyof CSSStyleDeclaration]
      if (value) {
        div.style.cssText += `${style}: ${value};`
      }
    })

    while (element.firstChild) {
      div.appendChild(element.firstChild)
    }
    element.replaceWith(div)
  })
}
function handlePaste(e: ClipboardEvent) {
  e.preventDefault()
  const clipboardData = e.clipboardData
  if (!clipboardData) return

  const htmlContent = clipboardData.getData('text/html') || clipboardData.getData('text/plain')
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlContent, 'text/html')
  transformHTML(doc.body)

  const sel = window.getSelection()
  if (sel && sel.rangeCount > 0) {
    const range = sel.getRangeAt(0)
    range.deleteContents()
    const fragment = document.createDocumentFragment()
    Array.from(doc.body.childNodes).forEach((node) => fragment.appendChild(node))
    range.insertNode(fragment)
  }
}
</script>

<style scoped>
.rich-text-editor {
  border: 1px solid #ccc;
  border-radius: 4px;
  max-width: 700px;
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  font-family: sans-serif;
}

.toolbar {
  margin-bottom: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.editor {
  border: 1px solid #ddd;
  padding: 8px;
  overflow-y: auto;
  white-space: normal;
  line-height: 1.5;
  min-height: 120px;
}
</style>
