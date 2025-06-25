<template>
  <div class="vote-page">
    <div class="vote-container">
      <div class="page-header">
        <h1 class="page-title">Cast Your Vote</h1>
        <p class="page-description">Election ID: {{ $route.params.id }}</p>
      </div>
      
      <div class="coming-soon">
        <div class="coming-soon-card">
          <svg class="coming-soon-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <h2>Voting Interface</h2>
          <p>The secure voting interface will be implemented here with blockchain integration.</p>
          <router-link to="/elections" class="btn btn-primary">
            Back to Elections
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Vote component functionality will be implemented here
</script>

<style scoped>
.vote-page {
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 3rem 1rem;
}

.vote-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.page-description {
  color: #6b7280;
}

.coming-soon {
  display: flex;
  justify-content: center;
  padding: 3rem;
}

.coming-soon-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  text-align: center;
  max-width: 24rem;
  border: 1px solid #e5e7eb;
}

.coming-soon-icon {
  width: 4rem;
  height: 4rem;
  color: #6b7280;
  margin: 0 auto 1rem auto;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  text-align: center;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
}

.btn-primary:hover {
  background-color: #1d4ed8;
}
</style>
