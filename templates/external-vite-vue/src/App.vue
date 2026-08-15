<script setup lang="ts">
import {
  AppShell,
  Card,
  Navigation,
  NavigationBar,
  ThemeProvider,
  ToastProvider,
  useTabStacks,
} from '@chameleon-ui/vue'
import Home from './Home.vue'

const tabs = [
  { value: 'home', title: 'Home' },
  { value: 'inbox', title: 'Inbox' },
]

const stacks = useTabStacks(tabs)
const navItems = tabs.map((item) => ({ value: item.value, label: item.title }))
</script>

<template>
  <ThemeProvider theme="line" locale="zh-CN">
    <ToastProvider>
      <AppShell>
        <template #header>
          <NavigationBar
            :title="stacks.current.title"
            :back-label="stacks.previous?.title"
            :on-back="stacks.canPop ? stacks.pop : undefined"
          />
        </template>
        <template #navigation>
          <Navigation
            label="Main"
            :items="navItems"
            :active-value="stacks.tab"
            @select="stacks.selectTab"
          />
        </template>
        <Card v-if="stacks.current.id === 'detail'">Pushed screen. Back pops this tab stack.</Card>
        <Card v-else-if="stacks.tab === 'inbox'">Switching tabs does not push.</Card>
        <Home v-else @open="stacks.push({ id: 'detail', title: 'Detail' })" />
      </AppShell>
    </ToastProvider>
  </ThemeProvider>
</template>
