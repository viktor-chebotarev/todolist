<template>
  <section class="todo-input-section">
    <h1>Трекер задач</h1>
    <form @submit.prevent="handleSubmit" class="todo-input-form">
      <input
        ref="inputRef"
        v-model="inputValue"
        type="text"
        placeholder="Что нужно сделать?"
        class="todo-input"
        aria-label="Новая задача"
      >
      <button 
        type="submit" 
        class="btn btn-add"
        aria-label="Добавить задачу"
      >
        Добавить
      </button>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  onAdd: {
    type: Function,
    required: true
  }
})

const inputValue = ref('')
const inputRef = ref(null)

const handleSubmit = () => {
  if (inputValue.value.trim()) {
    props.onAdd(inputValue.value)
    inputValue.value = ''
    inputRef.value?.focus()
  }
}
</script>


