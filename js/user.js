document.addEventListener('DOMContentLoaded', function() {
    // 회원가입 페이지에서 실행할 코드
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
                // 사용자 정보 저장 (로컬 스토리지에 저장)
                localStorage.setItem('name', name);
                localStorage.setItem('nickname', nickname);
                localStorage.setItem('email', email);
                localStorage.setItem('password', password);  // 비밀번호도 저장
                localStorage.setItem('isLoggedIn', 'false');  // 로그인 상태를 false로 초기 설정

                alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
                window.location.href = "login.html";
            } else {
                alert("비밀번호는 최소 8자리, 생년월일은 YYMMDD 형식이어야 합니다.");
            }
        });
    }

    // 로그인 페이지에서 실행할 코드
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); // 기본 제출 방지

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            // 저장된 사용자 정보와 비교
            const storedEmail = localStorage.getItem('email');
            const storedPassword = localStorage.getItem('password');

            if (email === storedEmail && password === storedPassword) {
                localStorage.setItem('isLoggedIn', 'true'); // 로그인 상태 저장
                alert("로그인 성공! 메인 페이지로 이동합니다.");
                window.location.href = "main.html"; // 메인 페이지로 이동
            } else {
                alert("이메일 또는 비밀번호가 잘못되었습니다.");
            }
        });
    }

    // 로그인 상태 유지 및 정보 표시 기능
    function updateLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userSection = document.getElementById('user-section');
        const guestSection = document.getElementById('guest-section');
        
        if (userSection && guestSection) {  // 요소가 존재할 때만 실행
            if (isLoggedIn) {
                userSection.style.display = 'block';
                guestSection.style.display = 'none';
                document.getElementById('user-name').textContent = localStorage.getItem('name');
                document.getElementById('user-email').textContent = localStorage.getItem('email');
            } else {
                userSection.style.display = 'none';
                guestSection.style.display = 'block';
            }
        } else {
            console.error("필요한 요소가 존재하지 않습니다. 'guest-section' 또는 'user-section'을 확인하세요.");
        }
    }

    // 유저 아이콘 클릭 시 마이페이지로 이동
    const userIcon = document.querySelector('.user-icon a');
    if (userIcon) {
        userIcon.addEventListener('click', function(event) {
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            if (isLoggedIn === 'true') {
                event.preventDefault();  // 기본 링크 방지
                window.location.href = 'mypage.html';  // 마이페이지로 이동
            } else {
                window.location.href = 'login.html';  // 로그인 페이지로 이동
            }
        });
    }

    // 로그아웃 기능 추가
    window.logout = function() {
        localStorage.setItem('isLoggedIn', 'false');  // 로그인 상태만 초기화
        alert('로그아웃 되었습니다!');
        window.location.href = 'main.html'; // 메인 페이지로 이동
    };

    // 페이지 로드 시 로그인 상태 확인
    updateLoginStatus();
});