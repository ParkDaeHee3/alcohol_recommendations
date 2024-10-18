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
            '해당 사이트의 기능: 음식에 맞는 술 추천 및 술 검색 인기 술 정보 제공', 
            '*추가예정* 술 이벤트 및 행사 관련 달력 기능'
          );
        }, 0);
      })
      .catch(error => console.log('Header 불러오기 에러:', error));
  }
  
  // 달력 생성 함수
  function generateCalendar() {
    const calendarBody = document.getElementById('calendar-body');
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('ko-KR', { month: 'long', year: 'numeric' });
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
    document.getElementById('currentMonth').textContent = currentMonth;
  
    const events = {
      3: '개천절',
      9: '한글날',
      25: '독도의 날'
      // 여기에 이벤트를 추가
    };
  
    let day = 1;
    for (let i = 0; i < 6; i++) {
      let row = document.createElement('tr');
      for (let j = 0; j < 7; j++) {
        let cell = document.createElement('td');
        if (i === 0 && j < startDay) {
          cell.textContent = '';
        } else if (day <= daysInMonth) {
          const eventText = events[day] ? `<div class="event">${events[day]}</div>` : '';
          cell.innerHTML = `${day}${eventText}`;
          if (j === 0) {
            cell.style.color = 'red'; // 일요일 빨간색
          }
          if (j === 6) {
            cell.style.color = 'red'; // 토요일 빨간색
          }
          day++;
        } else {
          cell.textContent = '';
        }
        row.appendChild(cell);
      }
      calendarBody.appendChild(row);
    }
  }
  
  // 오늘의 술 추천 함수
  function recommendDrinks() {
    const drinks = getDrinkData(); // drink.js 파일에서 데이터 가져옴
  
    // 첫 번째 카드: 양조주 또는 증류주
    const brewingOrDistilled = drinks.filter(drink => drink.category === '양조주' || drink.category === '증류주');
    const recommendation1 = brewingOrDistilled[Math.floor(Math.random() * brewingOrDistilled.length)];
    document.getElementById('recommendation1-img').src = recommendation1.image;
    document.getElementById('recommendation1-name').textContent = recommendation1.name;
    document.getElementById('recommendation1-desc').textContent = recommendation1.description;
  
    // 카드 클릭 시 상세 페이지로 이동
    document.getElementById('recommendation1').addEventListener('click', function() {
      window.location.href = `drink_detail.html?product=${encodeURIComponent(recommendation1.name)}`;
    });
  
    // 두 번째 카드: 혼성주 또는 전통주
    const mixedOrTraditional = drinks.filter(drink => drink.category === '혼성주' || drink.category === '전통주');
    const recommendation2 = mixedOrTraditional[Math.floor(Math.random() * mixedOrTraditional.length)];
    document.getElementById('recommendation2-img').src = recommendation2.image;
    document.getElementById('recommendation2-name').textContent = recommendation2.name;
    document.getElementById('recommendation2-desc').textContent = recommendation2.description;
  
    // 카드 클릭 시 상세 페이지로 이동
    document.getElementById('recommendation2').addEventListener('click', function() {
      window.location.href = `drink_detail.html?product=${encodeURIComponent(recommendation2.name)}`;
    });
  }
  