document.addEventListener('DOMContentLoaded', () => {
  const wishlistContainer = document.getElementById('wishlist-items');
  const emptyMessage = document.getElementById('empty-message');
  const clearButton = document.getElementById('clear-wishlist'); // 초기화 버튼 선택

  // 로컬스토리지에서 위시리스트 데이터를 불러옴
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

  // 위시리스트가 비어있으면 비어있다는 메시지를 보여줌
  if (wishlist.length === 0) {
    emptyMessage.style.display = 'block';
  } else {
    renderWishlist(); // 초기 렌더링
  }

  // 초기화 버튼 클릭 시 모든 항목 제거
  clearButton.addEventListener('click', () => {
    localStorage.removeItem('wishlist'); // 로컬스토리지에서 위시리스트 데이터 제거
    wishlist.length = 0; // 배열 비우기
    renderWishlist(); // 위시리스트 다시 렌더링
  });

  // 항목 삭제 함수
  function removeItem(index) {
    wishlist.splice(index, 1); // 배열에서 해당 항목 삭제
    localStorage.setItem('wishlist', JSON.stringify(wishlist)); // 변경된 배열을 로컬스토리지에 저장
    renderWishlist(); // 위시리스트 다시 렌더링
  }

  // 위시리스트를 다시 렌더링하는 함수
  function renderWishlist() {
    wishlistContainer.innerHTML = ''; // 기존 항목들 삭제

    if (wishlist.length === 0) {
      emptyMessage.style.display = 'block'; // 비어있으면 메시지 표시
    } else {
      emptyMessage.style.display = 'none'; // 비어있지 않으면 메시지 숨김
      wishlist.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = item;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '삭제';
        deleteButton.style.marginLeft = '10px';
        deleteButton.addEventListener('click', () => {
          removeItem(index);
        });

        li.appendChild(deleteButton);
        wishlistContainer.appendChild(li);
      });
    }
  }
});
