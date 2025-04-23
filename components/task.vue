<template>
  <div>
    <v-fade-transition>
      <v-card v-if="isVisible" class="rounded-lg pa-4 task-card" :elevation="isMinimized ? 0 : 24"
        :class="{ 'minimized': isMinimized }">
        <div class="d-flex align-center mb-2">
          <v-card-title class="d-flex align-center px-0 py-1">
            <v-icon color="primary" class="mr-2">mdi-lightbulb-on-outline</v-icon>
            <span class="text-h6 text-gradient">Create your website</span>
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon="mdi-help-circle-outline" size="x-small" variant="text" class="ml-1"
                  color="primary"></v-btn>
              </template>
              <div class="pa-2">
                <div class="font-weight-bold mb-1">User guide</div>
                <p class="text-caption mb-1">This panel will guide you step by step in the creation of your website.</p>
                <ul class="text-caption">
                  <li>The tasks are grouped by category</li>
                  <li>Complete the tasks in order for the best result</li>
                  <li>The action buttons are available once the prerequisites are completed</li>
                </ul>
              </div>
            </v-tooltip>
            <v-spacer></v-spacer>
            <v-chip :color="getProgressColor" class="ml-2">
              {{ completedTasks.length }}/{{ tasks.length }}
            </v-chip>
          </v-card-title>
          <div class="task-actions ml-2">
            <v-btn icon="mdi-minus" size="x-small" variant="text" @click="toggleMinimize" class="mr-1"></v-btn>
            <v-btn icon="mdi-close" size="x-small" variant="text" @click="hideCard"></v-btn>
          </div>
        </div>

        <v-divider class="my-2"></v-divider>

        <v-expand-transition>
          <div v-if="!isMinimized">
            <v-card-text class="pt-2 pb-0">
              <v-alert v-if="!completedAllTasks" type="info" variant="tonal" density="compact" class="mb-2">
                <div class="d-flex align-center">
                  <div>
                    <div class="font-weight-medium">Next recommended task :</div>
                    <div class="text-body-2">{{ getNextRecommendedTask.title }}</div>
                  </div>
                </div>
              </v-alert>
            </v-card-text>

            <v-card-text class="pt-2 pb-2">
              <v-list>
                <v-list-group v-for="(group, groupIndex) in taskGroups" :key="groupIndex"
                  :model-value="openedGroup === groupIndex" @update:model-value="toggleGroup(groupIndex)">
                  <template v-slot:activator="{ props }">
                    <v-list-item v-bind="props" :title="group.title" :prepend-icon="group.icon" :color="group.color">
                      <template v-slot:append>
                        <v-chip size="small" :color="getGroupProgressColor(group.tasks)" class="mr-3">
                          {{ getCompletedGroupTasks(group.tasks) }}/{{ group.tasks.length }}
                        </v-chip>
                        <v-icon size="small" class="expand-icon">mdi-chevron-down</v-icon>
                      </template>
                    </v-list-item>
                  </template>

                  <v-list-item v-for="(task, index) in group.tasks" :key="task.id" :class="{
                    'completed-task': completedTasks.includes(task.id),
                    'current-task': isCurrentRecommendedTask(task.id),
                    'locked-task': task.requiresPrevious && !isPreviousCompleted(getGlobalTaskIndex(group, task))
                  }">
                    <template v-slot:prepend>
                      <v-checkbox v-model="completedTasks" :value="task.id" :color="task.color || 'primary'"
                        hide-details @update:model-value="updateTaskStatus(task.id)"></v-checkbox>
                    </template>

                    <v-list-item-title :class="{ 'text-decoration-line-through': completedTasks.includes(task.id) }">
                      {{ task.title }}
                      <v-icon v-if="isCurrentRecommendedTask(task.id)" color="info" size="x-small"
                        class="ml-1">mdi-star</v-icon>
                    </v-list-item-title>

                    <v-list-item-subtitle v-if="task.description">
                      {{ task.description }}
                    </v-list-item-subtitle>

                    <template v-slot:append>
                      <div class="d-flex align-center">
                        <v-tooltip location="top"
                          v-if="task.requiresPrevious && !isPreviousCompleted(getGlobalTaskIndex(group, task))">
                          <template v-slot:activator="{ props }">
                            <v-icon v-bind="props" size="small" color="grey" class="mr-2">mdi-lock</v-icon>
                          </template>
                          <span>Complete the previous tasks first</span>
                        </v-tooltip>
                        <v-btn variant="text" size="small" density="compact" :to="task.link"
                          :disabled="task.requiresPrevious && !isPreviousCompleted(getGlobalTaskIndex(group, task))"
                          color="primary">
                          <v-icon size="small">mdi-arrow-right</v-icon>
                          <v-tooltip activator="parent" location="top">
                            <span>Access to {{ getTaskDestinationName(task.link) }}</span>
                          </v-tooltip>
                        </v-btn>
                      </div>
                    </template>
                  </v-list-item>
                </v-list-group>
              </v-list>
            </v-card-text>

            <v-divider v-if="completedAllTasks" class="my-2"></v-divider>

            <v-card-actions v-if="completedAllTasks">
              <v-btn block color="success">
                You can now publish your website
                <v-icon class="ml-2">mdi-check-circle</v-icon>
              </v-btn>
            </v-card-actions>
          </div>
        </v-expand-transition>
      </v-card>
    </v-fade-transition>

    <v-btn v-if="!isVisible" icon="mdi-lightbulb-on-outline" color="secondary" size="large" class="show-tasks-btn"
      elevation="8" @click="showCard">
      <template v-slot:append>
        <div class="pulse-effect"></div>
      </template>
    </v-btn>

    <snackBar v-model="snackbar" :text="snackbarText" :color="snackbarColor" :timeout="3000" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import snackBar from '../components/snackbar.vue';
