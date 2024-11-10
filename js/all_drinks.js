let filteredDrinks = []; // 현재 필터링된 데이터를 저장
let wishlist = []; // 찜 목록을 저장

document.addEventListener('DOMContentLoaded', function() {
  // Header 불러오기
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-container').innerHTML = data;

      // 배너 설정이 header.html이 로드된 후에 실행되도록 보장
      setTimeout(() => {
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

  // URL에서 카테고리 파라미터 확인
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');

  let currentPage = 1;
  const cardsPerPage = 32;
  const drinks = getDrinkData();

  if (category) {
      console.log("URL에서 받은 카테고리:", category);
      filteredDrinks = drinks.filter(drink => drink.category === category);
  } else {
      filteredDrinks = drinks;
  }
  loadDrinkCards(filteredDrinks, currentPage, cardsPerPage);

  // 정렬 기준 변경 시
  document.getElementById('sort-order').addEventListener('change', function() {
    const sortOrder = this.value;
    const sortedDrinks = sortDrinks(filteredDrinks, sortOrder);
    loadDrinkCards(sortedDrinks, currentPage, cardsPerPage);
  });

  // 페이지네이션 이벤트
  document.getElementById('prev-page').addEventListener('click', function() {
    if (currentPage > 1) {
      currentPage--;
      loadDrinkCards(filteredDrinks, currentPage, cardsPerPage);
    }
  });

  document.getElementById('next-page').addEventListener('click', function() {
    const maxPage = Math.ceil(filteredDrinks.length / cardsPerPage);
    if (currentPage < maxPage) {
      currentPage++;
      loadDrinkCards(filteredDrinks, currentPage, cardsPerPage);
    }
  });

  // 카드 리스트 클릭 이벤트 (DOM 위임 방식)
  document.getElementById('drink-card-list').addEventListener('click', function(e) {
    const target = e.target;
    
    // 찜 버튼 클릭 시
    if (target.classList.contains('wishlist-icon')) {
      e.stopPropagation(); // 카드 클릭 이벤트 방지
      const drinkName = target.closest('.card').querySelector('h3').textContent;
      toggleWishlist(drinkName);
      return;
    }
    
    // 카드 클릭 시 상세 페이지로 이동 (목록형 및 PC형 둘 다)
    const card = target.closest('.card');
    if (card) {
      const drinkName = card.querySelector('h3').textContent;
      window.location.href = `drink_detail.html?product=${encodeURIComponent(drinkName)}`;
    }
  });

  // 탭 메뉴 클릭 이벤트 수정
const tabItems = document.querySelectorAll('.tab-item');
tabItems.forEach(item => {
  item.addEventListener('click', function() {
    const selectedCategory = this.dataset.category || this.textContent.trim(); // dataset 속성 우선 사용
    currentPage = 1; // 새로운 카테고리 클릭 시 페이지를 첫 페이지로 초기화

    // 모든 탭의 'active' 클래스 제거 후, 현재 탭에 추가
    document.querySelectorAll('.tab-item').forEach(tab => tab.classList.remove('active'));
    this.classList.add('active'); // 클릭된 탭에 'active' 클래스 추가

    // 필터링된 데이터를 업데이트하고 로드
    openCategory(selectedCategory);
    loadDrinkCards(filteredDrinks, currentPage, cardsPerPage); // 탭 클릭 시 바로 카드 로드
  });
});

  // 화면 크기 변화에 따른 카드 뒤집기 재설정
  window.addEventListener('resize', function() {
    loadDrinkCards(filteredDrinks, currentPage, cardsPerPage);
  });
});

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

document.getElementById('current-page').textContent = page;
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
card.addEventListener('click', function () {
  window.location.href = `drink_detail.html?product=${encodeURIComponent(drink.name)}`;
});
}

// 찜 리스트에 추가/제거하는 함수
function toggleWishlist(drinkName) {
if (!checkLoginStatus()) {
  showPopupMessage("로그인 후 이용해주세요.");
  return;
}

if (wishlist.includes(drinkName)) {
  wishlist = wishlist.filter(item => item !== drinkName);
  showPopupMessage(`${drinkName}가(이) 위시리스트에서 제거되었습니다.`);
} else {
  wishlist.push(drinkName);
  showPopupMessage(`${drinkName}가(이) 위시리스트에 추가되었습니다.`);
}

loadDrinkCards(filteredDrinks, 1, 32); // 찜 상태를 다시 로드
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
  console.log("선택된 카테고리:", category);
  if (category === '전체') {
    filteredDrinks = drinks;
  } else {
    filteredDrinks = drinks.filter(drink => drink.category === category);
  }
  console.log("필터링된 데이터:", filteredDrinks);
}

