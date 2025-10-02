<template>
  <section class="todo-list-section">
    <div class="todo-stats">
      <p class="remaining-count">
        Осталось задач: <strong>{{ remainingCount }}</strong>
      </p>
      <button
        v-if="completedCount > 0"
        @click="$emit('clearCompleted')"
        class="btn btn-clear"
        aria-label="Очистить выполненные"
      >
        Очистить выполненные ({{ completedCount }})
      </button>
    </div>

    <div class="filters">
      <button
        v-for="f in filters"
        :key="f.value"
        @click="$emit('setFilter', f.value)"
        class="filter-btn"
        :class="{ active: currentFilter === f.value }"
        :aria-pressed="currentFilter === f.value"
      >
        {{ f.label }}
      </button>
    </div>

    <ul v-if="todos.length > 0" class="todo-list">
      <TodoItem
        v-for="todo in paginatedTodos"
        :key="todo.id"
        :todo="todo"
        @toggle="$emit('toggle', $event)"
        @update="(id, title) => $emit('update', id, title)"
        @remove="$emit('remove', $event)"
      />
    </ul>

    <!-- Пагинация -->
    <div v-if="showPagination" class="pagination">
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="pagination-btn"
        aria-label="Предыдущая страница"
      >
        ← Назад
      </button>

      <div class="pagination-info">
        Страница <strong>{{ currentPage }}</strong> из <strong>{{ totalPages }}</strong>
        <span class="pagination-count">(показано {{ paginatedTodos.length }} из {{ todos.length }})</span>
      </div>

      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="pagination-btn"
        aria-label="Следующая страница"
      >
        Вперёд →
      </button>
    </div>

    <p v-else-if="todos.length === 0" class="empty-message">
      {{ emptyMessage }}
    </p>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import TodoItem from './TodoItem.vue'

const props = defineProps({
  todos: {
    type: Array,
    required: true
  },
  currentFilter: {
    type: String,
    required: true
  },
  remainingCount: {
    type: Number,
    required: true
  },
  completedCount: {
    type: Number,
    required: true
  }
})

defineEmits(['toggle', 'update', 'remove', 'setFilter', 'clearCompleted'])

const filters = [
  { value: 'all', label: 'Все' },
  { value: 'active', label: 'Активные' },
  { value: 'completed', label: 'Выполненные' }
]

// Пагинация
const ITEMS_PER_PAGE = 5
const currentPage = ref(1)

const totalPages = computed(() => {
  return Math.ceil(props.todos.length / ITEMS_PER_PAGE)
})

const showPagination = computed(() => {
  return props.todos.length > ITEMS_PER_PAGE
})

const paginatedTodos = computed(() => {
  if (!showPagination.value) {
    return props.todos
  }
  
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  return props.todos.slice(start, end)
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Сбрасываем страницу при изменении фильтра или списка задач
watch([() => props.currentFilter, () => props.todos.length], () => {
  currentPage.value = 1
})

const emptyMessage = computed(() => {
  switch (props.currentFilter) {
    case 'active':
      return 'Нет активных задач'
    case 'completed':
      return 'Нет выполненных задач'
    default:
      return 'Список задач пуст. Добавьте первую задачу!'
  }
})
</script>


