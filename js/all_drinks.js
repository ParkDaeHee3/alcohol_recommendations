let filteredDrinks = []; // 현재 필터링된 데이터를 저장

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
            'Tastify의 술 검색 페이지.', 
            '다양한 술 찾기 및 검색 기능', 
            '카드에 포인터를 올려보세요.'
          );
        }, 0); // header가 로드된 직후 배너 설정
      })
      .catch(error => console.log('Header 불러오기 에러:', error));
  
    // 카드 리스트 및 페이지네이션 로드
    let currentPage = 1;
    const cardsPerPage = 48; // 12줄, 4개씩
    const drinks = getDrinkData();
    filteredDrinks = drinks; // 전체 데이터로 초기화
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
});

// 정렬 함수
function sortDrinks(drinks, order) {
  if (order === 'low-price') {
      return drinks.sort((a, b) => a.price - b.price);
  } else if (order === 'high-price') {
      return drinks.sort((a, b) => b.price - a.price);
  } else {
      // 인기순: 평점 기준 내림차순
      return drinks.sort((a, b) => b.rating - a.rating);
  }
}

// 데이터 로드 및 카드 리스트 확인
function loadDrinkCards(drinks, page, cardsPerPage) {
    console.log("loadDrinkCards 실행됨");
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

// 카드 추가 함수
function addDrinkCard(drink) {
  const cardList = document.getElementById('drink-card-list');
  const card = document.createElement('div');
  card.className = 'card';

  const isLoggedIn = checkLoginStatus();
  const wishlistIcon = isLoggedIn ? 'img/icon/heart-bin-icon.png' : 'img/icon/heart-bin-icon.png';

  // 카드 앞면 HTML
  const cardFront = `
    <div class="card-front">
      <img src="${drink.image}" alt="${drink.name}">
      <h3>${drink.name}</h3>
      <p class="price">${drink.price}원</p>
      <div class="wishlist-btn">
        <img src="${wishlistIcon}" alt="찜하기" class="wishlist-icon" />
      </div>
    </div>
  `;

  // 카드 뒷면 HTML
  const cardBack = `
    <div class="card-back">
      <h3>알코올 도수: ${drink.alcohol}%</h3>
      <p>평점: ${drink.rating} / 5</p>
    </div>
  `;

  card.innerHTML = cardFront + cardBack;

  // 카드 뒤집기 효과
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

  card.addEventListener('click', function () {
    window.location.href = `drink_detail.html?product=${encodeURIComponent(drink.name)}`;
  });

  cardList.appendChild(card);
}

// URL 파라미터에서 카테고리 및 서브카테고리 정보를 가져와 필터링
document.addEventListener('DOMContentLoaded', function() {
  // URL 파라미터에서 category와 subCategory 값 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');
  const subCategory = urlParams.get('subCategory');
  
  // 데이터 가져오기
  const drinks = getDrinkData();
  filteredDrinks = drinks; // 기본적으로 전체 데이터를 사용

  // 카테고리와 서브카테고리에 맞는 데이터 필터링
  if (category && subCategory) {
    if (subCategory.toLowerCase() === 'all') {
        filteredDrinks = drinks.filter(drink => 
            drink.category.toLowerCase() === category.toLowerCase()
        );
    } else {
        filteredDrinks = drinks.filter(drink => 
            drink.category.toLowerCase() === category.toLowerCase() && 
            drink.subCategory.toLowerCase() === subCategory.toLowerCase()
        );
    }
  } else if (category) {
    filteredDrinks = drinks.filter(drink => 
        drink.category.toLowerCase() === category.toLowerCase()
    );
  }

  // 필터링된 데이터를 카드 리스트에 로드
  loadDrinkCards(filteredDrinks, 1, 48);
});

// 상위 카테고리 클릭 시
function openCategory(evt, category) {
  const drinks = getDrinkData(); // 전체 데이터를 가져옴
  filteredDrinks = drinks.filter(drink => drink.category === category);
  loadDrinkCards(filteredDrinks, 1, 48);
}

// 하위 카테고리 클릭 시
function filterBySubCategory(category, subCategory) {
  const drinks = getDrinkData(); // 전체 데이터를 가져옴
  filteredDrinks = drinks.filter(drink => 
    drink.category === category && drink.subCategory === subCategory
  );
  loadDrinkCards(filteredDrinks, 1, 48);
}

// 로그인 여부 확인 함수
function checkLoginStatus() {
  return true; // 테스트로 true 리턴
}

// 기타 기능 (카테고리 표시, 하위 카테고리 유지 등)
let showSubCategoryTimeout;

function showSubCategoryWithDelay(category) {
  showSubCategoryTimeout = setTimeout(function() {
    document.getElementById(`${category}-sub`).style.display = 'block';
  }, 500);
}

function hideSubCategory(category) {
  clearTimeout(showSubCategoryTimeout);
  document.getElementById(`${category}-sub`).style.display = 'none';
}

function keepSubCategoryVisible(category) {
  clearTimeout(showSubCategoryTimeout);
  document.getElementById(`${category}-sub`).style.display = 'block';
}

