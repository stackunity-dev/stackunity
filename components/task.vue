<template>
  <div>
    <v-fade-transition>
      <v-card v-if="isVisible" class="rounded-lg pa-4 task-card" :class="{ 'minimized': isMinimized }">
        <div class="d-flex align-center mb-2">
          <v-card-title class="d-flex align-center px-0 py-1">
            <v-icon color="primary" class="mr-2">mdi-lightbulb-on-outline</v-icon>
            <span class="text-h6 text-gradient">Créez votre site web</span>
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
            <v-card-text class="pt-2 pb-2">
              <v-list>
                <v-list-item v-for="(task, index) in tasks" :key="index"
                  :class="{ 'completed-task': completedTasks.includes(task.id) }">
                  <template v-slot:prepend>
                    <v-checkbox v-model="completedTasks" :value="task.id" :color="task.color || 'primary'" hide-details
                      @update:model-value="updateTaskStatus(task.id)"></v-checkbox>
                  </template>

                  <v-list-item-title :class="{ 'text-decoration-line-through': completedTasks.includes(task.id) }">
                    {{ task.title }}
                  </v-list-item-title>

                  <v-list-item-subtitle v-if="task.description">
                    {{ task.description }}
                  </v-list-item-subtitle>

                  <template v-slot:append v-if="task.link">
                    <v-btn variant="text" size="small" density="compact" :to="task.link"
                      :disabled="task.requiresPrevious && !isPreviousCompleted(index)" color="primary">
                      <v-icon size="small">mdi-arrow-right</v-icon>
                    </v-btn>
                  </template>
                </v-list-item>
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

    <v-btn v-if="!isVisible" icon="mdi-lightbulb-on-outline" color="primary" size="large" class="show-tasks-btn"
      @click="showCard">
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
});

const tasks = ref([
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
  },
  {
    id: 3,
    title: 'Create the database',
    description: 'Create the database and the models to store your data',
    color: 'success',
    link: '/sql-generator',
    completed: false,
    requiresPrevious: true
  },
  {
    id: 4,
    title: 'Check the accessibility of your application',
    description: 'Check the accessibility of your application',
    color: 'orange',
    link: '/accessibility',
    completed: false,
    requiresPrevious: false
  },
  {
    id: 5,
    title: 'Audit the SEO of your application',
    description: 'Audit the SEO of your application',
    color: 'warning',
    link: '/seo-audit',
    completed: false,
    requiresPrevious: true
  },
  {
    id: 6,
    title: 'Use the robots generator for your application',
    description: 'Use the robots generator for your application',
    color: 'deep-purple',
    link: '/robots',
    completed: false,
    requiresPrevious: true
  }
]);

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

const isPreviousCompleted = (index) => {
  if (index === 0) return true;
  const previousTask = tasks.value[index - 1];
  return completedTasks.value.includes(previousTask.id);
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

const finishOnboarding = () => {
  userStore.updateUserField('onboardingCompleted', true);
  router.push('/deploy');
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

.show-tasks-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 50%;
}

.show-tasks-btn:hover {
  transform: scale(1.1);
}
</style>
