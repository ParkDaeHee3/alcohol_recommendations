// 위시리스트 하트를 클릭 시 해당 제품을 로컬스토리지에 저장하는 기능
document.addEventListener('DOMContentLoaded', () => {
    const wishlistButtons = document.querySelectorAll('.wishlist-button'); // 위시리스트 버튼 선택
  
    wishlistButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const productName = e.target.dataset.productName; // 버튼에 연결된 제품명
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || []; // 로컬스토리지에서 위시리스트 불러옴
  
        // 위시리스트에 중복된 항목이 없으면 추가
        if (!wishlist.includes(productName)) {
          wishlist.push(productName);
          localStorage.setItem('wishlist', JSON.stringify(wishlist)); // 로컬스토리지에 저장
          alert(`${productName}가 위시리스트에 추가되었습니다.`);
        } else {
          alert(`${productName}는 이미 위시리스트에 있습니다.`);
        }
      });
    });
  });
  