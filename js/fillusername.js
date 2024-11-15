// fill-username.js

// 세션 스토리지에 저장된 로그인된 아이디를 가져와 'username' 입력란에 자동으로 채웁니다.
const loggedInUsername = sessionStorage.getItem('loggedInUsername'); // 로그인된 아이디가 세션 스토리지에 저장되어 있다고 가정

if (loggedInUsername) {
    document.getElementById('username').value = loggedInUsername; // 아이디 입력란에 자동으로 로그인된 아이디를 채움
}
