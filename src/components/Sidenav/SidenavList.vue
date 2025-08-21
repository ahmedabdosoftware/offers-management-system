<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

import SidenavItem from "./SidenavItem.vue";

const store = useStore();
const isRTL = computed(() => store.state.isRTL);

const getRoute = () => {
  const route = useRoute();
  const routeArr = route.path.split("/");
  return routeArr[1];
};
</script>

<template>
  <div
    class="collapse navbar-collapse w-auto h-auto h-100"
    id="sidenav-collapse-main"
  >
    <ul class="navbar-nav">
      <!-- Offers -->
      <li class="nav-item">
        <sidenav-item
          to="/Offers"
          :class="getRoute() === 'Offers' ? 'active' : ''"
          :navText="isRTL ? 'العروض' : 'offers'"
        >
         <template v-slot:icon>
            <i class="fas fa-gift text-danger text-sm opacity-100"></i>
          </template>
        </sidenav-item>
      </li>
    </ul>
  </div>
</template>
