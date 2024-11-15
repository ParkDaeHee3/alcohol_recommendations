let filteredDrinks = []; // 현재 필터링된 데이터를 저장
let wishlist = []; // 찜 목록을 저장
let currentPage = 1;
const cardsPerPage = 32; // 한 페이지에 32개의 카드 표시

document.addEventListener('DOMContentLoaded', function() {
  // 항상 기본 상태로 "전체" 카테고리와 기본 정렬로 설정
  const initialCategory = '전체';
  const initialSortOrder = null; // 정렬 순서는 사용자가 선택하기 전까지 기본으로 설정
  
  wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

  // Header 불러오기
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-container').innerHTML = data;

      // 헤더가 로드된 후 로그인 상태 확인 및 배너 설정
      setTimeout(() => {
        checkLoginStatus();
        setupSidebarLogin(); // 사이드바 로그인 상태 설정
        setBanner(
          true, 
          'img/banner/all_drinks-banner.gif', 
          'Tastify의 술 리스트 페이지.', 
          '다양한 술에 대한 정보를 찾을 수 있습니다.', 
          '카드에 포인터를 올려보세요.'
        );
      }, 0);
    })
    .catch(error => console.log('Header 불러오기 에러:', error));

  const drinks = getDrinkData();

  // URL에서 카테고리 파라미터 확인
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category') || initialCategory;

  // 브라우저 히스토리의 상태를 확인하고, 복원할 상태가 있으면 해당 상태로 설정
  const state = history.state;
  if (state) {
    currentPage = state.page || 1;
    filteredDrinks = state.filteredDrinks || drinks;
    loadDrinkCards(filteredDrinks, currentPage, cardsPerPage);
    createPagination(filteredDrinks.length, cardsPerPage);

    if (state.category) {
      document.querySelectorAll('.tab-item').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.category === state.category);
      });
    }
    
    if (state.sortOrder) {
      document.getElementById('sort-order').value = state.sortOrder;
      filteredDrinks = sortDrinks(filteredDrinks, state.sortOrder);
    }
  } else {
    // 처음 로드할 때는 "전체" 카테고리를 보여주기 위해 기본 상태로 설정
    filteredDrinks = category === '전체' ? drinks : drinks.filter(drink => drink.category === category);
    loadDrinkCards(filteredDrinks, currentPage, cardsPerPage);
    createPagination(filteredDrinks.length, cardsPerPage);
  }

  // 정렬 기준 변경 시 상태를 저장하고 카드 목록을 갱신
  document.getElementById('sort-order').addEventListener('change', function() {
    const sortOrder = this.value;
    localStorage.setItem('currentSortOrder', sortOrder);
    const sortedDrinks = sortDrinks(filteredDrinks, sortOrder);
    loadDrinkCards(sortedDrinks, currentPage, cardsPerPage);
    createPagination(sortedDrinks.length, cardsPerPage);

    // 현재 상태를 브라우저 히스토리에 저장
    saveState(currentPage, category, sortOrder, filteredDrinks);
  });

  // 카드 리스트 클릭 이벤트 (DOM 위임 방식)
  document.getElementById('drink-card-list').addEventListener('click', function(e) {
    const target = e.target;
    
    // 찜 버튼 클릭 시
    if (target.classList.contains('wishlist-icon')) {
      e.stopPropagation(); // 카드 클릭 이벤트 방지
      const drinkName = target.closest('.card').querySelector('h3').textContent;
      toggleWishlist(drinkName);
      return; // 상세 페이지로 이동 방지
    }
    
    // 카드 클릭 시 상세 페이지로 이동 (찜 버튼 제외)
    const card = target.closest('.card');
    if (card && !target.classList.contains('wishlist-icon')) {
      const drinkName = card.querySelector('h3').textContent;

      // 상세 페이지로 이동하기 전에 현재 상태를 히스토리에 저장
      saveState(currentPage, category, document.getElementById('sort-order').value, filteredDrinks);
      window.location.href = `drink_detail.html?product=${encodeURIComponent(drinkName)}`;
    }
  });

  // 탭 메뉴 클릭 이벤트 수정
  const tabItems = document.querySelectorAll('.tab-item');
  tabItems.forEach(item => {
    item.addEventListener('click', function() {
      const selectedCategory = this.dataset.category || this.textContent.trim(); // dataset 속성 우선 사용
      localStorage.setItem('currentCategory', selectedCategory); // 현재 카테고리 저장
      currentPage = 1; // 카테고리 변경 시 페이지를 첫 페이지로 초기화

      // 모든 탭의 'active' 클래스 제거 후, 현재 탭에 추가
      document.querySelectorAll('.tab-item').forEach(tab => tab.classList.remove('active'));
      this.classList.add('active'); // 클릭된 탭에 'active' 클래스 추가

      // 필터링된 데이터를 업데이트하고 로드
      openCategory(selectedCategory);
      loadDrinkCards(filteredDrinks, currentPage, cardsPerPage);
      createPagination(filteredDrinks.length, cardsPerPage);

      // 현재 상태를 히스토리에 저장
      saveState(currentPage, selectedCategory, document.getElementById('sort-order').value, filteredDrinks);
    });
  });

  // 화면 크기 변화에 따른 카드 뒤집기 재설정
  window.addEventListener('resize', function() {
    loadDrinkCards(filteredDrinks, currentPage, cardsPerPage);
  });
  
  // 뒤로 가기 시 이전 히스토리 상태 복원
  window.addEventListener('popstate', function(event) {
    if (event.state) {
      currentPage = event.state.page || 1;
      filteredDrinks = event.state.filteredDrinks || drinks;
      loadDrinkCards(filteredDrinks, currentPage, cardsPerPage);
      createPagination(filteredDrinks.length, cardsPerPage);
      
      // 저장된 카테고리가 있을 경우 해당 카테고리를 활성화
      if (event.state.category) {
        document.querySelectorAll('.tab-item').forEach(tab => {
          tab.classList.toggle('active', tab.dataset.category === event.state.category);
        });
      }
      
      // 저장된 정렬 순서가 있을 경우 이를 설정
      if (event.state.sortOrder) {
        document.getElementById('sort-order').value = event.state.sortOrder;
        filteredDrinks = sortDrinks(filteredDrinks, event.state.sortOrder);
      }
    }
  });
});

