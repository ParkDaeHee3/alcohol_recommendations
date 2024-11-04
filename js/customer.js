// Q&A 폼을 표시하는 함수
function showQAForm() {
    document.getElementById("qa").style.display = "block";
    document.getElementById("notice").style.display = "none";
    document.getElementById("faq").style.display = "none";
    hideDetails();
}

// 질문 제출 함수
function submitQuestion(event) {
    event.preventDefault();
    const question = document.getElementById('question').value;
    if (question.trim() === "") {
        alert("질문을 입력해주세요.");
        return;
    }

    const submittedList = document.getElementById('submittedQuestionList');
    const newQuestion = document.createElement('li');
    newQuestion.textContent = question;
    submittedList.appendChild(newQuestion);

    document.getElementById('question').value = '';
}

// 페이지 로드 시 초기 설정
document.addEventListener('DOMContentLoaded', function() {
    hideDetails();
});

// 탭 전환 함수
function openTab(evt, tabName) {
    const tabContent = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }

    const tabLinks = document.getElementsByClassName("tab-link");
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

let isDetailVisible = false;
let lastOpenedDetailId = "";

// 공지사항 상세 내용 표시 함수
function showNoticeDetail(detailId) {
    const currentDetail = document.getElementById(detailId);
    const noticeList = document.getElementById("noticeList");

    if (isDetailVisible && lastOpenedDetailId === detailId) {
        currentDetail.style.display = "none";
        noticeList.style.display = "block";
        isDetailVisible = false;
        lastOpenedDetailId = "";
    } else {
        hideDetails();
        currentDetail.style.display = "block";
        noticeList.style.display = "none";
        isDetailVisible = true;
        lastOpenedDetailId = detailId;
    }
}

// 자주 묻는 질문(FAQ) 상세 내용 표시 함수
function showFAQDetail(detailId) {
    const currentDetail = document.getElementById(detailId);
    const faqList = document.getElementById("qaList");

    if (isDetailVisible && lastOpenedDetailId === detailId) {
        currentDetail.style.display = "none";
        faqList.style.display = "block";
        isDetailVisible = false;
        lastOpenedDetailId = "";
    } else {
        hideDetails();
        currentDetail.style.display = "block";
        faqList.style.display = "none";
        isDetailVisible = true;
        lastOpenedDetailId = detailId;
    }
}

// 공지사항 목록 표시 함수
function showNoticeList() {
    document.getElementById("notice").style.display = "block";
    document.getElementById("faq").style.display = "none";
    document.getElementById("qa").style.display = "none";
    document.getElementById("noticeList").style.display = "block";
    hideDetails();
}

// 자주 묻는 질문 목록 표시 함수
function showFAQList() {
    document.getElementById("faq").style.display = "block";
    document.getElementById("notice").style.display = "none";
    document.getElementById("qa").style.display = "none";
    document.getElementById("qaList").style.display = "block";
    hideDetails();
}

// 상세 내용을 숨기는 함수
function hideDetails() {
    const details = document.getElementsByClassName("notice-detail");
    for (let i = 0; i < details.length; i++) {
        details[i].style.display = "none";
    }
    isDetailVisible = false;
    lastOpenedDetailId = "";
}
