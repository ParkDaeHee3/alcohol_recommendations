// 이전으로 버튼 클릭 시 이전 페이지로 이동
document.querySelector('.cancel-btn').addEventListener('click', function () {
    window.history.back(); // 이전 페이지로 이동
});

// 탈퇴 버튼 클릭 시 탈퇴 확인 및 처리
document.querySelector('.withdraw-btn').addEventListener('click', function () {
    const password = document.getElementById('password').value; // 입력된 비밀번호
    const reasons = document.querySelectorAll('input[name="reason"]:checked'); // 선택된 탈퇴 사유들
    const message = document.getElementById('message').value; // 남긴 메시지

    // 선택된 탈퇴사유 목록
    let selectedReasons = [];
    reasons.forEach(reason => selectedReasons.push(reason.value));

    // 입력 검증
    if (!password) {
        alert("비밀번호를 입력해주세요.");
        return;
    }

    if (selectedReasons.length === 0) {
        alert("탈퇴사유를 선택해주세요.");
        return;
    }

    // 탈퇴 확인 메시지
    const confirmWithdrawal = confirm("정말로 탈퇴하시겠습니까?");
    if (confirmWithdrawal) {
        // 로컬 스토리지 데이터 제거 (사용자 정보 포함)
        localStorage.removeItem('loggedInUser'); // 로그인된 사용자 정보 제거
        localStorage.clear(); // 모든 로컬 스토리지 데이터 삭제 (필요 시 조정)

        // 추가적으로 쿠키나 세션 데이터도 삭제 필요 시 처리
        document.cookie = "sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // 세션 쿠키 무효화 예시

        alert("회원탈퇴가 완료되었습니다.");
        window.location.href = 'main.html'; // 메인 페이지 경로
    }
});
