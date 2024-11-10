document.addEventListener('DOMContentLoaded', function() {
  // Header 불러오기
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-container').innerHTML = data;

      // 구분선 숨기기
      const divider = document.querySelector('.divider');
      if (divider) {
        divider.style.display = 'none'; // drink_detail.html에서는 구분선 숨기기
      }
    })
    .catch(error => console.log('Header 불러오기 에러:', error));

  // drink.js에서 데이터 불러오기
  const drinks = getDrinkData();  // 모든 술 데이터 가져오기

  // URL에서 파라미터로 넘어온 술 이름 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const productName = urlParams.get('product');  // 'product' 파라미터에서 술 이름 가져오기

  if (productName) {
      // 해당 이름의 제품 찾기
      const product = drinks.find(drink => drink.name === productName);

      if (product) {
          // 브레드크럼 업데이트 (카테고리 페이지로 이동할 수 있도록 링크 수정)
          document.getElementById('main-category-link').href = `all_drinks.html?category=${encodeURIComponent(product.category)}`;
          document.getElementById('main-category-link').textContent = product.category;
      
          document.getElementById('product-name-link').textContent = product.name;

          // 상품 상세 정보 업데이트
          document.getElementById('product-name').textContent = product.name;
          document.getElementById('product-type').textContent = product.type;
          document.getElementById('product-origin').textContent = product.origin;
          document.getElementById('product-abv').textContent = `${product.alcohol}%`;
          document.getElementById('product-description').textContent = product.description;
          document.getElementById('product-flavor').textContent = product.tasteDescription;
          document.getElementById('product-price').textContent = `${product.price}원`;
          document.getElementById('product-rating').textContent = product.rating.toFixed(1);

          // 상품 이미지 업데이트
          const productImage = document.getElementById('product-image');
          productImage.innerHTML = `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: auto;">`;

          // 동일한 서브카테리의 추천 제품을 랜덤으로 로드
          const similarDrinks = shuffleArray(
          drinks.filter(drink => 
          drink.subCategory === product.subCategory && // 서브카테고리 조건만 확인
          drink.name !== product.name
          )
          ).slice(0, 5);
          loadSimilarProducts(similarDrinks);
        
          // 찜 버튼 설정 및 상태 연동
          const wishlistBtn = document.getElementById('wishlist-btn');
          const wishlistIcon = document.getElementById('wishlist-icon');
          let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

          if (wishlist.includes(product.name)) {
              wishlistIcon.src = 'img/icon/heart-icon.png'; // 찜 아이콘 채우기
          }

          wishlistBtn.addEventListener('click', function(event) {
              event.stopPropagation(); // 기본 동작 중지

              if (!checkLoginStatus()) {
                  showPopupMessage('로그인 후 눌러주세요.');
                  return;
              }

              if (wishlist.includes(product.name)) {
                  wishlist = wishlist.filter(item => item !== product.name);
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

// 비슷한 상품 추천 카드 표시 함수
function loadSimilarProducts(similarDrinks) {
  const similarList = document.getElementById('similar-products-container');
  similarList.style.display = 'flex'; // 가로 정렬 설정
  similarList.style.overflowX = 'auto'; // 가로 스크롤 가능하도록 설정
  similarList.style.gap = '20px'; // 카드 간격 설정
  similarList.innerHTML = ''; // 기존 콘텐츠 초기화

  similarDrinks.forEach(drink => {
    const card = document.createElement('div');
    card.classList.add('similar-product-card');
    card.innerHTML = `
      <img src="${drink.image}" alt="${drink.name}">
      <p><strong>${drink.name}</strong></p> <!-- 이름을 굵게 표시 -->
    `;
    card.addEventListener('click', () => {
      window.location.href = `drink_detail.html?product=${encodeURIComponent(drink.name)}`;
    });
    similarList.appendChild(card);
  });
}

// 배열을 무작위로 섞는 함수
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // 요소 위치를 교환
  }
  return array;
}

// 팝업 메시지 표시 함수 (화면 상단에 팝업 표시)
function showPopupMessage(message) {
  const popup = document.getElementById('wishlist-message');
  popup.textContent = message;
  popup.style.display = 'block';
  setTimeout(() => {
      popup.style.display = 'none';
  }, 2000); // 2초 후에 팝업 메시지를 숨김
}

// 로그인 상태 확인 함수
function checkLoginStatus() {
  // 로그인 상태를 확인하는 로직
  return true; // 로그인 상태 테스트
}
