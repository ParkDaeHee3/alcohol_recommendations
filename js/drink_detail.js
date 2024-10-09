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

    console.log("URL에서 전달된 product 파라미터:", productName);  // 파라미터 확인을 위한 로그 출력

    if (productName) {
        // 해당 이름의 제품 찾기
        const product = drinks.find(drink => drink.name === productName);

        console.log("찾은 제품 데이터:", product);  // 제품 데이터 확인을 위한 로그 출력

        if (product) {
            // 브레드크럼 업데이트
        document.getElementById('main-category-link').href = `all_drinks.html?category=${product.category}&subCategory=all`;
        document.getElementById('main-category-link').textContent = product.category;
        
        document.getElementById('sub-category-link').href = `all_drinks.html?category=${product.category}&subCategory=${product.subCategory}`;
        document.getElementById('sub-category-link').textContent = product.subCategory;

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
        } else {
            console.error('해당 제품을 찾을 수 없습니다.');
        }
    } else {
        console.error('URL 파라미터에서 제품 이름을 가져올 수 없습니다.');
    }
});

