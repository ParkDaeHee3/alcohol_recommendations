document.addEventListener('DOMContentLoaded', function() {
    // Header 불러오기
    fetch('header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-container').innerHTML = data;
   
      // 구분선 숨기기
      const divider = document.querySelector('.divider');
      if (divider) {
        divider.style.display = 'none'; // popultar.html에서는 구분선 숨기기
      }
    })
    .catch(error => console.log('Header 불러오기 에러:', error));
   
     const drinks = getDrinkData(); // drink.js에서 술 데이터를 가져옴
   
     // 평점 랭킹에 따라 리스트 정렬 및 표시
     function displayRatingRanking() {
       const sortedDrinks = drinks
         .filter(drink => drink.rating >= 4.5) // 평점이 4.5 이상인 술만 필터링
         .sort((a, b) => b.rating - a.rating); // 평점 높은 순서대로 정렬
   
       displayTopThree(sortedDrinks);
       displayOtherDrinks(sortedDrinks.slice(3, 50)); // 4위부터 50위까지
     }
   
     // 찜 랭킹에 따라 리스트 정렬 및 표시
     function displayWishlistRanking() {
       const sortedDrinks = drinks
         .sort((a, b) => b.wishlistCount - a.wishlistCount); // 찜 개수 많은 순서대로 정렬
   
       displayTopThree(sortedDrinks);
       displayOtherDrinks(sortedDrinks.slice(3, 50)); // 4위부터 50위까지
     }
   
     // 1위~3위 표시
     function displayTopThree(drinks) {
       const topThreeContainer = document.querySelector('.ranking-content.active .top-three-container');
       topThreeContainer.innerHTML = `
         <div class="top-rank-card">${createCardHTML(drinks[0], 1)}</div>
         <div class="top-rank-card">${createCardHTML(drinks[1], 2)}</div>
         <div class="top-rank-card">${createCardHTML(drinks[2], 3)}</div>
       `;
     }
   
     // 4위~20위 표시
     function displayOtherDrinks(drinks) {
       const otherDrinksContainer = document.querySelector('.ranking-content.active .other-drinks-container');
       const productGrid = document.createElement('div');
       productGrid.classList.add('product-grid');
       
       drinks.forEach((drink, index) => {
         const productCard = document.createElement('div');
         productCard.classList.add('product-card');
         productCard.innerHTML = createCardHTML(drink, index + 4); // 4위부터 순위 지정
         productGrid.appendChild(productCard);
       });
   
       otherDrinksContainer.innerHTML = '';
       otherDrinksContainer.appendChild(productGrid);
     }
   
     // 카드 HTML 생성 함수
   function createCardHTML(drink, rank) {
     let rankBadge = '';
     if (rank === 1) {
         rankBadge = `<img src="img/icon/first-rank-icon.png" alt="1위 아이콘" class="first-rank-icon">`;
     } else if (rank === 2) {
         rankBadge = `<img src="img/icon/second-rank-icon.png" alt="2위 아이콘" class="second-rank-icon">`;
     } else if (rank === 3) {
         rankBadge = `<img src="img/icon/third-rank-icon.png" alt="3위 아이콘" class="third-rank-icon">`;
     } else {
         rankBadge = `<div class="rank-badge">${rank}위</div>`;
     }
   
     // 카드 클릭 시 상세 페이지로 이동할 수 있도록 a 태그로 감싸줌
   return `
   <a href="drink_detail.html?product=${encodeURIComponent(drink.name)}" class="drink-card-link">
     ${rankBadge}
     <img src="${drink.image}" alt="${drink.name}">
     <div class="product-info">
         <h3 class="product-name">${drink.name}</h3>
         <p class="product-price">${drink.price.toLocaleString()}원</p>
     </div>
   </a>
   `;
   }
   
     // 탭 버튼 클릭 이벤트
     const tabButtons = document.querySelectorAll('.tab-button');
     tabButtons.forEach(button => {
       button.addEventListener('click', function () {
         tabButtons.forEach(btn => btn.classList.remove('active'));
         button.classList.add('active');
   
         const target = button.dataset.target;
         document.querySelectorAll('.ranking-content').forEach(content => content.classList.remove('active'));
         document.getElementById(target).classList.add('active');
   
         if (target === 'rating-rank') {
           displayRatingRanking();
         } else if (target === 'wish-rank') {
           displayWishlistRanking();
         }
       });
     });
   
     // 초기 로드 시 평점 랭킹 표시
     displayRatingRanking();
   });
   