<template>
  <main class="app">
    <TodoInput :on-add="addTodo" />
    
    <TodoList
      :todos="filteredTodos"
      :current-filter="filter"
      :remaining-count="remainingCount"
      :completed-count="completedCount"
      @toggle="toggleTodo"
      @update="updateTitle"
      @remove="removeTodo"
      @set-filter="setFilter"
      @clear-completed="clearCompleted"
    />
  </main>
</template>

<script setup>
import TodoInput from './components/TodoInput.vue'
import TodoList from './components/TodoList.vue'
import { useTodos } from './composables/useTodos.js'

const {
  filter,
  filteredTodos,
  remainingCount,
  completedCount,
  addTodo,
  toggleTodo,
  updateTitle,
  removeTodo,
  clearCompleted,
  setFilter
} = useTodos()

</script>


