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
            'img/banner/all_food-banner.gif', 
            'Tastify의 음식 추천 페이지.', 
            '다양한 음식 찾기 및 검색 기능', 
            '카드에 포인터를 올려보세요.'
          );
        }, 0); // header가 로드된 직후 배너 설정
      })
      .catch(error => console.log('Header 불러오기 에러:', error));
  
    // 카드 리스트 및 페이지네이션 로드
    let currentPage = 1;
    const cardsPerPage = 48; // 12줄, 4개씩
    const food = getFoodData();
    loadFoodCards(food, currentPage, cardsPerPage);
  
    // 정렬 기준 변경 시
    document.getElementById('sort-order').addEventListener('change', function() {
      const sortOrder = this.value;
      const sortedFood = sortFood(food, sortOrder);
      loadFoodCards(sortedFood, currentPage, cardsPerPage);
    });
  
    // 페이지네이션 이벤트
    document.getElementById('prev-page').addEventListener('click', function() {
      if (currentPage > 1) {
        currentPage--;
        loadFoodCards(food, currentPage, cardsPerPage);
      }
    });
  
    document.getElementById('next-page').addEventListener('click', function() {
      const maxPage = Math.ceil(food.length / cardsPerPage);
      if (currentPage < maxPage) {
        currentPage++;
        loadFoodCards(food, currentPage, cardsPerPage);
      }
    });
  });
  
  // 정렬 함수
  function sortfood(food, order) {
    if (order === 'low-price') {
      return food.sort((a, b) => a.price - b.price);
    } else if (order === 'high-price') {
      return food.sort((a, b) => b.price - a.price);
    } else {
      // 인기순: 평점 기준 내림차순
      return food.sort((a, b) => b.rating - a.rating);
    }
  }

