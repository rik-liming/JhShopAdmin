<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import adminDashboard from './admin';
import editorDashboard from './editor';

export default defineComponent({
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    };
  },
  computed: {
  },
  created() {
    console.log('dashboard created');
    this.currentRole = 'adminDashboard';
  }
});
</script>