import { useUserStore } from '../stores/userStore';

const userStore = useUserStore();
const router = useRouter();
const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');

const isVisible = ref(true);
const isMinimized = ref(false);

const hideCard = () => {
  isVisible.value = false;
  localStorage.setItem('taskCardHidden', 'true');
};

const showCard = () => {
  isVisible.value = true;
  localStorage.setItem('taskCardHidden', 'false');
};

const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value;
  localStorage.setItem('taskCardMinimized', isMinimized.value.toString());
};

onMounted(() => {
  const hidden = localStorage.getItem('taskCardHidden');
  const minimized = localStorage.getItem('taskCardMinimized');

  if (hidden === 'true') {
    isVisible.value = false;
  }

  if (minimized === 'true') {
    isMinimized.value = true;
  }

  // Initialiser l'état du groupe ouvert
  const savedOpenedGroup = localStorage.getItem('openedGroup');
  if (savedOpenedGroup && savedOpenedGroup !== '') {
    openedGroup.value = parseInt(savedOpenedGroup);
  }
});

const taskGroups = ref([
  {
    title: 'Design & UI',
    icon: 'mdi-palette',
    color: 'primary',
    tasks: [
      {
        id: 1,
        title: 'Create the UI interface',
        description: 'Create the basic UI components for your application',
        color: 'primary',
        link: '/studio',
        completed: false,
        requiresPrevious: false
      },
      {
        id: 2,
        title: 'Test the responsive of your application',
        description: 'Test the responsive of your application',
        color: 'info',
        link: '/responsive',
        completed: false,
        requiresPrevious: true
      }
    ]
  },
  {
    title: 'Data Storage',
    icon: 'mdi-database',
    color: 'success',
    tasks: [
      {
        id: 3,
        title: 'Create the database',
        description: 'Create the database and the models to store your data',
        color: 'success',
        link: '/database-designer',
        completed: false,
        requiresPrevious: true
      },
      {
        id: 4,
        title: 'Test your API',
        description: 'Test your API to ensure it is working correctly',
        color: 'success',
        link: '/api-testing-hub',
        completed: false,
        requiresPrevious: true
      }
    ]
  },
  {
    title: 'User Experience',
    icon: 'mdi-account-check',
    color: 'orange',
    tasks: [
      {
        id: 5,
        title: 'Check the accessibility and the structure of your application',
        description: 'Check the accessibility and the structure of your application',
        color: 'orange',
        link: '/accessibility',
        completed: false,
        requiresPrevious: false
      },
      {
        id: 6,
        title: 'Check the semantic and metadata of your application',
        description: 'Check the semantic and metadata of your application',
        color: 'orange',
        link: '/semantic',
        completed: false,
        requiresPrevious: true
      }
    ]
  },
  {
    title: 'SEO & Optimization',
    icon: 'mdi-search-web',
    color: 'warning',
    tasks: [
      {
        id: 7,
        title: 'Audit the performance of your application',
        description: 'Audit the performance of your application',
        color: 'warning',
        link: '/website-analyzer',
        completed: false,
        requiresPrevious: true
      },
      {
        id: 8,
        title: 'Use the robots generator for your application',
        description: 'Use the robots generator for your application',
        color: 'deep-purple',
        link: '/robots',
        completed: false,
        requiresPrevious: true
      }
    ]
  }
]);

const tasks = computed(() => {
  return taskGroups.value.flatMap(group => group.tasks);
});

const savedTasks = localStorage.getItem('completedTasks');
const completedTasks = ref(savedTasks ? JSON.parse(savedTasks) : []);

const updateTaskStatus = (taskId) => {
  localStorage.setItem('completedTasks', JSON.stringify(completedTasks.value));

  if (completedAllTasks.value) {
    snackbar.value = true;
    snackbarText.value = 'All tasks completed !';
    snackbarColor.value = 'success';
  }
};

const getGlobalTaskIndex = (group, task) => {
  let index = 0;
  for (const g of taskGroups.value) {
    if (g === group) {
      return index + g.tasks.indexOf(task);
    }
    index += g.tasks.length;
  }
  return -1;
};