// 사이드바에서 로그인 상태 설정 함수
function setupSidebarLogin() {
  const guestSection = document.getElementById('guest-section');
  const userSection = document.getElementById('user-section');

  if (guestSection && userSection) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn) {
      guestSection.style.display = 'none';
      userSection.style.display = 'flex';
      document.getElementById('user-name').textContent = localStorage.getItem('name');
      document.getElementById('user-email').textContent = localStorage.getItem('email');
    } else {
      guestSection.style.display = 'flex';
      userSection.style.display = 'none';
    }
  } else {
    console.error("사이드바의 'guest-section' 또는 'user-section' 요소가 존재하지 않습니다.");
  }
}

// 로그인 상태 확인 함수
function checkLoginStatus() {
  const guestSection = document.getElementById('guest-section');
  const userSection = document.getElementById('user-section');

  if (guestSection && userSection) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn) {
      guestSection.style.display = 'none';
      userSection.style.display = 'flex';

      document.getElementById('user-name').textContent = localStorage.getItem('name');
      document.getElementById('user-email').textContent = localStorage.getItem('email');
    } else {
      guestSection.style.display = 'flex';
      userSection.style.display = 'none';
    }
  } else {
    console.error("필요한 요소가 존재하지 않습니다. 'guest-section' 또는 'user-section'을 확인하세요.");
  }
}

// 현재 상태를 히스토리에 저장하는 함수
function saveState(page, category, sortOrder, drinks) {
  history.pushState({ page, category, sortOrder, filteredDrinks: drinks }, '', '');
}

// 정렬 함수
function sortDrinks(drinks, order) {
  if (order === 'low-price') {
    return drinks.sort((a, b) => a.price - b.price);
  } else if (order === 'high-price') {
    return drinks.sort((a, b) => b.price - a.price);
  } else {
    return drinks.sort((a, b) => b.rating - a.rating); // 인기순
  }
}

// 데이터 로드 및 카드 리스트 확인
function loadDrinkCards(drinks, page, cardsPerPage) {
  const cardList = document.getElementById('drink-card-list');
  cardList.innerHTML = ''; // 기존 카드 초기화

  const start = (page - 1) * cardsPerPage;
  const end = start + cardsPerPage;
  const paginatedDrinks = drinks.slice(start, end);

  paginatedDrinks.forEach(drink => {
    addDrinkCard(drink);
  });
}

function addDrinkCard(drink) {
  const cardList = document.getElementById('drink-card-list');
  const card = document.createElement('div');
  card.className = 'card';

  const wishlistIcon = wishlist.includes(drink.name)
    ? 'img/icon/heart-icon.png'
    : 'img/icon/heart-bin-icon.png';

  // 카드 앞면과 뒷면 HTML 구조
  let cardContent = `
    <div class="card-front">
      <img src="${drink.image}" alt="${drink.name}">
      <h3>${drink.name}</h3>
      <p class="price">${drink.price}원</p>
      <div class="wishlist-btn">
        <img src="${wishlistIcon}" alt="찜하기" class="wishlist-icon" />
      </div>
    </div>
    <div class="card-back">
      <h3>알코올 도수: ${drink.alcohol}%</h3>
      <p>평점: ${drink.rating} / 5</p>
    </div>
  `;

  card.innerHTML = cardContent;
  cardList.appendChild(card);

  // 모바일이 아닌 경우에만 카드 뒤집기 이벤트 추가
  if (window.innerWidth > 768) {
    let flipTimeout;
    card.addEventListener('mouseenter', function() {
      flipTimeout = setTimeout(() => {
        card.classList.add('flipped');
      }, 1500);
    });

    card.addEventListener('mouseleave', function() {
      clearTimeout(flipTimeout);
      card.classList.remove('flipped');
    });
  }

  // 카드 클릭 시 상세 페이지로 이동
  card.addEventListener('click', function (event) {
    if (!event.target.classList.contains('wishlist-icon')) { // 찜 버튼 제외
      window.location.href = `drink_detail.html?product=${encodeURIComponent(drink.name)}`;
    }
  });
}

