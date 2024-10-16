// 페이지 로드 시 위시리스트 데이터를 불러와서 표시하는 함수
document.addEventListener('DOMContentLoaded', () => {
  const wishlistContainer = document.getElementById('wishlist-items');
  const emptyMessage = document.getElementById('empty-message');
  const clearWishlistButton = document.getElementById('clear-wishlist');

  // 로컬스토리지에서 위시리스트 데이터를 불러옴
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

  // 위시리스트가 비어있으면 비어있다는 메시지를 보여줌
  if (wishlist.length === 0) {
    emptyMessage.style.display = 'block';
  } else {
    // 위시리스트에 저장된 항목들을 보여줌
    wishlist.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item; // 음식 이름을 목록에 추가
      wishlistContainer.appendChild(li);
    });
  }

  // 초기화 버튼 클릭 시 위시리스트를 비움
  clearWishlistButton.addEventListener('click', () => {
    localStorage.removeItem('wishlist'); // 로컬스토리지에서 데이터 삭제
    wishlistContainer.innerHTML = ''; // 화면에서 항목 삭제
    emptyMessage.style.display = 'block'; // 비어있다는 메시지 다시 표시
  });
});
