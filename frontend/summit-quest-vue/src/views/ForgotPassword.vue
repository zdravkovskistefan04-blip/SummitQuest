<template>
  <div class="forgot-page full-bleed-page">
    <div class="background-overlay"></div>

    <div class="forgot-container glass">
      <div class="branding">
        <div class="logo-wrapper">
          <img src="/src/img/logo.png" alt="Altigo Logo" class="logo-forgot" />
        </div>
        <h1 class="logo-text">ALTIGO</h1>
        <p class="tagline">
          „Секој може да се изгуби, но вистинските планинари секогаш го наоѓаат патот назад. Внеси ја твојата е-пошта и ќе ти помогнеме да се вратиш на патеката!“ 🧭✨
        </p>
      </div>

      <div class="forgot-card-content">
        <h2>Ја заборави лозинката?</h2>
        <p class="subtitle">Без грижи. Внеси ја е-поштата за да ти пратиме линк за ресетирање.</p>

        <form @submit.prevent="onReset" class="forgot-form">
          <div class="input-group">
            <label>Е-пошта</label>
            <input
                v-model="email"
                type="email"
                placeholder="Внеси ја регистрираната е-пошта"
                class="styled-input"
                required
            />
          </div>

          <button type="submit" class="reset-btn">
            ИСПРАТИ ЛИНК ✉️
          </button>

          <p class="back-text">
            Се сетив на лозинката?
            <RouterLink to="/login" class="back-link">
              Назад кон Најава
            </RouterLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')

function onReset() {
  const savedUser = JSON.parse(localStorage.getItem('altigoUser'))

  // Проверка за тест профилот или за зачуваниот
  if (email.value === 'leontina@finki.ukim.mk' || (savedUser && email.value === savedUser.email)) {
    alert(`Успешно! Испратен е линк за ресетирање на лозинката на: ${email.value}`)
    router.push('/login')
  } else {
    alert('Оваа е-пошта не е пронајдена во системот.')
  }
}
</script>

<style scoped>
.full-bleed-page {
  min-height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  background: radial-gradient(circle at center, #1e1b4b, #090514);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
  box-sizing: border-box;
  padding: 1rem;
}

.glass {
  background: rgba(30, 41, 59, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.forgot-container {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  width: 100%;
  max-width: 960px;
  min-height: 500px;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(242, 101, 34, 0.1);
}

.branding {
  background: radial-gradient(circle at center, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.9));
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.logo-wrapper {
  background: rgba(242, 101, 34, 0.1);
  padding: 1.5rem;
  border-radius: 30px;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(242, 101, 34, 0.2);
  box-shadow: 0 0 30px rgba(242, 101, 34, 0.15);
}

.logo-forgot {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.logo-text {
  font-size: 3rem;
  font-weight: 900;
  letter-spacing: 5px;
  background: linear-gradient(135deg, #ff8c52, #f26522);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 1.5rem 0;
}

.tagline {
  color: #e2e8f0;
  font-size: 1.15rem;
  line-height: 1.7;
  max-width: 365px;
  font-style: italic;
  font-weight: 500;
  text-shadow: 0 2px 10px rgba(0,0,0,0.5);
}

.forgot-card-content {
  padding: 3.5rem 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: rgba(15, 23, 42, 0.45);
}

.forgot-card-content h2 {
  font-size: 1.7rem;
  font-weight: 800;
  margin: 0 0 0.4rem 0;
  color: white;
}

.subtitle {
  color: #94a3b8;
  font-size: 0.95rem;
  margin: 0 0 2rem 0;
  line-height: 1.5;
}

.forgot-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.input-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #94a3b8;
}

.styled-input {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.8rem 1rem;
  border-radius: 12px;
  color: white;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s;
}

.styled-input:focus {
  border-color: #f26522;
  box-shadow: 0 0 10px rgba(242, 101, 34, 0.2);
  background: rgba(15, 23, 42, 0.8);
}

.reset-btn {
  background: linear-gradient(135deg, #f26522, #ff8c52);
  color: white;
  border: none;
  padding: 0.9rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(242, 101, 34, 0.35);
}

.reset-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(242, 101, 34, 0.5);
}

.back-text {
  text-align: center;
  font-size: 0.9rem;
  color: #94a3b8;
  margin: 1rem 0 0 0;
}

.back-link {
  color: #ff8c52;
  text-decoration: none;
  font-weight: 700;
  margin-left: 0.25rem;
}

.back-link:hover {
  color: #f26522;
}

@media (max-width: 768px) {
  .forgot-container {
    grid-template-columns: 1fr;
    max-width: 450px;
    min-height: auto;
  }
  .branding {
    display: none;
  }
}
</style>