// header.html을 불러와서 header-container에 삽입
document.addEventListener('DOMContentLoaded', function() {
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-container').innerHTML = data;

      // 배너 설정은 각 페이지에서 개별적으로 처리
    })
    .catch(error => console.log('Header 불러오기 에러:', error));
});

// 배너 설정 함수 (타이틀, 서브 타이틀, 추가 텍스트)
function setBanner(useBanner, bannerImage, bannerTitle, bannerSubtitle, bannerExtra) {
  const bannerContainer = document.getElementById('banner-container');
  const bannerImg = document.getElementById('banner-img');
  const bannerTitleEl = document.getElementById('banner-title');
  const bannerSubtitleEl = document.getElementById('banner-subtitle');
  const bannerExtraEl = document.getElementById('banner-extra-text');

  if (useBanner) {
    bannerContainer.style.display = 'block';
    bannerImg.src = bannerImage;
    bannerTitleEl.textContent = bannerTitle;
    bannerSubtitleEl.textContent = bannerSubtitle;
    bannerExtraEl.textContent = bannerExtra;
  } else {
    bannerContainer.style.display = 'none';
  }
}

// 검색 오버레이 열기
function openSearch() {
  document.getElementById("search-overlay").style.display = "flex";
}

// 검색 오버레이 닫기
function closeSearch() {
  document.getElementById("search-overlay").style.display = "none";
  document.getElementById("search-message").textContent = ""; // 오류 메시지 초기화
  document.getElementById("no-result").style.display = "none"; // 결과 없음 메시지 숨기기
}

// 검색 유효성 검사 및 결과 처리
function searchProduct() {
  console.log("searchProduct 함수 호출됨");

  const searchInput = document.getElementById("search-input").value.trim().toLowerCase();
  console.log("검색어 입력됨: ", searchInput);
  
  const searchMessage = document.getElementById("search-message"); // 오류 메시지 요소
  const noResult = document.getElementById("no-result"); // 결과 없음 메시지 요소

  // 검색어가 입력되지 않았을 때
  if (searchInput === "") {
    console.log("검색어가 입력되지 않음");
    searchMessage.textContent = "검색어를 입력해주세요."; // 오류 메시지 출력
    noResult.style.display = "none"; // no-result 숨김
    return false; // 폼 제출 막기
  }

  // drink.js에서 데이터 불러오기
  const drinks = getDrinkData(); // drink.js에서 데이터 가져오기

  // 데이터가 제대로 불러와지는지 확인
  console.log("불러온 drinks: ", drinks);

  // 검색어와 음료 데이터에서 일치 확인
  const foundDrink = drinks.find(drink => drink.name.toLowerCase().trim() === searchInput);

  if (foundDrink) {
    console.log("음료가 검색됨: ", foundDrink);
    // 검색된 제품이 있으면 drink_detail.html로 이동하면서 제품명 전달
    window.location.href = `drink_detail.html?product=${encodeURIComponent(foundDrink.name)}`;
  } else {
    console.log("검색 결과 없음");
    searchMessage.textContent = ""; // 검색어 입력 메시지 초기화
    noResult.style.display = "block"; // no-result 표시
  }

  return false; // 폼 제출 막기
}

  document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus(); // 로그인 상태 확인
});

// 로그인 상태 확인 함수
function checkLoginStatus() {
  const guestSection = document.getElementById('guest-section');
  const userSection = document.getElementById('user-section');

  if (guestSection && userSection) {  // 요소가 존재하는지 확인
    const isLoggedIn = true;  // 예시로 로그인 상태를 항상 true로 설정
    if (isLoggedIn) {
      guestSection.style.display = 'none';
      userSection.style.display = 'flex';

      // 사용자 정보 설정 (예시)
      document.getElementById('user-name').textContent = '임수현';
      document.getElementById('user-email').textContent = 'eoehtjrhks06@naver.com';
    } else {
      guestSection.style.display = 'flex';
      userSection.style.display = 'none';
    }
  } else {
    console.error("필요한 요소가 존재하지 않습니다. 'guest-section' 또는 'user-section'을 확인하세요.");
  }
}

// 드롭다운 메뉴 보이기/숨기기
function toggleUserMenu() {
    const userMenu = document.getElementById('user-menu');
    userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
}

// 외부 클릭 시 드롭다운 메뉴 닫기
document.addEventListener('click', function(event) {
    const userMenu = document.getElementById('user-menu');
    const menuDotsIcon = document.querySelector('.menu-dots-icon');
    if (!menuDotsIcon.contains(event.target)) {
        userMenu.style.display = 'none';
    }
});

// 로그아웃 처리
function logout() {
    alert("로그아웃되었습니다.");
    document.getElementById('guest-section').style.display = 'flex';
    document.getElementById('user-section').style.display = 'none';
}


// 사이드바 열기/닫기
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('show');
}

// 서브메뉴 열기/닫기
function toggleSubMenu(submenuId, toggleBtn) {
    const submenu = document.getElementById(submenuId);
    const icon = toggleBtn.querySelector('img');
    submenu.classList.toggle('open');
    icon.classList.toggle('rotate-up');
}

// 필터 적용 후 all_food.html로 이동 (카테고리와 서브카테고리 모두 적용)
function applyFoodFilterAndRedirect(category, subCategory = '') {
  let url = `all_food.html?category=${encodeURIComponent(category)}`;
  
  // 서브카테고리가 있으면 URL에 추가
  if (subCategory) {
      url += `&subCategory=${encodeURIComponent(subCategory)}`;
  }
  
  // 필터가 적용된 URL로 이동
  window.location.href = url;
}
// 필터 적용 후 all_drinks.html로 이동 (카테고리와 서브카테고리 모두 적용)
function applyDrinkFilterAndRedirect(category, subCategory = '') {
  let url = `all_drinks.html?category=${encodeURIComponent(category)}`;
  
  // 서브카테고리가 있으면 URL에 추가
  if (subCategory) {
      url += `&subCategory=${encodeURIComponent(subCategory)}`;
  }
  
  // 필터가 적용된 URL로 이동
  window.location.href = url;
}
// 필터 적용 후 all_food.html로 이동 (카테고리와 서브카테고리 모두 적용)
function applyFoodFilterAndRedirect(category, subCategory = '') {
  let url = `all_food.html?category=${encodeURIComponent(category)}`;
  
  // 서브카테고리가 있으면 URL에 추가
  if (subCategory) {
      url += `&subCategory=${encodeURIComponent(subCategory)}`;
  }
  
  // 필터가 적용된 URL로 이동
  window.location.href = url;
}


// 드롭다운 메뉴 보이기/숨기기
function toggleDropdownMenu() {
    const dropdownMenu = document.getElementById('dropdown-menu');
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
}

// 외부 클릭 시 드롭다운 닫기
document.addEventListener('click', function(event) {
    const dropdownMenu = document.getElementById('dropdown-menu');
    const menuDotsIcon = document.querySelector('.menu-dots-icon');
    if (!menuDotsIcon.contains(event.target)) {
        dropdownMenu.style.display = 'none';
    }
});

function simulateLogin() {
    // 시뮬레이션으로 로그인 상태 전환
    document.getElementById('guest-section').style.display = 'none';
    document.getElementById('user-section').style.display = 'flex';

    // 사용자 정보 설정 (예시)
    document.getElementById('user-name').textContent = '임수현';  // 예시 사용자 이름
    document.getElementById('user-email').textContent = 'eoehtjrhks06@naver.com';  // 예시 사용자 이메일
}
