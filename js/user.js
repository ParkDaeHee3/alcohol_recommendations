document.addEventListener('DOMContentLoaded', function() {
    // 회원가입 폼 처리
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault(); // 기본 제출 방지

            const name = document.getElementById('name').value;
            const nickname = document.getElementById('nickname').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const birthdate = document.getElementById('birthdate').value;

            if (password.length >= 8 && birthdate.match(/^\d{6}$/)) {
                // 사용자 정보 저장 (세션 스토리지에 저장)
                sessionStorage.setItem('name', name);
                sessionStorage.setItem('nickname', nickname);
                sessionStorage.setItem('email', email);
                sessionStorage.setItem('password', password);
                sessionStorage.setItem('isLoggedIn', 'true');  // 로그인 상태 저장

                alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
                window.location.href = "login.html";
            } else {
                alert("비밀번호는 최소 8자리, 생년월일은 YYMMDD 형식이어야 합니다.");
            }
        });
    }

    // 로그인 폼 처리
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); // 기본 제출 방지

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            // 저장된 사용자 정보와 비교
            const storedEmail = sessionStorage.getItem('email');
            const storedPassword = sessionStorage.getItem('password');

            if (email === storedEmail && password === storedPassword) {
                sessionStorage.setItem('isLoggedIn', 'true'); // 로그인 상태 저장
                alert("로그인 성공! 메인 페이지로 이동합니다.");
                window.location.href = "main.html"; // 메인 페이지로 이동
            } else {
                alert("이메일 또는 비밀번호가 잘못되었습니다.");
            }
        });
    }

    // 로그인 상태 유지 기능 추가
    function checkLoginStatus() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            document.getElementById('user-section').style.display = 'block';
            document.getElementById('guest-section').style.display = 'none';
            document.getElementById('user-name').textContent = sessionStorage.getItem('name');
            document.getElementById('user-email').textContent = sessionStorage.getItem('email');
        } else {
            document.getElementById('guest-section').style.display = 'block';
            document.getElementById('user-section').style.display = 'none';
        }
    }

    // 유저 아이콘 클릭 시 마이페이지로 이동
    const userIcon = document.querySelector('.user-icon a');
    if (userIcon) {
        userIcon.addEventListener('click', function(event) {
            const isLoggedIn = sessionStorage.getItem('isLoggedIn');
            if (isLoggedIn === 'true') {
                event.preventDefault();  // 기본 링크 방지
                window.location.href = 'mypage.html';  // 마이페이지로 이동
            } else {
                window.location.href = 'login.html';  // 로그인 페이지로 이동
            }
        });
    }

    // 사이드바에서 로그인 정보 표시
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        const userSection = document.getElementById('user-section');
        const guestSection = document.getElementById('guest-section');
        const userName = document.getElementById('user-name');
        const userEmail = document.getElementById('user-email');

        userSection.style.display = 'block';
        guestSection.style.display = 'none';

        userName.textContent = sessionStorage.getItem('name');
        userEmail.textContent = sessionStorage.getItem('email');
    } else {
        document.getElementById('guest-section').style.display = 'block';
    }

    // 시뮬레이터 로그인 버튼 클릭 시
    window.simulateLogin = function() {
        sessionStorage.setItem('name', 'Simulated User');
        sessionStorage.setItem('email', 'simulated@example.com');
        sessionStorage.setItem('nickname', 'SimUser');
        sessionStorage.setItem('isLoggedIn', 'true');
        alert('시뮬레이터 로그인 완료!');
        window.location.reload();  // 페이지 새로고침
    };

    // 로그아웃 기능 추가
    window.logout = function() {
        sessionStorage.removeItem('isLoggedIn'); // 로그인 상태 삭제
        sessionStorage.removeItem('name');        // 유저 이름 삭제
        sessionStorage.removeItem('email');       // 유저 이메일 삭제
        sessionStorage.removeItem('nickname');    // 유저 닉네임 삭제
        alert('로그아웃 되었습니다!');
        window.location.href = 'main.html'; // 메인 페이지로 이동
    };

    // 페이지 로드 시 로그인 상태 확인
    checkLoginStatus();
});