function openTab(evt, tabName) {
    // 모든 탭 내용을 숨김
    var i, tabContent, tabLinks;
    tabContent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }

    // 모든 탭 버튼에서 active 클래스 제거
    tabLinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }

    // 선택된 탭 내용만 표시하고, 해당 버튼에 active 클래스 추가
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

let isDetailVisible = false;
let lastOpenedDetailId = "";

// 공지사항 상세 내용 표시 함수
function showNoticeDetail(detailId) {
    const noticeList = document.getElementById("noticeList");
    const currentDetail = document.getElementById(detailId);

    // 상세 내용을 클릭한 경우, 상세 내용을 토글하는 부분
    if (isDetailVisible && lastOpenedDetailId === detailId) {
        // 같은 상세 내용을 다시 클릭하면 목록을 다시 표시
        noticeList.style.display = "block";
        currentDetail.style.display = "none";
        isDetailVisible = false;
        lastOpenedDetailId = "";
    } else {
        // 다른 상세 내용을 클릭한 경우, 모든 상세 내용을 숨기고 새로운 상세 내용만 표시
        const details = document.getElementsByClassName("notice-detail");
        for (let i = 0; i < details.length; i++) {
            details[i].style.display = "none"; // 모든 상세 내용을 숨김
        }

        // 공지사항 목록 숨기고 선택한 상세 내용만 표시
        noticeList.style.display = "none";
        currentDetail.style.display = "block";
        isDetailVisible = true;
        lastOpenedDetailId = detailId;
    }
}

// 자주묻는질문(FAQ) 상세 내용 표시 함수
function showFAQDetail(detailId) {
    const faqList = document.getElementById("qaList"); // 자주묻는질문 목록
    const currentDetail = document.getElementById(detailId);

    if (isDetailVisible && lastOpenedDetailId === detailId) {
        // 같은 상세 내용을 다시 클릭하면 목록을 다시 표시
        faqList.style.display = "block";
        currentDetail.style.display = "none";
        isDetailVisible = false;
        lastOpenedDetailId = "";
    } else {
        // 다른 상세 내용을 클릭한 경우, 모든 상세 내용을 숨기고 새로운 상세 내용만 표시
        const details = document.getElementsByClassName("notice-detail");
        for (let i = 0; i < details.length; i++) {
            details[i].style.display = "none"; // 모든 상세 내용을 숨김
        }

        // 자주묻는질문 목록 숨기고 선택한 상세 내용만 표시
        faqList.style.display = "none";
        currentDetail.style.display = "block";
        isDetailVisible = true;
        lastOpenedDetailId = detailId;
    }
}

// 공지사항 목록 표시 함수
function showNoticeList() {
    // 공지사항 목록을 다시 표시하고, 자주묻는질문(FAQ) 및 Q&A 목록을 숨김
    document.getElementById("notice").style.display = "block";
    document.getElementById("faq").style.display = "none"; // 자주묻는질문(FAQ) 숨기기
    document.getElementById("qa").style.display = "none"; // Q&A 창 숨기기
    document.getElementById("noticeList").style.display = "block"; // 공지사항 목록 표시
    hideDetails(); // 상세 내용 숨기기
}

// 자주묻는질문(FAQ) 목록 표시 함수
function showFAQList() {
    // 자주묻는질문(FAQ) 목록을 다시 표시하고, 공지사항 및 Q&A 목록을 숨김
    document.getElementById("faq").style.display = "block";
    document.getElementById("notice").style.display = "none"; // 공지사항 숨기기
    document.getElementById("qa").style.display = "none"; // Q&A 창 숨기기
    document.getElementById("qaList").style.display = "block"; // 자주묻는질문(FAQ) 목록 표시
    hideDetails(); // 상세 내용 숨기기
}

// 새로운 Q&A 섹션 표시 함수 (사용자가 질문을 작성할 수 있는 폼)
function showQAForm() {
    // 새로운 Q&A 질문 폼을 표시하고 다른 탭 숨김
    document.getElementById("qa").style.display = "block"; // Q&A 질문 폼 표시
    document.getElementById("notice").style.display = "none"; // 공지사항 숨기기
    document.getElementById("faq").style.display = "none"; // 자주묻는질문(FAQ) 숨기기
    hideDetails(); // 상세 내용 숨기기
}

// 상세 내용을 숨기는 함수 (공지사항과 자주묻는질문 모두 사용)
function hideDetails() {
    const details = document.getElementsByClassName("notice-detail");
    for (let i = 0; i < details.length; i++) {
        details[i].style.display = "none"; // 모든 상세 내용 숨김
    }
    isDetailVisible = false;
    lastOpenedDetailId = "";
}
