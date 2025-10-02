<template>
  <li class="todo-item" :class="{ completed: todo.completed }">
    <div class="todo-content">
      <input
        type="checkbox"
        :checked="todo.completed"
        @change="$emit('toggle', todo.id)"
        class="todo-checkbox"
        :aria-label="`Отметить задачу '${todo.title}' как ${todo.completed ? 'невыполненную' : 'выполненную'}`"
      >
      
      <span v-if="!isEditing" class="todo-title" @click="startEdit">
        {{ todo.title }}
      </span>
      
      <input
        v-else
        ref="editInputRef"
        v-model="editValue"
        type="text"
        class="todo-edit-input"
        @keyup.enter="saveEdit"
        @keyup.esc="cancelEdit"
        @blur="saveEdit"
        aria-label="Редактирование задачи"
      >
    </div>

    <div class="todo-actions">
      <button
        v-if="!isEditing"
        @click="startEdit"
        class="btn btn-edit"
        aria-label="Редактировать"
      >
        Изменить
      </button>
      
      <button
        v-if="isEditing"
        @mousedown.prevent="saveEdit"
        class="btn btn-save"
        aria-label="Сохранить"
      >
        Сохранить
      </button>
      
      <button
        v-if="isEditing"
        @mousedown.prevent="cancelEdit"
        class="btn btn-cancel"
        aria-label="Отменить"
      >
        Отмена
      </button>
      
      <button
        v-if="!isEditing"
        @click="$emit('remove', todo.id)"
        class="btn btn-delete"
        aria-label="Удалить"
      >
        Удалить
      </button>
    </div>
  </li>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const props = defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['toggle', 'update', 'remove'])

const isEditing = ref(false)
const editValue = ref('')
const editInputRef = ref(null)

const startEdit = async () => {
  isEditing.value = true
  editValue.value = props.todo.title
  await nextTick()
  editInputRef.value?.focus()
  editInputRef.value?.select()
}

const saveEdit = () => {
  if (editValue.value.trim() && editValue.value.trim() !== props.todo.title) {
    emit('update', props.todo.id, editValue.value)
  }
  isEditing.value = false
}

const cancelEdit = () => {
  isEditing.value = false
  editValue.value = ''
}
</script>


