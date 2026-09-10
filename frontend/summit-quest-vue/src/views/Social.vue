<template>
  <div class="social-page full-bleed-page">

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
          <span class="label">{{ item.id === 'social' ? `${item.label} (${friends.length})` : item.label }}</span>
        </router-link>
      </nav>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="content">

      <!-- HEADER -->
      <section class="top-card glass">
        <div class="left">
          <h3>Altigo Заедница</h3>
          <p>Споделувај искуства и следи ги авантурите на планинарската екипа.</p>
        </div>
        <button class="cta-btn" :class="{ 'btn-active': showNewPost }" @click="toggleNewPost">
          {{ showNewPost ? 'Затвори' : 'Нова објава' }}
        </button>
      </section>

      <nav class="community-tabs" aria-label="Секции во заедницата">
        <button class="community-tab" :class="{ active: communityPage === 'friends' }" @click="communityPage = 'friends'">
          Пријатели ({{ friends.length }})
        </button>
        <button class="community-tab" :class="{ active: communityPage === 'healthy-posts' }" @click="communityPage = 'healthy-posts'">
          Објави
        </button>
      </nav>

      <section v-if="communityPage === 'friends'" class="friends-section">
        <div class="friends-feed-layout">
          <section class="section friends-only-posts">
            <div class="section-header">
              <h3>{{ postSort === 'latest' ? 'Најнови објави' : 'Најпопуларни објави' }}</h3>
              <div class="post-sort-options" aria-label="Подреди објави">
                <button class="sort-posts-button" :class="{ active: postSort === 'latest' }" @click="postSort = 'latest'">Најнови</button>
                <button class="sort-posts-button" :class="{ active: postSort === 'popular' }" @click="postSort = 'popular'">Најпопуларни</button>
              </div>
            </div>
            <div class="post-grid">
              <article v-for="post in visibleFriendPosts" :key="post.id" class="post-card glass">
              <div class="post-header">
                <div class="user-info">
                  <div class="avatar-circle friend-post-avatar">{{ post.user.charAt(0) }}</div>
                  <div>
                    <button class="post-author-button" @click="openFriendProfile(post.user)">{{ post.user }}</button>
                    <span class="time">{{ post.time }}</span>
                  </div>
                </div>
              </div>
              <div class="post-body">
                <p class="post-text">{{ post.text }}</p>
                <div class="post-img-wrapper" v-if="post.image">
                  <img :src="post.image" alt="Фотографија од пријател" @error="handleImageError" />
                </div>
              </div>
              <div class="post-actions">
                <button class="action-trigger" :class="{ liked: post.liked }" @click="likePost(post)">
                  <span class="action-label">Лајк ({{ post.likes }})</span>
                </button>
                <button class="action-trigger" @click="post.showComment = !post.showComment">
                  <span class="action-label">Коментирај ({{ post.comments.length }})</span>
                </button>
                <button class="action-trigger" @click="sharePost(post)">↗️ <span class="action-label">Сподели</span></button>
              </div>
              <div v-if="post.showComment" class="comment-section">
                <div class="comment-input-group">
                  <input v-model="post.newComment" placeholder="Напиши коментар..." class="styled-input" @keyup.enter="addComment(post)" />
                  <button class="send-comment-btn" @click="addComment(post)">Прати</button>
                </div>
                <div class="comments-list" v-if="post.comments.length">
                  <div v-for="(comment, index) in post.comments" :key="index" class="comment-bubble-row">
                    <div class="comment-avatar">👤</div>
                    <div class="comment-bubble"><p>{{ comment }}</p></div>
                  </div>
                </div>
              </div>
              </article>
            </div>
            <button v-if="visibleFriendPosts.length < friendPosts.length" class="load-more-posts" @click="showMoreFriendPosts">
              Види повеќе објави
            </button>
          </section>
          <aside class="friends-sidebar">
            <section class="side-card glass">
              <h4>Мој код</h4>
              <div class="friend-code-box side-code">
                <strong>{{ friendCode }}</strong>
                <button class="copy-code-btn" @click="copyFriendCode">{{ codeCopied ? '✓' : 'Копирај' }}</button>
              </div>
              <div class="add-friend-form">
                <input v-model="friendCodeInput" class="friend-code-input" placeholder="Код за пријател" @keyup.enter="addFriend" />
                <button class="add-friend-btn" @click="addFriend">Додај</button>
              </div>
              <p v-if="friendMessage" class="friend-message">{{ friendMessage }}</p>
            </section>
            <section class="side-card glass">
              <h4>Мои пријатели ({{ friends.length }})</h4>
              <article v-for="friend in friends" :key="friend.code" class="compact-friend">
                <div class="friend-avatar">{{ friend.name.charAt(0) }}</div>
                <div class="friend-details">
                  <button class="friend-name-button" @click="selectedFriend = friend">{{ friend.name }}</button>
                  <small>{{ friend.status }}</small>
                </div>
                <button class="chat-open-button" @click="openChat(friend)" title="Отвори разговор">Разговор</button>
              </article>
            </section>
            <section class="side-card glass">
              <h4>Предложени пријатели</h4>
              <article
                v-for="suggestion in suggestedFriends.filter(item => !friends.some(friend => friend.code === item.code))"
                :key="suggestion.code"
                class="suggested-friend"
              >
                <div class="friend-avatar">{{ suggestion.name.charAt(0) }}</div>
                <div class="friend-details">
                  <button class="friend-name-button" @click="selectedFriend = suggestion">{{ suggestion.name }}</button>
                  <small>{{ suggestion.status }}</small>
                </div>
                <button class="suggest-btn" @click="addSuggestedFriend(suggestion)">Додај</button>
              </article>
            </section>
          </aside>
        </div>
      </section>

      <!-- NEW POST FORM (Стилизиран прозорец) -->
      <transition v-if="showNewPost && (communityPage === 'friends' || communityPage === 'healthy-posts')" name="fade-slide">
        <section class="new-post-card glass">
          <div class="user-meta-row">
            <div class="avatar-circle active-user-avatar">
              <img v-if="profile.avatar" :src="profile.avatar" alt="Профилна слика" @error="profile.avatar = ''" />
              <span v-else>{{ profileInitials }}</span>
            </div>
            <h4>{{ profile.name }}</h4>
          </div>
          <textarea v-model="newPostText" placeholder="Каде планинариш денес? Сподели ја твојата следна авантура..." class="styled-textarea"></textarea>
          <div class="form-actions">
            <button class="post-btn" @click="addPost">🚀 Објави во Feed</button>
          </div>
        </section>
      </transition>

      <div v-if="communityPage === 'healthy-posts'" class="community-layout">
        <div class="feed-column">
      <!-- POSTS SECTION -->
      <section v-if="communityPage === 'healthy-posts'" class="section">
        <div class="section-header">
          <h3>{{ postSort === 'latest' ? 'Најнови објави' : 'Најпопуларни објави' }}</h3>
          <div class="post-sort-options" aria-label="Подреди објави">
            <button class="sort-posts-button" :class="{ active: postSort === 'latest' }" @click="postSort = 'latest'">Најнови</button>
            <button class="sort-posts-button" :class="{ active: postSort === 'popular' }" @click="postSort = 'popular'">Најпопуларни</button>
          </div>
        </div>

        <div class="post-grid">
          <div v-for="p in visiblePosts" :key="p.id" class="post-card glass">

            <!-- Хедер на објавата (Име, Време, Бришење) -->
            <div class="post-header">
              <div class="user-info">
                <div class="avatar-circle" :class="{ 'my-avatar': p.user === profile.name }">
                  <img v-if="p.user === profile.name && profile.avatar" :src="profile.avatar" alt="Профилна слика" />
                  <span v-else>{{ p.user.charAt(0) }}</span>
                </div>
                <div>
                  <button class="post-author-button" @click="openFriendProfile(p.user)">{{ p.user }}</button>
                  <span class="time">🕒 {{ p.time }}</span>
                </div>
              </div>
            </div>

            <!-- Содржина и слика -->
            <div class="post-body">
              <p class="post-text">{{ p.text }}</p>
              <div class="post-img-wrapper" v-if="p.image">
                <img :src="p.image" alt="Фотографија од патека" @error="handleImageError" />
              </div>
            </div>

            <!-- Акции (Like, Comment) -->
            <div class="post-actions">
              <button class="action-trigger" :class="{ liked: p.liked }" @click="likePost(p)">
                ❤️ <span class="action-label">Лајк ({{ p.likes }})</span>
              </button>
              <button class="action-trigger" @click="p.showComment = !p.showComment">
                💬 <span class="action-label">Коментирај ({{ p.comments.length }})</span>
              </button>
              <button class="action-trigger" @click="sharePost(p)">↗️ <span class="action-label">Сподели</span></button>
            </div>

            <!-- ТЕЛО ЗА КОМЕНТАРИ -->
            <div v-if="p.showComment" class="comment-section">
              <div class="comment-input-group">
                <input
                    v-model="p.newComment"
                    placeholder="Напиши коментар..."
                    class="styled-input"
                    @keyup.enter="addComment(p)"
                />
                <button class="send-comment-btn" @click="addComment(p)">Прати</button>
              </div>

              <div class="comments-list" v-if="p.comments.length > 0">
                <div v-for="(c, i) in p.comments" :key="i" class="comment-bubble-row">
                  <div class="comment-avatar">👤</div>
                  <div class="comment-bubble">
                    <p>{{ c }}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
        </div>
      </div>

      <div v-if="selectedFriend" class="profile-overlay" @click.self="selectedFriend = null">
        <section class="friend-detail-card glass">
          <button class="close-profile-button" @click="selectedFriend = null">×</button>
          <div class="detail-profile-header">
            <div class="detail-avatar">{{ selectedFriend.name.charAt(0) }}</div>
            <div>
              <h2>{{ selectedFriend.name }}</h2>
              <p>{{ selectedFriend.status }}</p>
            </div>
          </div>
          <p class="detail-bio">{{ selectedFriend.bio || 'Планинар кој сака нови авантури и свеж планински воздух.' }}</p>
          <div class="detail-contact">
            <span>📧 {{ selectedFriend.email || 'friend@altigo.mk' }}</span>
            <span>🎂 {{ selectedFriend.age || 28 }} години</span>
          </div>
          <div class="detail-profile-grid">
            <div><span>Омилена рута</span><strong>{{ selectedFriend.favoriteRoute || 'Водно - Средно' }}</strong></div>
            <div><span>Неделна рутина</span><strong>{{ selectedFriend.routine || '2 планинарења неделно' }}</strong></div>
            <div><span>Освоени патеки</span><strong>{{ selectedFriend.trails || '18 патеки' }}</strong></div>
            <div><span>Најчесто планинари</span><strong>{{ selectedFriend.availability || 'За време на викенд' }}</strong></div>
          </div>
          <div class="detail-interests">
            <span v-for="interest in (selectedFriend.interests || ['Планинарење', 'Природа', 'Фотографија'])" :key="interest">{{ interest }}</span>
          </div>
          <div class="friend-profile-posts">
            <h3>Објави од {{ selectedFriend.name }}</h3>
            <article v-for="post in selectedFriendPosts" :key="post.id" class="profile-post">
              <p>{{ post.text }}</p>
              <div v-if="post.image" class="profile-post-image">
                <img :src="post.image" alt="Објава од пријател" @error="handleImageError" />
              </div>
              <div class="post-actions">
                <button class="action-trigger" :class="{ liked: post.liked }" @click="likePost(post)">
                  ❤️ Лајк ({{ post.likes }})
                </button>
                <button class="action-trigger" @click="post.showComment = !post.showComment">
                  💬 Коментар ({{ post.comments.length }})
                </button>
              </div>
              <div v-if="post.showComment" class="comment-section">
                <div class="comment-input-group">
                  <input v-model="post.newComment" placeholder="Напиши коментар..." class="styled-input" @keyup.enter="addComment(post)" />
                  <button class="send-comment-btn" @click="addComment(post)">Прати</button>
                </div>
                <div v-if="post.comments.length" class="comments-list">
                  <div v-for="(comment, index) in post.comments" :key="index" class="comment-bubble-row">
                    <div class="comment-avatar">👤</div>
                    <div class="comment-bubble"><p>{{ comment }}</p></div>
                  </div>
                </div>
              </div>
            </article>
            <p v-if="!selectedFriendPosts.length" class="empty-profile-posts">Овој пријател сè уште нема објави.</p>
          </div>
        </section>
      </div>

      <div v-if="activeChatFriend" class="chat-overlay" @click.self="activeChatFriend = null">
        <section class="chat-window glass">
          <header class="chat-header">
            <div class="chat-user">
              <div class="friend-avatar">{{ activeChatFriend.name.charAt(0) }}</div>
              <div>
                <strong>{{ activeChatFriend.name }}</strong>
                <small>Активен планинар</small>
              </div>
            </div>
            <button class="close-profile-button" @click="activeChatFriend = null">×</button>
          </header>
          <div class="chat-messages" ref="chatMessagesElement">
            <div v-if="!activeMessages.length" class="empty-chat">
              Започни разговор со {{ activeChatFriend.name }} 👋
            </div>
            <div v-for="message in activeMessages" :key="message.id" class="chat-message" :class="{ mine: message.mine }">
              <span>{{ message.text }}</span>
              <small>{{ message.time }}</small>
            </div>
          </div>
          <form class="chat-composer" @submit.prevent="sendMessage">
            <input v-model="messageDraft" placeholder="Напиши порака..." aria-label="Порака" />
            <button type="button" class="chat-emoji-button" @click="messageDraft += ' 😊'">😊</button>
            <button type="submit" class="chat-send-button">Прати</button>
          </form>
        </section>
      </div>

    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { loadData, saveData } from '../services/storage'

