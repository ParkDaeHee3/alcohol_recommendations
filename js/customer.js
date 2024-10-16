// Q&A 폼을 표시하는 함수
function showQAForm() {
    // Q&A 폼 표시
    document.getElementById("qa").style.display = "block";
    document.getElementById("notice").style.display = "none"; // 공지사항 숨기기
    document.getElementById("faq").style.display = "none"; // 자주묻는질문(FAQ) 숨기기
    hideDetails(); // 상세 내용 숨기기
}

// 질문 제출 함수
function submitQuestion(event) {
    event.preventDefault(); // 기본 제출 동작 방지
    const question = document.getElementById('question').value; // 질문 내용 가져오기
    if (question.trim() === "") {
        alert("질문을 입력해주세요."); // 질문이 없을 때 경고 메시지
        return;
    }

    // 제출된 질문을 목록에 추가
    const submittedList = document.getElementById('submittedQuestionList');
    const newQuestion = document.createElement('li');
    newQuestion.textContent = question;
    submittedList.appendChild(newQuestion);

    document.getElementById('question').value = ''; // 입력창 초기화
}

// 페이지 로드 시 탭 내용 숨기기
document.addEventListener('DOMContentLoaded', function() {
    hideDetails(); // 상세 내용 숨기기
});

// 탭 전환 함수
function openTab(evt, tabName) {
    const tabContent = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none"; // 모든 탭 내용을 숨김
    }

    const tabLinks = document.getElementsByClassName("tab-link");
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", ""); // 모든 탭에서 active 클래스 제거
    }

    document.getElementById(tabName).style.display = "block"; // 선택된 탭 내용만 표시
    evt.currentTarget.className += " active"; // 현재 탭에 active 클래스 추가
}

let isDetailVisible = false;
let lastOpenedDetailId = "";

// 공지사항 상세 내용 표시 함수
function showNoticeDetail(detailId) {
    const currentDetail = document.getElementById(detailId);

    if (isDetailVisible && lastOpenedDetailId === detailId) {
        currentDetail.style.display = "none";
        isDetailVisible = false;
        lastOpenedDetailId = "";
    } else {
        hideDetails(); // 모든 상세 내용을 숨김
        currentDetail.style.display = "block"; // 선택한 상세 내용만 표시
        isDetailVisible = true;
        lastOpenedDetailId = detailId;
    }
}

// 자주 묻는 질문(FAQ) 상세 내용 표시 함수
function showFAQDetail(detailId) {
    const currentDetail = document.getElementById(detailId);

    if (isDetailVisible && lastOpenedDetailId === detailId) {
        currentDetail.style.display = "none";
        isDetailVisible = false;
        lastOpenedDetailId = "";
    } else {
        hideDetails(); // 모든 상세 내용을 숨김
        currentDetail.style.display = "block"; // 선택한 상세 내용만 표시
        isDetailVisible = true;
        lastOpenedDetailId = detailId;
    }
}

// 공지사항 목록 표시 함수
function showNoticeList() {
    document.getElementById("notice").style.display = "block";
    document.getElementById("faq").style.display = "none";
    document.getElementById("qa").style.display = "none";
    hideDetails(); // 상세 내용 숨기기
}

// 자주 묻는 질문 목록 표시 함수
function showFAQList() {
    document.getElementById("faq").style.display = "block";
    document.getElementById("notice").style.display = "none";
    document.getElementById("qa").style.display = "none";
    hideDetails(); // 상세 내용 숨기기
}

// 상세 내용을 숨기는 함수 (공지사항과 자주 묻는 질문 모두 사용)
function hideDetails() {
    const details = document.getElementsByClassName("notice-detail");
    for (let i = 0; i < details.length; i++) {
        details[i].style.display = "none"; // 모든 상세 내용 숨김
    }
    isDetailVisible = false;
    lastOpenedDetailId = "";
}
