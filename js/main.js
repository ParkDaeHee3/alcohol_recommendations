document.addEventListener('DOMContentLoaded', function() {
    loadHeader();
    generateCalendar();
    recommendDrinks();
  });
  
  // Header 로드 함수
  function loadHeader() {
    fetch('header.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('header-container').innerHTML = data;
  
        setTimeout(() => {
          setBanner(
            true, 
            'img/banner/main-banner.png', 
            'Tastify에 오신 걸 환영합니다.', 
            '해당 사이트의 기능: 음식에 맞는 술 추천 및 술 리스트 & 인기 술 정보 제공', 
            '*추가예정* 술 이벤트 및 행사 관련 달력 기능'
          );
        }, 0);
      })
      .catch(error => console.log('Header 불러오기 에러:', error));
  }

// 술 추천 카드를 업데이트하는 함수
function updateRecommendationCard(cardId, product) {
  const card = document.getElementById(cardId);
  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}" class="drink-image">
    <h4>${product.name}</h4>
    <p>${product.tasteDescription}</p>
  `;

  // 클릭 시 상세 페이지로 이동
  card.addEventListener('click', function () {
    window.location.href = `drink_detail.html?product=${encodeURIComponent(product.name)}`;
  });
}

// 오늘의 술 추천 함수
function recommendDrinks() {
  const drinks = getDrinkData(); // drink.js 파일에서 데이터 가져옴

  // 카테고리별 추천 술 필터링
  const brewing = drinks.filter(drink => drink.category === '양조주');
  const distilled = drinks.filter(drink => drink.category === '증류주');
  const mixed = drinks.filter(drink => drink.category === '혼성주');
  const traditional = drinks.filter(drink => drink.category === '전통주');

  // 랜덤으로 각 카테고리에서 하나씩 추천
  const recommendation1 = brewing[Math.floor(Math.random() * brewing.length)];
  const recommendation2 = distilled[Math.floor(Math.random() * distilled.length)];
  const recommendation3 = mixed[Math.floor(Math.random() * mixed.length)];
  const recommendation4 = traditional[Math.floor(Math.random() * traditional.length)];

  // 추천 카드에 데이터 삽입
  updateRecommendation('recommendation1', recommendation1);
  updateRecommendation('recommendation2', recommendation2);
  updateRecommendation('recommendation3', recommendation3);
  updateRecommendation('recommendation4', recommendation4);
}

function updateRecommendation(id, product) {
  const card = document.getElementById(id);
  
  if (!product) {
    card.innerHTML = '<p>해당 카테고리에 제품이 없습니다.</p>';
    return;
  }

  card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="drink-image">
      <h4>${product.name}</h4>
      <p>${product.description}</p>
  `;

  // 카드 클릭 시 상세 페이지로 이동
  card.addEventListener('click', function () {
      window.location.href = `drink_detail.html?product=${encodeURIComponent(product.name)}`;
  });
}

// 달력과 해당 달의 이벤트 목록을 생성하는 함수
function generateCalendar() {
  const today = new Date();
  const month = today.getMonth(); // 현재 월
  const year = today.getFullYear();
  const currentDay = today.getDate();

  // 달력 생성
  const calendarBody = document.getElementById('calendar-body');
  const eventList = document.getElementById('events');
  
  // 달력 헤더 표시
  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  document.getElementById('currentMonth').textContent = `${year}년 ${monthNames[month]}`;

  // 날짜와 요일 계산
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // 해당 월의 일 수

  // 빈 달력 초기화
  calendarBody.innerHTML = '';
  
  let dayCounter = 1;
  
  // 달력 생성 (6주까지 표시)
  for (let week = 0; week < 6; week++) {
    const row = document.createElement('tr');
    
    for (let day = 0; day < 7; day++) {
      const cell = document.createElement('td');
      
      if (week === 0 && day < firstDayOfMonth) {
        // 첫 주의 빈 칸 채우기
        cell.innerHTML = '';
      } else if (dayCounter > daysInMonth) {
        // 마지막 주 이후 빈 칸 채우기
        cell.innerHTML = '';
      } else {
        // 날짜 입력
        cell.innerHTML = dayCounter;
        
        // 오늘 날짜 강조
        if (dayCounter === currentDay) {
          cell.classList.add('today');
        }

        // 주말 스타일 추가
        if (day === 6) {
          cell.classList.add('saturday');
        } else if (day === 0) {
          cell.classList.add('weekend');
        }

        dayCounter++;
      }
      row.appendChild(cell);
    }
    calendarBody.appendChild(row);
    
    if (dayCounter > daysInMonth) {
      break; // 모든 날짜를 채우면 종료
    }
  }
}

  // 이벤트 목록 생성 (내용 생략 가능)
  Object.keys(events).forEach(day => {
    const listItem = document.createElement('li');
    listItem.textContent = `${day}일: ${events[day].join(', ')}`;
    eventList.appendChild(listItem);
  });

document.addEventListener('DOMContentLoaded', function() {
  recommendDrinks();
  generateCalendar();
});