const isPreviousCompleted = (index) => {
  if (index === 0) return true;
  const allTasks = tasks.value;
  const previousTask = allTasks[index - 1];
  return completedTasks.value.includes(previousTask.id);
};

const getCompletedGroupTasks = (groupTasks) => {
  return groupTasks.filter(task => completedTasks.value.includes(task.id)).length;
};

const getGroupProgressColor = (groupTasks) => {
  const progress = getCompletedGroupTasks(groupTasks) / groupTasks.length;
  if (progress === 1) return 'success';
  if (progress >= 0.7) return 'info';
  if (progress >= 0.3) return 'warning';
  return 'error';
};

const completedAllTasks = computed(() => {
  return completedTasks.value.length === tasks.value.length;
});

const getProgressColor = computed(() => {
  const progress = completedTasks.value.length / tasks.value.length;
  if (progress === 1) return 'success';
  if (progress >= 0.7) return 'info';
  if (progress >= 0.3) return 'warning';
  return 'error';
});

const openedGroup = ref<number | null>(null);

const toggleGroup = (groupIndex: number): void => {
  if (openedGroup.value === groupIndex) {
    openedGroup.value = null;
  } else {
    openedGroup.value = groupIndex;
  }

  localStorage.setItem('openedGroup', openedGroup.value !== null ? openedGroup.value.toString() : '');
};

const getNextRecommendedTask = computed(() => {
  for (const group of taskGroups.value) {
    for (const task of group.tasks) {
      if (!completedTasks.value.includes(task.id)) {
        const taskIndex = getGlobalTaskIndex(group, task);
        if (!task.requiresPrevious || isPreviousCompleted(taskIndex)) {
          return task;
        }
      }
    }
  }

  return tasks.value[tasks.value.length - 1];
});

const isCurrentRecommendedTask = (taskId) => {
  return getNextRecommendedTask.value.id === taskId;
};

const getTaskDestinationName = (link) => {
  const destinations = {
    '/studio': 'Studio of design',
    '/responsive': 'Test of responsive',
    '/database-designer': 'Database designer',
    '/api-testing-hub': 'API testing hub',
    '/accessibility': 'Accessibility check',
    '/semantic': 'Semantic check',
    '/website-analyzer': 'Website analyzer',
    '/robots': 'Robots generator',
  };

  return destinations[link] || link;
};
</script>

<style scoped>
.task-card {
  transition: all 0.3s ease;
  border-left: 4px solid var(--v-theme-primary);
  position: fixed;
  z-index: 1000;
  bottom: 20px;
  right: 20px;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  background-color: rgba(var(--v-theme-surface), 0.95) !important;
  background: radial-gradient(circle at 30% 30%, rgba(173, 199, 255, 0.12), transparent 40%),
    radial-gradient(circle at 70% 70%, rgba(125, 208, 255, 0.12), transparent 35%);
  backdrop-filter: blur(10px);
}

.text-gradient {
  background: linear-gradient(90deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-info)));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 0.65rem;
  letter-spacing: 0.5px;
}

.minimized {
  max-height: 60px;
  overflow: hidden;
}

.task-actions {
  display: flex;
  align-items: center;
}

.task-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.completed-task {
  background-color: rgba(var(--v-theme-success), 0.05);
}

.v-list-item {
  border-radius: 8px;
  margin-bottom: 4px;
  transition: all 0.3s ease;
  padding: 4px 8px;
}

.v-list-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.v-list-group__items .v-list-item {
  padding-left: 16px;
  margin-left: 8px;
  border-left: 2px dashed rgba(var(--v-theme-primary), 0.2);
}

.v-list-group__items .completed-task {
  border-left: 2px solid rgba(var(--v-theme-success), 0.3);
}

.show-tasks-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

}

.show-tasks-btn:hover {
  transform: scale(1.01);
  box-shadow: 0 6px 16px rgba(var(--v-theme-primary), 0.4);
}


.pulse-effect {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: var(--v-theme-error);
  box-shadow: 0 0 8px var(--v-theme-error);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  70% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: scale(0.8);
    opacity: 1;
  }
}

.v-list-group--active>.v-list-group__activator .v-list-item {
  background: rgba(var(--v-theme-primary), 0.05);
}

.v-list-group--active .expand-icon {
  transform: rotate(180deg);
}

.expand-icon {
  transition: transform 0.3s ease;
}

.v-list-group__activator {
  cursor: pointer;
}

.current-task {
  background-color: rgba(var(--v-theme-primary), 0.08);
  border-right: 3px solid var(--v-theme-info);
  position: relative;
}

.current-task::before {
  content: '';
  position: absolute;
  left: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 6px solid var(--v-theme-info);
  opacity: 0.7;
}

.locked-task {
  opacity: 0.7;
  background-color: rgba(var(--v-theme-surface-variant), 0.3);
}
</style>
