<template>
  <div class="signup-page full-bleed-page">
    <div class="background-overlay"></div>

    <div class="signup-container glass">
      <!-- LEVA STRANA: BRANDING (ИДЕНТИЧНО КАКО LOGIN И FORGOT) -->
      <div class="branding">
        <div class="logo-wrapper">
          <img src="/src/img/logo.png" alt="Altigo Logo" class="logo-forgot" />
        </div>
        <h1 class="logo-text">ALTIGO</h1>
        <p class="tagline">
          „Секој може да се изгуби, но вистинските планинари секогаш го наоѓаат патот назад. Креирај профил и започни ја твојата следна авантура!“ 🧭✨
        </p>
      </div>

      <!-- DESNA STRANA: SIGNUP FORMA -->
      <div class="signup-card-content">
        <h2>Креирај профил</h2>
        <p class="subtitle">Приклучи се на заедницата и започни со твојата планинарска авантура.</p>

        <form @submit.prevent="onSignup" class="signup-form">
          <div class="input-group">
            <label>Име и презиме</label>
            <input
                v-model="name"
                type="text"
                placeholder="Внеси го твоето ime"
                class="styled-input"
                required
            />
          </div>

          <div class="input-group">
            <label>Е-пошта</label>
            <input
                v-model="email"
                type="email"
                placeholder="Внеси ја твојата е-пошта"
                class="styled-input"
                required
            />
          </div>

          <div class="input-group">
            <label>Лозинка</label>
            <div class="password-wrapper">
              <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Минимум 6 карактери"
                  class="styled-input password-input"
                  required
              />
              <button
                  type="button"
                  class="toggle-password"
                  @click="showPassword = !showPassword"
              >
                {{ showPassword ? 'Скриј' : 'Прикажи' }}
              </button>
            </div>
          </div>

          <div class="input-group">
            <label>Потврди лозинка</label>
            <div class="password-wrapper">
              <input
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Внеси ја лозинката повторно"
                  class="styled-input password-input"
                  required
              />
              <button
                  type="button"
                  class="toggle-password"
                  @click="showConfirmPassword = !showConfirmPassword"
              >
                {{ showConfirmPassword ? 'Скриј' : 'Прикажи' }}
              </button>
            </div>
          </div>

          <button type="submit" class="signup-btn">
            РЕГИСТРИРАЈ СЕ ➔
          </button>

          <p class="login-text">
            Веќе имаш профил?
            <RouterLink to="/login" class="login-link">
              Најави се тука
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
import { logoutUser, registerUser } from '../services/storage'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const showPassword = ref(false)
const showConfirmPassword = ref(false)

function onSignup() {
  if (password.value !== confirmPassword.value) {
    alert('Лозинките не се совпаѓаат!')
    return
  }

  if (password.value.length < 6) {
    alert('Лозинката мора да биде долга најмалку 6 карактери.')
    return
  }

  logoutUser()
  const result = registerUser({
    name: name.value,
    email: email.value,
    password: password.value
  })

  if (result.error === 'exists') {
    alert('Овој е-пошта веќе има профил. Најави се наместо да креираш нов профил.')
    return
  }

  alert('Успешна регистрација! Сега можете да се најавите.');
  router.push('/login')
}
</script>

<style scoped>
/* ГЛОБАЛНИ И GLASS СТИЛОВИ */
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

.signup-container {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  width: 100%;
  max-width: 960px;
  min-height: 580px;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(242, 101, 34, 0.1);
}

/* БРЕНДИРАЊЕ (ЛЕВА СТРАНА) */
.branding {
  background: radial-gradient(circle at center, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.9));
  padding: 6.2rem;
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

/* ФОРМА (ДЕСНА СТРАНА) */
.signup-card-content {
  padding: 4rem 3rem;
  display: flex;
  margin-left: -50px;
  flex-direction: column;
  justify-content: center;
  background: rgba(15, 23, 42, 0.45);
}

.signup-card-content h2 {
  font-size: 1.7rem;
  font-weight: 800;
  margin: 0 0 0.2rem 0;
  color: white;
}

.subtitle {
  color: #94a3b8;
  font-size: 0.95rem;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
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

/* КРИЕЊЕ/ПРИКАЖУВАЊЕ ЛОЗИНКА */
.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input {
  width: 100%;
  padding-right: 2.5rem !important;
}

.toggle-password {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  color: #94a3b8;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ИНПУТИ И КОПЧИЊА */
.styled-input {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.75rem 1rem;
  border-radius: 12px;
  color: white;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;
}

.styled-input:focus {
  border-color: #f26522;
  box-shadow: 0 0 10px rgba(242, 101, 34, 0.2);
  background: rgba(15, 23, 42, 0.8);
}

.signup-btn {
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
  margin-top: 0.3rem;
}

.signup-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(242, 101, 34, 0.5);
}

.login-text {
  text-align: center;
  font-size: 0.9rem;
  color: #94a3b8;
  margin: 0.5rem 0 0 0;
}

.login-link {
  color: #ff8c52;
  text-decoration: none;
  font-weight: 700;
  margin-left: 0.25rem;
}

.login-link:hover {
  color: #f26522;
}

/* РЕСПОНЗИВНОСТ */
@media (max-width: 768px) {
  .signup-container {
    grid-template-columns: 1fr;
    max-width: 450px;
    min-height: auto;
  }
  .branding {
    display: none;
  }
}
</style>