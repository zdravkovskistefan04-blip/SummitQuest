<template>
  <section class="screen community-bg community-page">

    <h1>Community</h1>

    <!-- MATCHING SYSTEM -->
    <section class="glass">
      <TrailMatching />
    </section>

    <!-- VIBE CHECK -->
    <section class="glass">
      <VibeCheck :trail-id="1" />
    </section>

  </section>
</template>

<script setup>
import TrailMatching from '../components/TrailMatching.vue'
import VibeCheck from '../components/VibeCheck.vue'
</script>