// 페이지네이션 생성 함수
function createPagination(totalItems, itemsPerPage) {
  const paginationContainer = document.querySelector('.pagination');
  paginationContainer.innerHTML = '';
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPageGroup = Math.floor((currentPage - 1) / 5) * 5;

  // 맨 처음 페이지로 이동 버튼
  paginationContainer.innerHTML += `<li><a href="#" class="${currentPage === 1 ? 'disabled' : ''}" data-page="1">&laquo;&laquo;</a></li>`;
  paginationContainer.innerHTML += `<li><a href="#" class="${currentPage === 1 ? 'disabled' : ''}" data-page="${currentPage - 1}">&laquo;</a></li>`;

  for (let i = currentPageGroup + 1; i <= Math.min(currentPageGroup + 5, totalPages); i++) {
    paginationContainer.innerHTML += `<li class="${currentPage === i ? 'active' : ''}"><a href="#" data-page="${i}">${i}</a></li>`;
  }

  paginationContainer.innerHTML += `<li><a href="#" class="${currentPage === totalPages ? 'disabled' : ''}" data-page="${currentPage + 1}">&raquo;</a></li>`;
  paginationContainer.innerHTML += `<li><a href="#" class="${currentPage === totalPages ? 'disabled' : ''}" data-page="${totalPages}">&raquo;&raquo;</a></li>`;
}

// 페이지네이션 클릭 이벤트 처리
function handlePaginationClick(e) {
  e.preventDefault();
  const target = e.target;

  if (target.tagName === 'A' && !target.classList.contains('disabled')) {
    const selectedPage = parseInt(target.getAttribute('data-page'), 10);
    if (!isNaN(selectedPage) && selectedPage !== currentPage) {
      currentPage = selectedPage;
      loadDrinkCards(filteredDrinks, currentPage, cardsPerPage);
      createPagination(filteredDrinks.length, cardsPerPage);

      // 현재 상태를 히스토리에 저장
      saveState(currentPage, localStorage.getItem('currentCategory'), document.getElementById('sort-order').value, filteredDrinks);
    }
  }
}

// 페이지네이션 이벤트 리스너 추가
document.querySelector('.pagination').addEventListener('click', handlePaginationClick);

// 찜 리스트에 추가/제거하는 함수
function toggleWishlist(drinkName) {
  if (!checkLoginStatus()) {
      showPopupMessage("로그인 후 이용해주세요.");
      return;
  }

  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  if (wishlist.includes(drinkName)) {
      wishlist = wishlist.filter(item => item !== drinkName);
      showPopupMessage(`${drinkName}가(이) 위시리스트에서 제거되었습니다.`);
  } else {
      wishlist.push(drinkName);
      showPopupMessage(`${drinkName}가(이) 위시리스트에 추가되었습니다.`);
  }
  localStorage.setItem('wishlist', JSON.stringify(wishlist)); // 로컬스토리지 업데이트

  // 특정 카드의 찜 아이콘만 업데이트
  const card = Array.from(document.querySelectorAll('.card')).find(card => card.querySelector('h3').textContent === drinkName);
  if (card) {
      const wishlistIcon = card.querySelector('.wishlist-icon');
      wishlistIcon.src = wishlist.includes(drinkName) ? 'img/icon/heart-icon.png' : 'img/icon/heart-bin-icon.png';
  }
}

// 로그인 여부 확인 함수
function checkLoginStatus() {
  return true; // true로 설정하여 로그인된 상태를 테스트
}

// 팝업 메시지 표시 함수
function showPopupMessage(message) {
  const popup = document.createElement('div');
  popup.classList.add('popup-message');
  popup.textContent = message;
  document.body.appendChild(popup);

  popup.style.display = 'block';
  setTimeout(() => {
    popup.style.display = 'none';
    document.body.removeChild(popup);
  }, 3000);
}

// 카테고리 필터링 함수 수정
function openCategory(category) {
  const drinks = getDrinkData();
  filteredDrinks = category === '전체' ? drinks : drinks.filter(drink => drink.category === category);
  loadDrinkCards(filteredDrinks, currentPage, cardsPerPage);
  createPagination(filteredDrinks.length, cardsPerPage);
}