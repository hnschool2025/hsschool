
  const noticeContainer = document.getElementById('notice-container');
  const galleryContainer = document.getElementById('gallery-container');
  let allPosts = [];
  let currentPage = 1;
  const postsPerPage = 10;
  let currentKeyword = '';
  let currentSection = 'notice';

  // 🔹 공지사항 목록 불러오기
  async function loadNoticeList() {
    const res = await fetch('data/notice/list.json');
    allPosts = await res.json();
    currentPage = 1;
    currentKeyword = '';
    currentSection = 'notice';
    renderPostTable();
  }

  function renderPostTable(keyword = '') {
    currentKeyword = keyword;
    const filtered = allPosts.filter(post => post.title.includes(keyword));
    const totalPages = Math.ceil(filtered.length / postsPerPage);
    const start = (currentPage - 1) * postsPerPage;
    const paginated = filtered.slice(start, start + postsPerPage);

    const tbody = paginated.map((post, i) => `
      <tr>
        <td>${filtered.length - (start + i)}</td>
        <td><a href="#notice/${post.id}" class="text-decoration-none">${post.title}</a></td>
        <td>${post.date}</td>
      </tr>
    `).join('');

    const pagination = Array.from({ length: totalPages }, (_, i) => `
      <button class="btn btn-sm ${i + 1 === currentPage ? 'btn-primary' : 'btn-outline-primary'} me-1" onclick="changePage(${i + 1})">${i + 1}</button>
    `).join('');

    noticeContainer.innerHTML = `
      <div class="d-flex justify-content-between align-items-end mb-2">
        <small class="text-muted">총 ${filtered.length}건</small>
        <div class="input-group" style="max-width: 300px;">
          <input type="text" id="search-input" class="form-control form-control-sm" placeholder="제목 검색" value="${keyword}">
          <button class="btn btn-sm btn-outline-secondary" onclick="submitSearch()">검색</button>
        </div>
      </div>
      <table class="table table-hover">
        <thead class="table-light"><tr><th style="width:60px;">번호</th><th>제목</th><th style="width:150px;">작성일</th></tr></thead>
        <tbody>${tbody}</tbody>
      </table>
      <div class="d-flex justify-content-center mt-3">${pagination}</div>
    `;

    const input = document.getElementById('search-input');
    if (input) {
      input.addEventListener('keydown', e => { if (e.key === 'Enter') submitSearch(); });
    }
  }

  function changePage(page) {
    currentPage = page;
    currentSection === 'notice' ? renderPostTable(currentKeyword) : renderGalleryTable(currentKeyword);
  }

  function submitSearch() {
    const keyword = document.getElementById('search-input').value.trim();
    currentPage = 1;
    currentSection === 'notice' ? renderPostTable(keyword) : renderGalleryTable(keyword);
  }

  async function loadNoticeDetail(id) {
    try {
      const res = await fetch(`data/notice/${id}.json`);
      const post = await res.json();
      const viewKey = 'viewed_' + id;
      if (!localStorage.getItem(viewKey)) localStorage.setItem(viewKey, '1');

      noticeContainer.innerHTML = `
        <button class="btn btn-sm btn-outline-secondary mb-3" onclick="location.hash = '#notice'">← 목록으로</button>
        <h3 class="fw-bold">${post.title}</h3>
        <p class="text-muted">${post.date}</p>
        <p>${post.content}</p>
        <hr />
        <p class="small text-secondary">조회됨 ✔</p>
      `;
    } catch (err) {
      noticeContainer.innerHTML = `<p class="text-danger">❌ 글을 불러올 수 없습니다.</p>`;
    }
  }

  // 🔹 갤러리 목록 불러오기
  async function loadGalleryList() {
    const res = await fetch('data/gallery/list.json');
    allPosts = await res.json();
    currentPage = 1;
    currentKeyword = '';
    currentSection = 'gallery';
    renderGalleryTable();
  }

  function renderGalleryTable(keyword = '') {
    currentKeyword = keyword;
    const filtered = allPosts.filter(post => post.title.includes(keyword));
    const totalPages = Math.ceil(filtered.length / postsPerPage);
    const start = (currentPage - 1) * postsPerPage;
    const paginated = filtered.slice(start, start + postsPerPage);

    const cards = paginated.map(post => `
      <div class="col">
        <div class="card h-100 shadow-sm">
          <a href="#gallery/${post.id}">
            <img src="images/gallery/${post.image}" class="card-img-top" style="height:180px; object-fit:cover;" alt="${post.title}">
          </a>
          <div class="card-body">
            <h6 class="card-title text-truncate">${post.title}</h6>
            <p class="card-text"><small class="text-muted">${post.date}</small></p>
          </div>
        </div>
      </div>
    `).join('');

    const pagination = Array.from({ length: totalPages }, (_, i) => `
      <button class="btn btn-sm ${i + 1 === currentPage ? 'btn-primary' : 'btn-outline-primary'} me-1" onclick="changePage(${i + 1})">${i + 1}</button>
    `).join('');

    galleryContainer.innerHTML = `
      <div class="d-flex justify-content-between align-items-end mb-2">
        <small class="text-muted">총 ${filtered.length}건</small>
        <div class="input-group" style="max-width: 300px;">
          <input type="text" id="search-input" class="form-control form-control-sm" placeholder="제목 검색" value="${keyword}">
          <button class="btn btn-sm btn-outline-secondary" onclick="submitSearch()">검색</button>
        </div>
      </div>
      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">${cards}</div>
      <div class="d-flex justify-content-center mt-3">${pagination}</div>
    `;

    const input = document.getElementById('search-input');
    if (input) {
      input.addEventListener('keydown', e => { if (e.key === 'Enter') submitSearch(); });
    }
  }

  async function loadGalleryDetail(id) {
    try {
      const res = await fetch(`data/gallery/${id}.json`);
      const post = await res.json();
      galleryContainer.innerHTML = `
        <button class="btn btn-sm btn-outline-secondary mb-3" onclick="location.hash = '#gallery'">← 목록으로</button>
        <h4 class="fw-bold">${post.title}</h4>
        <p class="text-muted">${post.date}</p>
        <img src="images/gallery/${post.image}" class="img-fluid rounded shadow-sm mb-3" style="max-height:400px;" />
        <p>${post.content}</p>
      `;
    } catch {
      galleryContainer.innerHTML = `<p class="text-danger">❌ 사진을 불러올 수 없습니다.</p>`;
    }
  }

  function handleHashChange() {
    const hash = window.location.hash.substring(1);
    const [section, id] = hash.split('/');

    if (section === 'notice') {
      showSection('notice');
      id ? loadNoticeDetail(id) : loadNoticeList();
    } else if (section === 'gallery') {
      showSection('gallery');
      id ? loadGalleryDetail(id) : loadGalleryList();
    } else {
      showSection(section || 'home');
    }

    setTimeout(() => window.scrollTo(0, 0), 10);
  }

  function showSection(id) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.add('d-none'));
    const target = document.getElementById(id);
    if (target) target.classList.remove('d-none');
  }

  // 🔹 SPA 링크 작동
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').substring(1);
      if (!id) return;
      e.preventDefault();
      location.hash = '#' + id;
    });
  });

// 🔹 햄버거 메뉴 선택 시 자동 닫기
document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
    if (bsCollapse && navbarCollapse.classList.contains('show')) {
      bsCollapse.hide();
    }
  });
});

  window.addEventListener('DOMContentLoaded', handleHashChange);
  window.addEventListener('hashchange', handleHashChange);