const router = useRouter()
const currentPage = ref('social')
const communityPage = ref('healthy-posts')
const selectedFriend = ref(null)
const activeChatFriend = ref(null)
const postSort = ref('latest')
const messageDraft = ref('')
const chatMessagesElement = ref(null)
const conversations = ref(loadData('friendConversations', {}))
const activeMessages = computed(() => activeChatFriend.value ? (conversations.value[activeChatFriend.value.code] || []) : [])
const friendPostsVisible = ref(4)
const selectedFriendPosts = computed(() => (
  selectedFriend.value
    ? friendPosts.value.filter(post => post.user === selectedFriend.value.name)
    : []
))

const menuItems = [
  { id: 'home', label: 'Почетна', icon: '🏠' },
  { id: 'explore', label: 'Истражи', icon: '🧭' },
  { id: 'map', label: 'Мапа', icon: '🗺️' },
  { id: 'social', label: 'Заедница', icon: '💬' },
  { id: 'profile', label: 'Профил', icon: '👤' }
]

const defaultFriends = [
  { name: 'Ана', code: 'ANA-4821', email: 'ana@altigo.mk', age: 26, status: 'Планинари заедно', bio: 'Љубител на Водно и изгрејсонца.', favoriteRoute: 'Водно - Средно', routine: '3 планинарења неделно', trails: '26 патеки', availability: 'Сабота и недела', interests: ['Изгрејсонца', 'Водно', 'Фотографија'] },
  { name: 'Марко', code: 'MARKO-7310', email: 'marko@altigo.mk', age: 31, status: 'Љубител на македонски планини', bio: 'Секој викенд е на нова патека.', favoriteRoute: 'Кањон Матка', routine: 'Долга тура секоја сабота', trails: '34 патеки', availability: 'Викенд', interests: ['Матка', 'Галичник', 'Кампување'] },
  { name: 'Елена', code: 'ELENA-2654', email: 'elena@altigo.mk', age: 29, status: 'Активен планинар', bio: 'Истражува нови врвови и езера.', favoriteRoute: 'Баба Планина', routine: 'Утринско искачување двапати неделно', trails: '41 патека', availability: 'Рано наутро', interests: ['Високи врвови', 'Езера', 'Трчање'] },
  { name: 'Ивана', code: 'IVANA-9042', email: 'ivana@altigo.mk', age: 27, status: 'Авантурист', bio: 'Најмногу сака долги планински тури.', favoriteRoute: 'Галичник', routine: 'Целодневна тура еднаш неделно', trails: '22 патеки', availability: 'Недела', interests: ['Авантури', 'Природа', 'Пешачење'] },
  { name: 'Даниел', code: 'DANIEL-6178', email: 'daniel@altigo.mk', age: 34, status: 'Планинар и фотограф', bio: 'Ги фотографира најубавите погледи.', favoriteRoute: 'Шар Планина', routine: 'Фотографска тура секој втор викенд', trails: '29 патеки', availability: 'Попладне', interests: ['Фотографија', 'Шар Планина', 'Зајдисонца'] }
]
const storedFriends = loadData('altigoFriends', [])
const friends = ref(storedFriends.length >= defaultFriends.length ? storedFriends : defaultFriends)
saveData('altigoFriends', friends.value)