// 데이터 로드 및 카드 리스트 확인
function loadFoodCards(food, page, cardsPerPage) {
    console.log("loadFoodCards 실행됨"); // 함수가 실행되는지 확인
    console.log(food); // 로드된 데이터가 제대로 가져와졌는지 확인
  
    const cardList = document.getElementById('food-card-list');
    cardList.innerHTML = ''; // 기존 카드 초기화
  
    const start = (page - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    const paginatedfood = food.slice(start, end);
  
    paginatedfood.forEach(food => {
      console.log(food); // 각 카드의 데이터가 제대로 넘어오는지 확인
      addFoodCard(food);
    });
  
    document.getElementById('current-page').textContent = page;
  }

 // 카드 리스트에 제품을 동적으로 추가하는 함수
function addFoodCard(food) {
  const cardList = document.getElementById('food-card-list');
  const card = document.createElement('div');
  card.className = 'card';

  const isLoggedIn = checkLoginStatus();
  const wishlistIcon = isLoggedIn ? 'img/icon/heart-bin-icon.png' : 'img/icon/heart-bin-icon.png';

  // 카드 앞면 HTML 구조
  const cardFront = `
    <div class="card-front">
      <img src="${food.image}" alt="${food.name}">
      <h3>${food.name}</h3>
      <p class="price">${food.price}원</p>
      <div class="wishlist-btn">
        <img src="${wishlistIcon}" alt="찜하기" class="wishlist-icon" />
      </div>
    </div>
  `;

  // 카드 뒷면 HTML 구조 (회색 배경에 알코올 도수와 평점 표시)
  const cardBack = `
    <div class="card-back">
      <h3>음식 재료: ${food.ingredients}</h3>
      <p>평점: ${food.rating} / 5</p>
    </div>
  `;

  card.innerHTML = cardFront + cardBack;

  // 1.5초 동안 포인터가 머물렀을 때 카드 뒤집기
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

  // 카드 클릭 시 해당 술의 상세 페이지로 이동
card.addEventListener('click', function () {
  window.location.href = `food_detail.html?product=${encodeURIComponent(food.name)}`;
});

  cardList.appendChild(card);

  // 찜 버튼 이벤트 처리 (클릭 시 상세 페이지로 이동하는 것을 방지)
  const wishlistBtn = card.querySelector('.wishlist-btn img');
  wishlistBtn.addEventListener('click', function (event) {
    event.stopPropagation();  // 찜 버튼 클릭 시 카드 이동 이벤트 중지

    if (!isLoggedIn) {
      showPopupMessage('로그인 후 눌러주세요.');
      return;
    }

    if (wishlistBtn.src.includes('heart-bin-icon')) {
      wishlistBtn.src = 'img/icon/heart-icon.png'; // 찜 상태로 변경
      showPopupMessage('위시리스트에 등록되었습니다.');
    } else {
      wishlistBtn.src = 'img/icon/heart-bin-icon.png'; // 찜 취소 상태로 변경
      showPopupMessage('위시리스트에서 삭제되었습니다.');
    }
  });
}

// 팝업 메시지를 표시하는 함수
function showPopupMessage(message) {
  const popup = document.getElementById('popup-message');
  popup.textContent = message;
  popup.style.display = 'block';
  
  setTimeout(() => {
    popup.style.display = 'none';
  }, 2000); // 2초 후에 팝업 메시지를 숨김
}

// URL 파라미터에서 카테고리 및 서브카테고리 정보를 가져와 필터링
document.addEventListener('DOMContentLoaded', function() {
  // URL 파라미터에서 category와 subCategory 값 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');
  const subCategory = urlParams.get('subCategory');
  
  // 파라미터 확인
  console.log("카테고리:", category);
  console.log("서브 카테고리:", subCategory);

  // 데이터 가져오기
  const food = getFoodData();

  // 카테고리와 서브 카테고리에 맞는 데이터 필터링
  let filteredfood = food;

if (category && subCategory) {
    if (subCategory.toLowerCase() === 'all') {
        // 서브카테고리가 'all'이면 카테고리만 필터링
        filteredfood = food.filter(food => 
            food.category.toLowerCase() === category.toLowerCase()
        );
    } else {
        // 카테고리와 서브카테고리 모두 필터링
        filteredfood = food.filter(food => 
            food.category.toLowerCase() === category.toLowerCase() && 
            food.subCategory.toLowerCase() === subCategory.toLowerCase()
        );
    }
} else if (category) {
    // 카테고리만 있을 때
    filteredfood = food.filter(food => 
        food.category.toLowerCase() === category.toLowerCase()
    );
}

console.log("필터링된 결과:", filteredfood);


  // 필터링된 데이터를 카드 형태로 표시
  loadFoodCards(filteredfood, 1, 48);
  
});

  // 페이지네이션 및 정렬 처리 (기존 코드 유지)
  const currentPage = 1;
  const cardsPerPage = 48;
  
  document.getElementById('sort-order').addEventListener('change', function() {
      const sortOrder = this.value;
      const sortedFood = sortfood(filteredfood, sortOrder);
      loadFoodCards(sortedFood, currentPage, cardsPerPage);
  });

// 정렬 함수
function sortfood(food, order) {
  if (order === 'low-price') {
      return food.sort((a, b) => a.price - b.price);
  } else if (order === 'high-price') {
      return food.sort((a, b) => b.price - a.price);
  } else {
      return food.sort((a, b) => b.rating - a.rating);
  }
}

// 카드를 로드하는 함수 (기존 코드 그대로 사용)
function loadFoodCards(food, page, cardsPerPage) {
  const cardList = document.getElementById('food-card-list');
  cardList.innerHTML = ''; // 기존 카드 초기화

  const start = (page - 1) * cardsPerPage;
  const end = start + cardsPerPage;
  const paginatedfood = food.slice(start, end);

  paginatedfood.forEach(food => {
      addFoodCard(food); // 카드 추가
  });

  document.getElementById('current-page').textContent = page;
}

// 로그인 여부 확인 (임의로 false로 설정)
function checkLoginStatus() {
  // 실제 로그인 상태 확인 로직을 넣으세요. 지금은 테스트로 false 리턴
  return true; // 로그아웃 상태, true일 경우 로그인 상태
}