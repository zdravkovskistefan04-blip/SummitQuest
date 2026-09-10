<template>
  <div class="profile-page full-bleed-page">

    <!-- SIDEBAR -->
    <aside class="sidebar glass">
      <div class="logo-area">
        <h2 class="logo-text">ALTIGO</h2>
      </div>

      <nav class="nav-menu">
        <router-link
            v-for="item in menuItems"
            :key="item.id"
            :to="`/${item.id}`"
            class="nav-item"
            :class="{ active: currentPage === item.id }"
        >
          <span class="icon">{{ item.icon }}</span>
          <span class="label">{{ item.label }}</span>
        </router-link>
      </nav>
    </aside>

    <!-- MAIN -->
    <main class="content">

      <!-- HEADER -->
      <section class="top-card glass">
        <div class="left">
          <h3>Мој Профил</h3>
          <p>Менаџирај ги твоите информации и планинарски авантури</p>
        </div>

        <div class="header-actions">
          <!-- Edit / Save копчиња -->
          <button class="cta-btn" v-if="!isEditing" @click="editProfile">Уреди Профил</button>
          <div v-else class="edit-actions-group">
            <button class="cta-btn save-btn" @click="saveProfile">Зачувај</button>
            <button class="cancel-btn" @click="cancelEdit">Откажи</button>
          </div>

          <!-- Logout -->
          <button class="logout-btn" @click="logout">Одјава</button>
        </div>
      </section>

      <!-- USER INFO -->
      <section class="section">
        <div class="profile-card glass">
          <div class="avatar-container">
            <img v-if="user.avatar" class="profile-avatar" :src="user.avatar" alt="Профилна слика" />
            <div v-else class="profile-avatar avatar-placeholder" aria-label="Нема профилна слика">
              {{ avatarInitials }}
            </div>
          </div>

          <div class="details">
            <!-- VIEW MODE -->
            <div v-if="!isEditing" class="view-mode animate-fade">
              <h2>{{ user.name }}</h2>
              <p class="bio-text">{{ user.bio }}</p>
              <div class="meta-info">
                <p><span>Е-пошта:</span> {{ user.email }}</p>
                <p><span>Години:</span> {{ user.age }}</p>
              </div>
            </div>

            <!-- EDIT MODE -->
            <div v-else class="edit-form animate-fade">
              <div class="input-group">
                <label>Име и презиме:</label>
                <input v-model="form.name" placeholder="Внеси име..." class="styled-input" />
              </div>

              <div class="input-group">
                <label>Е-пошта:</label>
                <input v-model="form.email" placeholder="Внеси е-пошта..." class="styled-input" />
              </div>

              <div class="input-group">
                <label>Години:</label>
                <input v-model.number="form.age" type="number" min="13" max="120" placeholder="Внеси години..." class="styled-input" />
              </div>

              <div class="input-group">
                <label>Bio (Краток статус):</label>
                <textarea v-model="form.bio" placeholder="Кажи нешто за себе..." class="styled-textarea"></textarea>
              </div>

              <div class="input-group">
                <label class="file-upload-label">
                  Промени аватар
                  <input type="file" accept="image/*" @change="onAvatarChange" class="hidden-file-input" />
                </label>
                <button v-if="form.avatar" type="button" class="remove-avatar-btn" @click="removeAvatar">
                  Отстрани ја сликата
                </button>
                <small v-if="avatarError" class="avatar-error">{{ avatarError }}</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- STATS -->
      <section class="section">
        <div class="section-header">
          <h3>Статистика</h3>
        </div>
        <div class="stats-grid">
          <div class="stat-card glass">
            <div class="stat-icon" aria-hidden="true"></div>
            <div class="stat-data">
              <h4>Поминати патеки</h4>
              <p>{{ trailStats.completedCount }}</p>
            </div>
          </div>
          <div class="stat-card glass">
            <div class="stat-icon" aria-hidden="true"></div>
            <div class="stat-data">
              <h4>Поминато вкупно</h4>
              <p>{{ trailStats.totalDistanceKm }} km</p>
            </div>
          </div>
          <div class="stat-card glass">
            <div class="stat-icon" aria-hidden="true"></div>
            <div class="stat-data">
              <h4>Споделени објави</h4>
              <p>{{ user.postsShared }}</p>
            </div>
          </div>
          <div class="stat-card glass">
            <div class="stat-icon" aria-hidden="true"></div>
            <div class="stat-data">
              <h4>Добиени лајкови</h4>
              <p>{{ user.likesReceived }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- COMPLETED TRAILS -->
      <section class="section">
        <div class="section-header">
          <h3>Освоени врвови и патеки</h3>
        </div>

        <div v-if="completedTrails.length > 0" class="completed-grid">
          <div
              v-for="trail in completedTrails"
              :key="trail.id"
              class="completed-card glass"
          >
            <div class="img-container">
              <img :src="trail.image || fallbackImage" alt="Фотографија од патека" @error="handleImageError" />
            </div>
            <div class="completed-card-content">
              <h4>{{ trail.name }}</h4>
              <span class="distance-badge">{{ trail.distance }}</span>
            </div>
          </div>
        </div>
        <div v-else class="no-trails glass">
          <p>Сè уште немаш означено поминати патеки. Започни ја твојата авантура во секцијата Explore.</p>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { loadData, saveData } from '../services/storage'
import { calculateTrailStats } from '../services/trailStats'
import profilePhoto from '../img/profile-photo.jpg'

const router = useRouter()
const currentPage = ref('profile')

const menuItems = [
  { id: 'home', label: 'Почетна', icon: '🏠' },
  { id: 'explore', label: 'Истражи', icon: '🧭' },
  { id: 'map', label: 'Мапа', icon: '🗺️' },
  { id: 'social', label: 'Заедница', icon: '💬' },
  { id: 'profile', label: 'Профил', icon: '👤' }
]

const savedUser = JSON.parse(localStorage.getItem('altigoUser'))

// Почетни вредности прилагодени со твојот профил
const user = ref({
  name: savedUser?.name || 'Leontina',
  email: savedUser?.email || 'leontina@finki.ukim.mk',
  age: savedUser?.age || 25,
  bio: savedUser?.bio || 'Страствен планинар и заљубеник во природни убавини.',
  avatar: savedUser?.avatar || profilePhoto,
  postsShared: savedUser?.postsShared || 8,
  likesReceived: savedUser?.likesReceived || 124
})

const form = ref({ ...user.value })
const isEditing = ref(false)
const avatarError = ref('')
const avatarInitials = computed(() => {
  const name = user.value.name.trim()
  return name
    ? name.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase()
    : 'П'
})

const completedTrails = ref(loadData('completedTrails', []))
const trailStats = computed(() => calculateTrailStats(completedTrails.value))
const fallbackImage = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85'
const handleImageError = (event) => {
  if (event.target.src !== fallbackImage) event.target.src = fallbackImage
}

const logout = () => {
  if (confirm('Дали си сигурна дека сакаш да се одјавиш?')) {
    localStorage.removeItem('isLoggedIn')
    router.push('/login')
  }
}

const editProfile = () => {
  form.value = { ...user.value }
  avatarError.value = ''
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
  avatarError.value = ''
}

const saveProfile = () => {
  user.value = { ...user.value, ...form.value }
  localStorage.setItem('altigoUser', JSON.stringify(user.value))
  window.dispatchEvent(new Event('altigo-profile-updated'))
  isEditing.value = false
  alert('Профилот е успешно ажуриран!')
}

const onAvatarChange = (event) => {
  const file = event.target.files?.[0]
  avatarError.value = ''

  if (!file) return
  if (!file.type.startsWith('image/')) {
    avatarError.value = 'Избери валидна слика.'
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    avatarError.value = 'Сликата мора да биде помала од 5 MB.'
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    if (typeof reader.result === 'string') form.value.avatar = reader.result
  }
  reader.onerror = () => {
    avatarError.value = 'Сликата не може да се вчита. Обиди се повторно.'
  }
  reader.readAsDataURL(file)
}

const removeAvatar = () => {
  form.value.avatar = ''
  avatarError.value = ''
}
</script>

<style scoped>
/* СТРУКТУРА НА СТРАНИЦАТА */
.full-bleed-page {
  min-height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  background: radial-gradient(circle at top right, #0f172a, #050814);
  color: white;
  display: flex;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
}

.glass {
  background: rgba(30, 41, 59, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* SIDEBAR */
.sidebar {
  width: 260px;
  min-height: 100vh;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.logo-area { display: flex; align-items: center; gap: 0.75rem; }
.logo-text {
  font-size: 1.6rem;
  font-weight: 900;
  letter-spacing: 2px;
  background: linear-gradient(135deg, #ff8c52, #f26522);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.nav-menu { display: flex; flex-direction: column; gap: 0.5rem; }
.nav-item {
  display: flex; align-items: center; gap: 1rem; color: #94a3b8;
  text-decoration: none; padding: 0.85rem 1rem; border-radius: 12px;
  font-weight: 500; transition: all 0.2s;
}
.nav-item:hover, .nav-item.active { background: rgba(255, 255, 255, 0.06); color: white; }
.nav-item.active { border-left: 3px solid #f26522; background: rgba(242, 101, 34, 0.1); }
.nav-item .icon {
  width: 1.4rem;
  color: #c084fc;
  font-size: 1rem;
  text-align: center;
}

/* MAIN CONTENT */
.content {
  flex: 1;
  padding: 2rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

/* TOP CARD */
.top-card {
  padding: 1.8rem 2.2rem;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.top-card h3 { margin: 0 0 0.3rem 0; font-size: 1.6rem; font-weight: 800; }
.top-card p { margin: 0; color: #94a3b8; font-size: 0.95rem; }

.header-actions { display: flex; align-items: center; gap: 1rem; }
.edit-actions-group { display: flex; gap: 0.5rem; }

.cta-btn {
  background: #f26522; color: white; border: none; padding: 0.7rem 1.4rem;
  border-radius: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(242, 101, 34, 0.3);
}
.cta-btn:hover { background: #ff7637; transform: translateY(-1px); }
.save-btn { background: #10b981; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); }
.save-btn:hover { background: #34d399; }

.cancel-btn, .logout-btn {
  background: rgba(255, 255, 255, 0.06); color: white; border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.7rem 1.4rem; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s;
}
.cancel-btn:hover { background: rgba(239, 68, 68, 0.2); border-color: rgba(239, 68, 68, 0.4); }
.logout-btn:hover { background: rgba(239, 68, 68, 0.2); border-color: rgba(239, 68, 68, 0.4); color: #ef4444; }

/* USER INFO PROFILE CARD */
.profile-card {
  display: flex; gap: 2.5rem; padding: 2.5rem; border-radius: 24px; align-items: center;
}
.avatar-container { position: relative; }
.profile-avatar {
  width: 130px; height: 130px; border-radius: 50%; object-fit: cover; object-position: center 45%;
  border: 4px solid rgba(242, 101, 34, 0.5); box-shadow: 0 8px 25px rgba(0,0,0,0.4);
}
.avatar-placeholder {
  display: grid; place-items: center; background: linear-gradient(135deg, #f26522, #8b5cf6);
  color: white; font-size: 2.4rem; font-weight: 800;
}

.details { flex: 1; }
.view-mode h2 { margin: 0 0 0.5rem 0; font-size: 2rem; font-weight: 800; letter-spacing: -0.5px; }
.bio-text { margin: 0 0 1.2rem 0; color: #cbd5e1; font-size: 1.05rem; line-height: 1.5; }
.meta-info p { margin: 0; color: #94a3b8; font-size: 0.95rem; }
.meta-info span { color: white; font-weight: 600; }

/* STYLED EDIT FORM */
.edit-form { display: flex; flex-direction: column; gap: 1rem; width: 100%; }
.input-group { display: flex; flex-direction: column; gap: 0.4rem; }
.input-group label { font-size: 0.85rem; font-weight: 600; color: #94a3b8; }
.styled-input {
  background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.75rem 1rem; border-radius: 10px; color: white; font-size: 0.95rem; outline: none;
}
.styled-input:focus, .styled-textarea:focus { border-color: #f26522; }
.styled-textarea {
  background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.75rem 1rem; border-radius: 10px; color: white; font-size: 0.95rem; outline: none;
  resize: none; height: 80px; font-family: inherit;
}
.file-upload-label {
  display: inline-block; background: rgba(255, 255, 255, 0.05); border: 1px dashed rgba(255, 255, 255, 0.2);
  padding: 0.6rem 1.2rem; border-radius: 8px; font-size: 0.88rem; font-weight: 600; cursor: pointer; text-align: center;
  transition: all 0.2s; width: max-content;
}
.file-upload-label:hover { background: rgba(242, 101, 34, 0.1); border-color: #f26522; }
.hidden-file-input { display: none; }
.remove-avatar-btn {
  width: max-content; border: 0; background: transparent; color: #fca5a5;
  padding: 0; cursor: pointer; font-size: 0.82rem;
}
.remove-avatar-btn:hover { color: #fecaca; text-decoration: underline; }
.avatar-error { color: #fca5a5; font-size: 0.82rem; }

/* STATISTICS GRID */
.section-header h3 { font-size: 1.3rem; font-weight: 700; margin-bottom: 1rem; }
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}
.stat-card {
  min-width: 0;
  padding: 1.15rem 1.2rem;
  border-radius: 18px;
  display: flex;
  align-items: center;
  gap: 0.9rem;
}
.stat-icon {
  width: 3px;
  height: 2.6rem;
  flex: 0 0 3px;
  border-radius: 99px;
  background: linear-gradient(#ff8c52, #f26522);
  box-shadow: 0 0 12px rgba(242, 101, 34, 0.35);
}
.stat-data { min-width: 0; }
.stat-data h4 {
  margin: 0 0 0.35rem 0;
  color: #94a3b8;
  font-size: 0.78rem;
  font-weight: 600;
  white-space: nowrap;
}
.stat-data p { margin: 0; font-size: 1.55rem; font-weight: 800; color: white; line-height: 1; }

/* COMPLETED TRAILS GRID */
.completed-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.2rem;
}
.completed-card { border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.2s; }
.completed-card:hover { transform: translateY(-3px); }
.img-container { width: 100%; height: 140px; overflow: hidden; }
.img-container img { width: 100%; height: 100%; object-fit: cover; }
.completed-card-content { padding: 1rem; }
.completed-card-content h4 { margin: 0 0 0.4rem 0; font-size: 1rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.distance-badge { font-size: 0.8rem; color: #ff8c52; background: rgba(242, 101, 34, 0.1); padding: 0.25rem 0.6rem; border-radius: 6px; font-weight: 600; }

.no-trails { padding: 2rem; border-radius: 16px; text-align: center; color: #94a3b8; font-size: 0.95rem; }

/* ANIMATION */
.animate-fade { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 1050px) {
  .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 600px) {
  .stats-grid { grid-template-columns: 1fr; }
  .stat-data h4 { white-space: normal; }
}
</style>