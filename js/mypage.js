function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

document.querySelector('.confirm-btn').addEventListener('click', function(event) {
    event.preventDefault();  // 기본 동작 방지
    window.location.href = 'mypagebasic.html';  // 정보수정 버튼 클릭 시 mypagebasic.html로 이동
});
// 취소 버튼 클릭 시 메인 페이지로 이동
document.querySelector('.cancel-btn').addEventListener('click', function() {
    window.location.href = 'main.html';  // 취소 버튼 클릭 시 메인페이지로 이동
});

// 정보수정 버튼 클릭 시 메시지 띄운 후 페이지 변경
document.querySelector('.submit-btn').addEventListener('click', function(event) {
    event.preventDefault();  // 폼 기본 제출 동작 방지

    // "회원정보 수정이 성공하였습니다." 메시지 출력
    alert("회원정보 수정이 성공하였습니다.");

    // 폼 데이터를 저장
    const updatedData = {
        id: document.getElementById('user-id').value,
        password: document.getElementById('password').value,
        name: document.getElementById('name').value,
        nickname: document.getElementById('nickname').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        telephone: document.getElementById('telephone').value,
        address: document.getElementById('address').value,
    };

    // 로컬 스토리지에 저장된 데이터를 업데이트
    localStorage.setItem('userInfo', JSON.stringify(updatedData));

    // 회원정보가 반영된 페이지로 이동
    window.location.href = 'mypage.html';
});

// 검색 버튼과 검색 입력 필드를 DOM에서 가져옵니다.
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const searchHistoryList = document.getElementById('searchHistoryList');

// 검색 버튼 클릭 이벤트를 추가합니다.
searchButton.addEventListener('click', function() {
    // 검색 입력 필드에서 입력된 값을 가져옵니다.
    const searchTerm = searchInput.value.trim();

    // 검색어가 비어 있지 않을 때만 기록을 추가합니다.
    if (searchTerm) {
        // 새로운 검색 기록을 리스트에 추가합니다.
        addSearchHistory(searchTerm);

        // 입력 필드를 초기화합니다.
        searchInput.value = '';
    }
});

// 검색 기록을 추가하는 함수입니다.
function addSearchHistory(searchTerm) {
    // 새로운 리스트 항목을 생성합니다.
    const listItem = document.createElement('li');
    listItem.textContent = searchTerm;

    // 검색 기록 리스트에 새로운 항목을 추가합니다.
    searchHistoryList.appendChild(listItem);

    // 검색 기록이 5개 이상이면 가장 오래된 항목을 제거합니다.
    if (searchHistoryList.children.length > 5) {
        searchHistoryList.removeChild(searchHistoryList.firstChild);
    }

    // 로컬 스토리지에 검색 기록을 저장합니다.
    saveSearchHistory();
}

// 로컬 스토리지에 검색 기록을 저장하는 함수입니다.
function saveSearchHistory() {
    // 검색 기록 리스트의 모든 항목을 배열로 만듭니다.
    const searchHistory = [];
    for (let i = 0; i < searchHistoryList.children.length; i++) {
        searchHistory.push(searchHistoryList.children[i].textContent);
    }

    // 배열을 JSON 형식으로 변환하여 로컬 스토리지에 저장합니다.
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

// 페이지 로드 시 로컬 스토리지에서 검색 기록을 불러오는 함수입니다.
function loadSearchHistory() {
    // 로컬 스토리지에서 검색 기록을 가져옵니다.
    const savedHistory = localStorage.getItem('searchHistory');

    // 검색 기록이 있을 경우, JSON 형식으로 변환하고 화면에 표시합니다.
    if (savedHistory) {
        const searchHistory = JSON.parse(savedHistory);

        // 각각의 기록을 리스트에 추가합니다.
        searchHistory.forEach(function(searchTerm) {
            const listItem = document.createElement('li');
            listItem.textContent = searchTerm;
            searchHistoryList.appendChild(listItem);
        });
    }
}
// 메뉴 항목을 클릭할 때 동적으로 'active' 클래스를 추가하고 기존 활성화 항목에서 제거하는 함수
const menuLinks = document.querySelectorAll('.menu-link');

// 모든 메뉴 항목에 클릭 이벤트를 추가
menuLinks.forEach(link => {
    link.addEventListener('click', function(event) {
        // 기본 동작 방지 (페이지 새로고침 방지)
        event.preventDefault();

        // 모든 메뉴 링크에서 'active' 클래스 제거하여 기존 활성화 항목 초기화
        menuLinks.forEach(menuLink => menuLink.classList.remove('active'));

        // 클릭한 링크에만 'active' 클래스 추가하여 파란색으로 표시
        this.classList.add('active');

        // 링크에 지정된 페이지로 이동 (주석 해제 시 실제로 페이지 이동)
        // window.location.href = this.getAttribute('href');
    });
});


// 페이지가 로드될 때 검색 기록을 불러옵니다.
window.addEventListener('load', loadSearchHistory);
