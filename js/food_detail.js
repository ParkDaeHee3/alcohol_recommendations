document.addEventListener('DOMContentLoaded', function() {
    // Header 불러오기
    fetch('header.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('header-container').innerHTML = data;

   // 헤더 로드 후 로그인 상태 확인 및 사이드바 설정
   setTimeout(() => {
    checkLoginStatus();
    setupSidebarLogin();
  }, 0);


        // 구분선 숨기기
        const divider = document.querySelector('.divider');
        if (divider) {
          divider.style.display = 'none'; // food_detail.html에서는 구분선 숨기기
        }
      })
      .catch(error => console.log('Header 불러오기 에러:', error));

    // food.js에서 데이터 불러오기
    const food = getFoodData();  // 모든 음식 데이터 가져오기

    // URL에서 파라미터로 넘어온 술 이름 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('product');  // 'product' 파라미터에서 술 이름 가져오기

    if (productName) {
        // 해당 이름의 제품 찾기
        const product = food.find(food => food.name === productName);

        if (product) {
            // 브레드크럼 업데이트
        document.getElementById('main-category-link').href = `all_food.html?category=${encodeURIComponent(
          product.category
        )}`;
        document.getElementById('main-category-link').textContent = product.category;
        
        document.getElementById('product-name-link').textContent = product.name;

            // 상품 상세 정보 업데이트
            document.getElementById('product-name').textContent = product.name;
            document.getElementById('product-type').textContent = product.type;
            document.getElementById('product-origin').textContent = product.origin;
            document.getElementById('product-abv').textContent = product.ingredients;
            document.getElementById('product-description').textContent = product.description;
            document.getElementById('product-flavor').textContent = product.tasteDescription;
            document.getElementById('product-price').textContent = `${product.price}원`;
            document.getElementById('product-rating').textContent = product.rating.toFixed(1);

            // 상품 이미지 업데이트
            const productImage = document.getElementById('product-image');
            productImage.innerHTML = `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: auto;">`;
        


      // 찜 버튼 설정 및 상태 연동
      const wishlistBtn = document.getElementById('wishlist-btn');
      const wishlistIcon = document.getElementById('wishlist-icon');
      let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

      if (wishlist.includes(product.name)) {
        wishlistIcon.src = 'img/icon/heart-icon.png'; // 찜 아이콘 채우기
      }

      wishlistBtn.addEventListener('click', function (event) {
        event.stopPropagation(); // 기본 동작 중지

        if (!checkLoginStatus()) {
          showPopupMessage('로그인 후 눌러주세요.');
          return;
        }

        if (wishlist.includes(product.name)) {
          wishlist = wishlist.filter((item) => item !== product.name);
          wishlistIcon.src = 'img/icon/heart-bin-icon.png'; // 찜 아이콘 비우기
          showPopupMessage(`${product.name}이(가) 위시리스트에서 삭제되었습니다.`);
        } else {
          wishlist.push(product.name);
          wishlistIcon.src = 'img/icon/heart-icon.png'; // 찜 아이콘 채우기
          showPopupMessage(`${product.name}이(가) 위시리스트에 추가되었습니다.`);
        }

        localStorage.setItem('wishlist', JSON.stringify(wishlist));
      });
    } else {
      console.error('해당 제품을 찾을 수 없습니다.');
    }
  } else {
    console.error('URL 파라미터에서 제품 이름을 가져올 수 없습니다.');
  }
});

// 배열을 무작위로 섞는 함수
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // 요소 위치를 교환
  }
  return array;
}


// 팝업 메시지 표시 함수
function showPopupMessage(message) {
  const popup = document.getElementById('wishlist-message');
  popup.textContent = message;
  popup.style.display = 'block';
  setTimeout(() => {
    popup.style.display = 'none';
  }, 2000);
}

// 로그인 상태 확인 함수
function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return isLoggedIn;
}

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
