// 이전으로 버튼 클릭 시 이전 페이지로 이동
document.querySelector('.cancel-btn').addEventListener('click', function() {
    window.history.back();  // 이전 페이지로 이동
});

// 탈퇴 버튼 클릭 시 탈퇴 확인 및 처리
document.querySelector('.withdraw-btn').addEventListener('click', function() {
    const password = document.getElementById('password').value;
    const reasons = document.querySelectorAll('input[name="reason"]:checked');
    const message = document.getElementById('message').value;

    // 선택된 탈퇴사유 목록
    let selectedReasons = [];
    reasons.forEach(reason => selectedReasons.push(reason.value));

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
        alert("회원탈퇴가 완료되었습니다.");

        // 서버에 탈퇴 요청 전송
        // 예: 서버 API 호출을 통해 처리
        // 이곳에 서버 요청 코드를 추가하세요

        // 메인 페이지로 이동
        window.location.href = 'main.html';
    }
});
