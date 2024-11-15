document.addEventListener('DOMContentLoaded', function() {
  // header.html을 불러와서 header-container에 삽입
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-container').innerHTML = data;

      // 헤더가 로드된 후 로그인 상태 확인 및 user-icon 클릭 이벤트 설정
      setTimeout(() => {
        checkLoginStatus();
        setupUserIconClick();
      }, 100);  // 100ms 지연 후 호출
    })
    .catch(error => console.log('Header 불러오기 에러:', error));
});

// 로그인 상태 확인 함수
function checkLoginStatus() {
  const guestSection = document.getElementById('guest-section');
  const userSection = document.getElementById('user-section');

  if (guestSection && userSection) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn) {
      guestSection.style.display = 'none';
      userSection.style.display = 'flex';

      // 사용자 정보 설정
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

// user-icon 클릭 시 로그인 상태에 따라 페이지 이동
function setupUserIconClick() {
  const userIcon = document.querySelector('.user-icon a');
  if (userIcon) {
    userIcon.addEventListener('click', function(event) {
      event.preventDefault();  // 기본 링크 동작 방지
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

      if (isLoggedIn) {
        window.location.href = 'mypage.html';  // 로그인 상태일 경우 마이페이지로 이동
      } else {
        window.location.href = 'login.html';   // 로그인 상태가 아닐 경우 로그인 페이지로 이동
      }
    });
  }
}

// 로그아웃 처리
function logout() {
  localStorage.setItem('isLoggedIn', 'false');
  alert("로그아웃되었습니다.");
  window.location.href = 'main.html'; // 로그아웃 후 메인 페이지로 이동
}

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
  document.getElementById("search-message").textContent = "";
  document.getElementById("no-result").style.display = "none";
}

// 검색 유효성 검사 및 결과 처리
function searchProduct() {
  const searchInput = document.getElementById("search-input").value.trim().toLowerCase();
  
  const searchMessage = document.getElementById("search-message");
  const noResult = document.getElementById("no-result");

  if (searchInput === "") {
    searchMessage.textContent = "검색어를 입력해주세요.";
    noResult.style.display = "none";
    return false;
  }

  const drinks = getDrinkData();
  const foundDrink = drinks.find(drink => drink.name.toLowerCase().trim() === searchInput);

  if (foundDrink) {
    window.location.href = `drink_detail.html?product=${encodeURIComponent(foundDrink.name)}`;
  } else {
    searchMessage.textContent = "";
    noResult.style.display = "block";
  }

  return false;
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

// 필터 적용 후 all_food.html로 이동
function applyFoodFilterAndRedirect(category, subCategory = '') {
  let url = `all_food.html?category=${encodeURIComponent(category)}`;
  
  if (subCategory) {
    url += `&subCategory=${encodeURIComponent(subCategory)}`;
  }
  
  window.location.href = url;
}

// 필터 적용 후 all_drinks.html로 이동
function applyDrinkFilterAndRedirect(category, subCategory = '') {
  let url = `all_drinks.html?category=${encodeURIComponent(category)}`;
  
  if (subCategory) {
    url += `&subCategory=${encodeURIComponent(subCategory)}`;
  }
  
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