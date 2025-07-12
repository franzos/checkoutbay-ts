<template>
  <n-config-provider :theme="theme">
    <n-message-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <n-loading-bar-provider>
            <n-layout position="absolute">
              <n-layout-header bordered>
                <div class="header-content">
                  <div class="header-left">
                    <n-h3 style="margin: 0">{{ shopStore.shopName }}</n-h3>
                  </div>
                  <div class="header-right">
                    <n-space align="center" :size="16">
                      <cart-icon />
                      <n-tooltip trigger="hover">
                        <template #trigger>
                          <n-button
                            circle
                            secondary
                            :loading="isThemeChanging"
                            @click="toggleTheme"
                          >
                            <template #icon>
                              <n-icon>
                                <sun v-if="isDarkTheme" />
                                <moon v-else />
                              </n-icon>
                            </template>
                          </n-button>
                        </template>
                        {{
                          isDarkTheme
                            ? "Switch to Light Mode"
                            : "Switch to Dark Mode"
                        }}
                      </n-tooltip>
                    </n-space>
                  </div>
                </div>
              </n-layout-header>
              <n-layout-content>
                <router-view v-slot="{ Component }">
                  <transition
                    name="page"
                    mode="out-in"
                    :duration="UI_CONSTANTS.ANIMATION_DURATION"
                  >
                    <component :is="Component" />
                  </transition>
                </router-view>
              </n-layout-content>
            </n-layout>
          </n-loading-bar-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import {
  NConfigProvider,
  NMessageProvider,
  NDialogProvider,
  NNotificationProvider,
  NLoadingBarProvider,
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NButton,
  NSpace,
  NTooltip,
  NIcon,
  NH3,
  darkTheme,
  lightTheme,
  useOsTheme,
} from "naive-ui";
import { Sun, Moon } from "lucide-vue-next";
import { computed, ref } from "vue";
import { UI_CONSTANTS } from "./utils/ui";
import { useShopStore } from "./stores/shop";
import CartIcon from "./components/common/CartIcon.vue";

const shopStore = useShopStore();

shopStore.fetchShopDetails();

// Theme handling with OS preference sync
const osTheme = useOsTheme();
const storedTheme = ref<"light" | "dark" | null>(
  localStorage.getItem("theme") as "light" | "dark" | null
);

const isDarkTheme = computed(() => {
  if (storedTheme.value !== null) {
    return storedTheme.value === "dark";
  }
  return osTheme.value === "dark";
});

const theme = computed(() => isDarkTheme.value ? darkTheme : lightTheme);

const isThemeChanging = ref(false);

const toggleTheme = async () => {
  if (isThemeChanging.value) return;
  isThemeChanging.value = true;

  const newTheme = isDarkTheme.value ? "light" : "dark";
  storedTheme.value = newTheme;
  localStorage.setItem("theme", newTheme);

  // Prevent rapid toggling
  await new Promise((resolve) =>
    setTimeout(resolve, UI_CONSTANTS.ANIMATION_DURATION)
  );
  isThemeChanging.value = false;
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  transition: background-color 0.3s ease;
}

#app {
  height: 100%;
  transition: background-color 0.3s ease;
}

:root {
  --max-width: v-bind('UI_CONSTANTS.MAX_WIDTH.xl');
  --spacing-sm: v-bind('UI_CONSTANTS.SPACING.sm');
  --spacing-xl: v-bind('UI_CONSTANTS.SPACING.xl');
  --animation-duration: v-bind('UI_CONSTANTS.ANIMATION_DURATION + "ms"');
  --transition-timing: v-bind('UI_CONSTANTS.TRANSITION_TIMING');
}

.header-content {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--spacing-sm) var(--spacing-xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: all var(--animation-duration) var(--transition-timing);
}

.page-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