const defaultFriendPosts = [
  { id: 'friend-1', user: 'Ана', time: 'пред 35 минути', text: 'Утрово го дочекав изгрејсонцето на Водно. Прекрасна атмосфера! 🌄', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', likes: 18, liked: false, comments: ['Прекрасно! Следниот пат доаѓам и јас.', 'Овој поглед никогаш не здосадува.'], showComment: false, newComment: '' },
  { id: 'friend-2', user: 'Марко', time: 'пред 1 час', text: 'Нова тура до Матка завршена. Патеката е одлична за викенд прошетка. 🥾', image: '', likes: 24, liked: false, comments: ['Колку време траеше турата?'], showComment: false, newComment: '' },
  { id: 'friend-3', user: 'Елена', time: 'пред 3 часа', text: 'Денес се искачивме до Баба Планина. Погледот вредеше за секој чекор! 🏔️', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b', likes: 31, liked: false, comments: ['Браво за искачувањето!'], showComment: false, newComment: '' },
  { id: 'friend-4', user: 'Ивана', time: 'вчера', text: 'Галичник во есен е нешто посебно. Кој е за следната авантура? 🍂', image: '', likes: 15, liked: false, comments: [], showComment: false, newComment: '' },
  { id: 'friend-5', user: 'Даниел', time: 'вчера', text: 'Денес фотографиравме прекрасни пејзажи над Шар Планина. Природата е неверојатна! 📷', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee', likes: 27, liked: false, comments: ['Фотографиите се прекрасни!'], showComment: false, newComment: '' },
  { id: 'friend-6', user: 'Ана', time: 'пред 2 дена', text: 'Кратка вечерна прошетка, но со најубаво зајдисонце. 🌅', image: '', likes: 21, liked: false, comments: ['Каква убавина!'], showComment: false, newComment: '' },
  { id: 'friend-7', user: 'Марко', time: 'пред 3 дена', text: 'Успешно искачување и многу добра енергија со екипата. Следи уште една авантура!', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470', likes: 33, liked: false, comments: [], showComment: false, newComment: '' },
  { id: 'friend-8', user: 'Ивана', time: 'пред 4 дена', text: 'Планината секогаш го враќа мирот. Ви посакувам убав ден на сите планинари. 🌿', image: '', likes: 17, liked: false, comments: ['Прекрасно кажано!'], showComment: false, newComment: '' }
]

const suggestedFriends = [
  { name: 'Стефан', status: 'Љубител на природа', code: 'STEFAN-2284', bio: 'Сака долги прошетки.', favoriteRoute: 'Водно - Крст', routine: 'Двапати неделно' },
  { name: 'Марија', status: 'Планинарка', code: 'MARIJA-3190', bio: 'Истражува мирни патеки.', favoriteRoute: 'Матка', routine: 'Секоја недела' },
  { name: 'Никола', status: 'Авантурист', code: 'NIKOLA-4402', bio: 'Секогаш подготвен за нов врв.', favoriteRoute: 'Кораб', routine: 'Една голема тура месечно' },
  { name: 'Сара', status: 'Фотограф', code: 'SARA-5821', bio: 'Ги снима најубавите пејзажи.', favoriteRoute: 'Пелистер', routine: 'Фотографирање за викенд' }
]

const popularRoutes = [
  { name: 'Водно - Средно', distance: '5.2 km', level: 'Средна', likes: 128 },
  { name: 'Кањон Матка', distance: '6.7 km', level: 'Лесна', likes: 96 },
  { name: 'Баба Планина', distance: '8.1 km', level: 'Предизвикувачка', likes: 84 }
]

const defaultPosts = [
  {
    id: 1,
    user: 'Петар',
    text: 'Прекрасен ден за искачување на Водно денес! Воздухот е чист, а погледот кон Скопје е незаменлив. 🌲🧗‍♀️',
    time: 'пред 2 часа',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    likes: 12,
    comments: ['Се согласувам, патеката беше супер!', 'Браво Ана!'],
    showComment: false,
    newComment: ''
  },
  {
    id: 2,
    user: 'Јована',
    text: 'Канјонот Матка никогаш не разочарува. Едвај чекам викендот да направам уште една тура до Галичник.',
    time: 'пред 5 часа',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
    likes: 24,
    comments: [],
    showComment: false,
    newComment: ''
  },
  { id: 3, user: 'Софија', text: 'Патеката до Баба Планина денес беше совршена за утринска прошетка. 🏔️', time: 'пред 7 часа', image: '', likes: 19, liked: false, comments: [], showComment: false, newComment: '' },
  { id: 4, user: 'Александар', text: 'Галичник во есен има посебна магија. Следната тура е веќе испланирана!', time: 'вчера', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b', likes: 16, liked: false, comments: [], showComment: false, newComment: '' },
  { id: 5, user: 'Мила', text: 'Малку мотивација за денес: секој чекор е чекор поблиску до врвот. 🥾', time: 'вчера', image: '', likes: 28, liked: false, comments: [], showComment: false, newComment: '' },
  { id: 6, user: 'Горан', text: 'Поглед од врвот што вредеше за целото искачување. 🌄', time: 'пред 2 дена', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee', likes: 35, liked: false, comments: [], showComment: false, newComment: '' }
]

const storedPosts = loadData('socialPosts', [])
const friendNames = new Set(defaultFriends.map(friend => friend.name))
const randomPosts = storedPosts.filter(post => !friendNames.has(post.user))
const posts = ref(randomPosts.length >= 6 ? randomPosts.slice(0, 6) : defaultPosts)
const storedFriendPosts = loadData('friendPosts', [])
const friendPosts = ref(storedFriendPosts.length >= defaultFriendPosts.length ? storedFriendPosts : defaultFriendPosts)
saveData('friendPosts', friendPosts.value)
const sortedFriendPosts = computed(() => sortPosts(friendPosts.value))
const visibleFriendPosts = computed(() => sortedFriendPosts.value.slice(0, friendPostsVisible.value))
const sortedPosts = computed(() => sortPosts(posts.value))
const visiblePosts = computed(() => sortedPosts.value)
const showNewPost = ref(false)
const newPostText = ref('')
const profile = ref(loadData('altigoUser', { name: 'Планинар', avatar: '' }))
const profileInitials = computed(() => profile.value.name.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase())
const fallbackImage = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85'
const handleImageError = (event) => {
  if (event.target.src !== fallbackImage) event.target.src = fallbackImage
}

const friendCode = ref(loadData('altigoFriendCode', 'HIKER-4820'))
saveData('altigoFriendCode', friendCode.value)
const friendCodeInput = ref('')
const friendMessage = ref('')
const codeCopied = ref(false)

const copyFriendCode = async () => {
  await navigator.clipboard.writeText(friendCode.value)
  codeCopied.value = true
  window.setTimeout(() => { codeCopied.value = false }, 1800)
}

const addFriend = () => {
  const code = friendCodeInput.value.trim().toUpperCase()
  const friend = defaultFriends.find(item => item.code === code)
  if (!code) friendMessage.value = 'Внеси код за пријател.'
  else if (!friend) friendMessage.value = 'Кодот не е пронајден. Провери дали е точен.'
  else if (friends.value.some(item => item.code === code)) friendMessage.value = 'Овој пријател веќе е додаден.'
  else {
    friends.value.push(friend)
    saveData('altigoFriends', friends.value)
    friendCodeInput.value = ''
    friendMessage.value = `${friend.name} е додаден/а во пријатели.`
  }
}

const addSuggestedFriend = (suggestion) => {
  if (friends.value.some(friend => friend.code === suggestion.code)) return
  friends.value.push({ ...suggestion, bio: 'Нов член на твојата планинарска екипа.' })
  saveData('altigoFriends', friends.value)
}

const openFriendProfile = (name) => {
  selectedFriend.value = friends.value.find(friend => friend.name === name) || suggestedFriends.find(friend => friend.name === name) || null
}

const openChat = (friend) => {
  activeChatFriend.value = friend
  if (!conversations.value[friend.code]) {
    conversations.value[friend.code] = [
      { id: `${friend.code}-welcome`, text: `Здраво! Како си, ${profile.value.name}?`, time: '09:40', mine: false }
    ]
    saveData('friendConversations', conversations.value)
  }
}

const sendMessage = () => {
  const text = messageDraft.value.trim()
  if (!text || !activeChatFriend.value) return
  const now = new Date()
  const time = now.toLocaleTimeString('mk-MK', { hour: '2-digit', minute: '2-digit' })
  const friendCode = activeChatFriend.value.code
  if (!conversations.value[friendCode]) conversations.value[friendCode] = []
  conversations.value[friendCode].push({ id: Date.now(), text, time, mine: true })
  saveData('friendConversations', conversations.value)
  messageDraft.value = ''
  window.setTimeout(() => {
    conversations.value[friendCode].push({
      id: Date.now() + 1,
      text: 'Супер! Ќе ти пишам наскоро за следната тура. 🥾',
      time: new Date().toLocaleTimeString('mk-MK', { hour: '2-digit', minute: '2-digit' }),
      mine: false
    })
    saveData('friendConversations', conversations.value)
  }, 700)
}

const showMoreFriendPosts = () => {
  friendPostsVisible.value += 4
}

const sharePost = async (post) => {
  const shareText = `${post.user}: ${post.text}`
  if (navigator.share) {
    await navigator.share({ title: 'Altigo објава', text: shareText })
  } else {
    await navigator.clipboard.writeText(shareText)
    window.alert('Линкот до објавата е копиран.')
  }
}

const toggleNewPost = () => {
  showNewPost.value = !showNewPost.value
}

const addPost = () => {
  if (newPostText.value.trim() !== '') {
    const newPost = {
      id: Date.now(),
      user: profile.value.name,
      text: newPostText.value,
      time: 'тукушто',
      image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df', // Слика за позадина на твојата нова објава
      likes: 0,
      liked: false,
      comments: [],
      showComment: false,
      newComment: ''
    }
    if (communityPage.value === 'friends') {
      friendPosts.value.unshift(newPost)
      saveData('friendPosts', friendPosts.value)
    } else {
      posts.value.unshift(newPost)
      saveData('socialPosts', posts.value)
    }
    newPostText.value = ''
    showNewPost.value = false
  }
}

const sortPosts = (postList) => postSort.value === 'popular'
  ? [...postList].sort((a, b) => b.likes - a.likes)
  : [...postList]


const likePost = (post) => {
  post.liked = !post.liked
  post.likes += post.liked ? 1 : -1
  if (posts.value.includes(post)) saveData('socialPosts', posts.value)
  else saveData('friendPosts', friendPosts.value)
}

const addComment = (post) => {
  if (post.newComment.trim() !== '') {
    post.comments.push(post.newComment)
    post.newComment = ''
    saveData(posts.value.includes(post) ? 'socialPosts' : 'friendPosts', posts.value.includes(post) ? posts.value : friendPosts.value)
  }
}

const deletePost = (post) => {
  const confirmed = window.confirm(`Дали си сигурна дека сакаш да ја избришеш оваа објава?`)
  if (confirmed) {
    posts.value = posts.value.filter(p => p.id !== post.id)
    saveData('socialPosts', posts.value)
  }
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

/* MAIN CONTENT */
.content {
  flex: 1;
  padding: 2rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: none;
  box-sizing: border-box;
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

.cta-btn {
  background: #f26522;
  color: white;
  border: none;
  padding: 0.7rem 1.4rem;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(242, 101, 34, 0.3);
}
.cta-btn:hover { background: #ff7637; transform: translateY(-1px); }
.cta-btn.btn-active { background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.4); box-shadow: none; }

.community-tabs { display: flex; gap: 0.75rem; padding: 0.35rem; border-radius: 14px; background: rgba(30, 41, 59, 0.45); }
.community-tab { flex: 1; border: 1px solid transparent; border-radius: 10px; padding: 0.8rem 1rem; color: #94a3b8; background: transparent; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.community-tab:hover { color: white; background: rgba(255, 255, 255, 0.05); }
.community-tab.active { color: white; border-color: rgba(242, 101, 34, 0.45); background: rgba(242, 101, 34, 0.15); }
.community-layout { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.25rem; align-items: start; }
.community-column { min-width: 0; }
.side-card { padding: 1rem; border-radius: 16px; }
.side-card h4 { margin: 0 0 0.9rem; }
.healthy-sidebar { display: flex; flex-direction: column; gap: 1rem; }
.healthy-tip { display: flex; gap: 0.7rem; align-items: flex-start; padding: 0.75rem; border-radius: 12px; background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.18); }
.tip-icon { font-size: 1.35rem; }
.healthy-tip p { margin: 0; color: #cbd5e1; font-size: 0.8rem; line-height: 1.45; }
.popular-route { display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; padding: 0.7rem 0; border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
.popular-route:last-child { border-bottom: 0; padding-bottom: 0; }
.popular-route div { display: flex; flex-direction: column; gap: 0.2rem; min-width: 0; }
.popular-route strong { font-size: 0.8rem; }
.popular-route small { color: #94a3b8; font-size: 0.68rem; }
.popular-route > span { color: #fda4af; font-size: 0.7rem; white-space: nowrap; }
.suggested-friend, .compact-friend { display: flex; align-items: center; gap: 0.55rem; padding: 0.65rem 0; border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
.suggested-friend:last-child, .compact-friend:last-child { border-bottom: 0; }
.suggested-friend .friend-avatar, .compact-friend .friend-avatar { width: 32px; height: 32px; margin: 0; flex-shrink: 0; }
.suggested-friend .friend-details, .compact-friend .friend-details { min-width: 0; flex: 1; }
.suggest-btn { border: 0; border-radius: 7px; padding: 0.35rem 0.45rem; color: white; background: #f26522; font-size: 0.68rem; font-weight: 700; cursor: pointer; }
.chat-open-button { border: 0; padding: 0.25rem; color: #94a3b8; background: transparent; cursor: pointer; }
.chat-open-button:hover { color: #ff996e; }
.side-code { margin-bottom: 0.65rem; flex-wrap: wrap; }
.side-code strong { margin-right: auto; }
.feed-column { min-width: 0; display: flex; flex-direction: column; gap: 1.5rem; }
.friends-section { display: flex; flex-direction: column; gap: 1rem; }
.friends-only-posts { margin-top: 0.5rem; }
.friends-feed-layout { display: grid; grid-template-columns: minmax(0, 1fr) 260px; gap: 1.25rem; align-items: start; }
.friends-only-posts .post-grid { display: flex; flex-direction: column; gap: 1.5rem; }
.load-more-posts { align-self: center; margin-top: 1.25rem; border: 1px solid rgba(242, 101, 34, 0.45); border-radius: 10px; padding: 0.75rem 1.4rem; color: white; background: rgba(242, 101, 34, 0.14); font-weight: 700; cursor: pointer; transition: all 0.2s; }
.load-more-posts:hover { background: #f26522; transform: translateY(-1px); }
.friends-sidebar { display: flex; flex-direction: column; gap: 1rem; }
.section-header h3 { margin: 0; }
.post-sort-options { display: flex; gap: 0.35rem; }
.sort-posts-button { border: 1px solid rgba(242, 101, 34, 0.35); border-radius: 8px; padding: 0.45rem 0.7rem; color: #ffb08b; background: rgba(242, 101, 34, 0.1); font-size: 0.75rem; font-weight: 700; cursor: pointer; }
.sort-posts-button:hover, .sort-posts-button.active { color: white; background: #f26522; }
.section-subtitle { margin: 0.35rem 0 0; color: #94a3b8; font-size: 0.88rem; }
.friends-manager { padding: 1.25rem; border-radius: 18px; }
.friend-code-row { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
.friend-code-row h4 { margin: 0; font-size: 1rem; }
.friend-help { margin: 0.35rem 0 0; color: #94a3b8; font-size: 0.82rem; }
.friend-code-box { display: flex; align-items: center; gap: 0.6rem; padding: 0.65rem; border: 1px solid rgba(242, 101, 34, 0.25); border-radius: 10px; background: rgba(242, 101, 34, 0.1); }
.friend-code-box span { color: #cbd5e1; font-size: 0.75rem; }
.friend-code-box strong { color: #ffb08b; letter-spacing: 1px; }
.copy-code-btn, .add-friend-btn { border: 0; border-radius: 8px; padding: 0.55rem 0.75rem; color: white; background: #f26522; font-weight: 700; cursor: pointer; }
.add-friend-form { display: flex; gap: 0.5rem; margin-top: 0.85rem; }
.friend-code-input { min-width: 0; flex: 1; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 0.65rem; color: white; background: rgba(15, 23, 42, 0.7); outline: none; }
.friend-message { color: #ffb08b; font-size: 0.78rem; margin: 0.65rem 0 0; }
.friends-list { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 0.7rem; margin-top: 1rem; }
.friend-profile { position: relative; min-width: 0; padding: 0.8rem; border-radius: 12px; background: rgba(255, 255, 255, 0.04); }
.friend-avatar { display: grid; place-items: center; width: 38px; height: 38px; margin-bottom: 0.55rem; border-radius: 50%; color: white; font-weight: 800; background: linear-gradient(135deg, #8b5cf6, #f26522); }
.friend-details { display: flex; flex-direction: column; gap: 0.2rem; }
.friend-details strong { font-size: 0.88rem; }
.friend-details span, .friend-details small { color: #94a3b8; font-size: 0.7rem; line-height: 1.3; }
.remove-friend-btn { position: absolute; top: 0.4rem; right: 0.45rem; border: 0; color: #94a3b8; background: transparent; font-size: 1.1rem; cursor: pointer; }
.friend-post-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.friend-post-card { padding: 1.25rem; border-radius: 18px; display: flex; flex-direction: column; gap: 0.9rem; }
.friend-post-avatar { background: linear-gradient(135deg, #8b5cf6, #f26522); }
.friend-post-likes { color: #fda4af; font-size: 0.78rem; }

/* NEW POST CARD */
.new-post-card {
  padding: 1.5rem;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  border-color: rgba(242, 101, 34, 0.3);
}
.user-meta-row { display: flex; align-items: center; gap: 0.75rem; }
.user-meta-row h4 { margin: 0; font-size: 1.05rem; font-weight: 700; }

.avatar-circle {
  width: 40px;
  height: 40px;
  background: #334155;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.1rem;
}
.active-user-avatar, .my-avatar {
  background: linear-gradient(135deg, #f26522, #ff8c52);
  box-shadow: 0 0 10px rgba(242, 101, 34, 0.4);
}
.avatar-circle img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.styled-textarea {
  width: 100%;
  height: 100px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem;
  color: white;
  font-family: inherit;
  font-size: 0.95rem;
  resize: none;
  outline: none;
  box-sizing: border-box;
}
.styled-textarea:focus { border-color: rgba(242, 101, 34, 0.5); }
.form-actions { display: flex; justify-content: flex-end; }
.post-btn {
  background: #f26522; color: white; border: none; padding: 0.6rem 1.4rem;
  border-radius: 10px; font-weight: 700; cursor: pointer; transition: background 0.2s;
}
.post-btn:hover { background: #ff7637; }

/* POST GRID / CARDS */
.post-grid { display: flex; flex-direction: column; gap: 1.5rem; }
.post-card { border-radius: 20px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.2rem; }

.post-header { display: flex; justify-content: space-between; align-items: flex-start; }
.user-info { display: flex; align-items: center; gap: 0.85rem; }
.user-info h4 { margin: 0 0 0.15rem 0; font-size: 1.1rem; font-weight: 700; }
.time { font-size: 0.75rem; color: #64748b; display: block; }

.delete-btn {
  background: transparent; border: none; font-size: 1.1rem; cursor: pointer; opacity: 0.4; transition: opacity 0.2s;
}
.delete-btn:hover { opacity: 1; }

.post-text { margin: 0; line-height: 1.5; color: #e2e8f0; font-size: 1rem; }
.post-img-wrapper { width: 100%; height: 390px; border-radius: 14px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.3); }
.post-img-wrapper img { width: 100%; height: 100%; object-fit: cover; }
.friend-name-button, .post-author-button { padding: 0; border: 0; color: white; background: transparent; font: inherit; font-weight: 700; text-align: left; cursor: pointer; }
.friend-name-button:hover, .post-author-button:hover { color: #ff996e; text-decoration: underline; }
.profile-overlay { position: fixed; inset: 0; z-index: 20; display: grid; place-items: center; padding: 1.5rem; background: rgba(2, 6, 23, 0.78); backdrop-filter: blur(8px); }
.friend-detail-card { position: relative; width: min(640px, 100%); padding: 2rem; border-radius: 22px; box-shadow: 0 24px 70px rgba(0, 0, 0, 0.45); }
.close-profile-button { position: absolute; top: 0.8rem; right: 1rem; border: 0; color: #cbd5e1; background: transparent; font-size: 1.7rem; cursor: pointer; }
.detail-profile-header { display: flex; align-items: center; gap: 1rem; padding-bottom: 1.25rem; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
.detail-avatar { display: grid; place-items: center; width: 72px; height: 72px; border-radius: 50%; color: white; font-size: 1.7rem; font-weight: 800; background: linear-gradient(135deg, #8b5cf6, #f26522); }
.detail-profile-header h2 { margin: 0; font-size: 1.6rem; }
.detail-profile-header p { margin: 0.35rem 0 0; color: #ff996e; }
.detail-bio { color: #cbd5e1; line-height: 1.6; }
.detail-contact { display: flex; flex-wrap: wrap; gap: 0.75rem; margin: 0.8rem 0 1rem; color: #ffb08b; font-size: 0.82rem; }
.detail-profile-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.8rem; }
.detail-profile-grid div { display: flex; flex-direction: column; gap: 0.3rem; padding: 0.85rem; border-radius: 12px; background: rgba(255, 255, 255, 0.05); }
.detail-profile-grid span { color: #94a3b8; font-size: 0.75rem; }
.detail-profile-grid strong { font-size: 0.88rem; }
.detail-interests { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem; }
.detail-interests span { padding: 0.4rem 0.65rem; border-radius: 999px; color: #ffd0bd; background: rgba(242, 101, 34, 0.15); font-size: 0.75rem; }
.friend-profile-posts { margin-top: 1.5rem; }
.friend-profile-posts h3 { margin: 0 0 0.75rem; font-size: 1rem; }
.profile-post { padding: 0.9rem; margin-top: 0.75rem; border-radius: 12px; background: rgba(255, 255, 255, 0.04); }
.profile-post > p { margin: 0 0 0.75rem; color: #e2e8f0; line-height: 1.45; }
.profile-post-image { height: 180px; margin-bottom: 0.75rem; border-radius: 10px; overflow: hidden; }
.profile-post-image img { width: 100%; height: 100%; object-fit: cover; }
.empty-profile-posts { color: #94a3b8; font-size: 0.85rem; }
.chat-overlay { position: fixed; inset: 0; z-index: 25; display: grid; place-items: center; padding: 1rem; background: rgba(2, 6, 23, 0.78); backdrop-filter: blur(8px); }
.chat-window { width: min(520px, 100%); height: min(680px, 88vh); display: flex; flex-direction: column; overflow: hidden; border-radius: 20px; box-shadow: 0 24px 70px rgba(0, 0, 0, 0.5); }
.chat-header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
.chat-user { display: flex; align-items: center; gap: 0.7rem; }
.chat-user .friend-avatar { width: 40px; height: 40px; margin: 0; }
.chat-user div:last-child { display: flex; flex-direction: column; gap: 0.2rem; }
.chat-user small { color: #22c55e; font-size: 0.7rem; }
.chat-messages { flex: 1; display: flex; flex-direction: column; gap: 0.7rem; overflow-y: auto; padding: 1rem; background: rgba(15, 23, 42, 0.35); }
.empty-chat { margin: auto; color: #94a3b8; text-align: center; font-size: 0.85rem; }
.chat-message { display: flex; flex-direction: column; align-self: flex-start; max-width: 78%; gap: 0.25rem; padding: 0.65rem 0.8rem; border-radius: 14px 14px 14px 4px; color: #e2e8f0; background: rgba(255, 255, 255, 0.08); }
.chat-message.mine { align-self: flex-end; border-radius: 14px 14px 4px 14px; background: #f26522; color: white; }
.chat-message small { align-self: flex-end; opacity: 0.65; font-size: 0.62rem; }
.chat-composer { display: flex; gap: 0.45rem; padding: 0.8rem; border-top: 1px solid rgba(255, 255, 255, 0.08); }
.chat-composer input { min-width: 0; flex: 1; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px; padding: 0.7rem 0.8rem; color: white; background: rgba(15, 23, 42, 0.8); outline: none; }
.chat-emoji-button, .chat-send-button { border: 0; border-radius: 10px; padding: 0 0.75rem; color: white; background: rgba(255, 255, 255, 0.1); cursor: pointer; }
.chat-send-button { background: #f26522; font-weight: 700; }

/* ACTIONS (LIKE / COMMENT BUTTONS) */
.post-actions {
  display: flex; gap: 0.5rem; border-top: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding: 0.5rem 0;
}
.action-trigger {
  flex: 1; background: transparent; border: none; color: #94a3b8; padding: 0.6rem;
  border-radius: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer; display: flex;
  align-items: center; justify-content: center; gap: 0.4rem; transition: all 0.2s;
}
.action-trigger:hover { background: rgba(255, 255, 255, 0.04); color: white; }
.action-trigger.liked { color: #ef4444; }

/* COMMENT SECTION */
.comment-section { background: rgba(15, 23, 42, 0.4); border-radius: 12px; padding: 1rem; display: flex; flex-direction: column; gap: 1rem; }
.comment-input-group { display: flex; gap: 0.75rem; }
.styled-input {
  flex: 1; background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 0.65rem 1rem; border-radius: 10px; color: white; outline: none; font-size: 0.9rem;
}
.styled-input:focus { border-color: rgba(242, 101, 34, 0.4); }
.send-comment-btn {
  background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1);
  color: white; padding: 0 1.2rem; border-radius: 10px; font-weight: 600; font-size: 0.85rem; cursor: pointer;
}
.send-comment-btn:hover { background: #f26522; border-color: #f26522; }

.comments-list { display: flex; flex-direction: column; gap: 0.75rem; max-height: 200px; overflow-y: auto; padding-right: 0.5rem; }
.comment-bubble-row { display: flex; gap: 0.6rem; align-items: flex-start; }
.comment-avatar { font-size: 0.9rem; margin-top: 0.2rem; }
.comment-bubble { background: rgba(255, 255, 255, 0.05); padding: 0.6rem 0.9rem; border-radius: 14px; border-top-left-radius: 4px; flex: 1; }
.comment-bubble p { margin: 0; font-size: 0.88rem; color: #cbd5e1; line-height: 1.4; }

/* VUE ANIMATIONS */
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.3s ease; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateY(-10px); }
@media (max-width: 720px) {
  .sidebar { width: 76px; padding: 1.5rem 0.6rem; }
  .logo-text, .nav-item .label { display: none; }
  .nav-item { justify-content: center; padding: 0.8rem 0.4rem; }
  .content { padding: 1.25rem; }
  .top-card { align-items: flex-start; flex-direction: column; gap: 1rem; }
  .post-img-wrapper { height: 210px; }
  .detail-profile-grid { grid-template-columns: 1fr; }
  .community-tabs { flex-direction: column; }
  .community-layout { grid-template-columns: 1fr; }
  .suggested-column { order: 2; }
  .friend-code-row { align-items: flex-start; flex-direction: column; }
  .friends-list, .friend-post-grid { grid-template-columns: 1fr; }
  .friends-feed-layout { grid-template-columns: 1fr; }
}
</style>