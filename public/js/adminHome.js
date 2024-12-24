/**********************************************************************/
/* 화면 초기화 및 초기설정                                                  */
/**********************************************************************/

document.addEventListener('DOMContentLoaded', function() {
  // localhost 및 127.0.0.1이 아닌 경우 http에서 https로 리다이렉트
  if (location.hostname !== "localhost" && location.hostname !== "127.0.0.1" && window.location.protocol === "http:") {
      window.location.protocol = "https:";
  }

  // 로그인 실패 시 메시지 표시
  const urlParams = new URLSearchParams(window.location.search);
  const loginFailed = urlParams.get('loginFailed');
  const loginMessageElement = document.getElementById('loginMessage');

  if (loginFailed && loginMessageElement) {
      loginMessageElement.style.display = 'block';  // 로그인 실패 메시지 표시
  }

  // submit 버튼이 존재하는지 확인 후 이벤트 리스너 추가
  const submitButton = document.getElementById('submitBtn');
  if (submitButton) {
    submitButton.addEventListener('click', handleSubmit);
  }

  // 폼 제출 처리 함수
  function handleSubmit(event) {
    if (!check_recaptcha()) {
      event.preventDefault(); // reCAPTCHA 검증이 안 되면 폼 제출을 막음
      alert("reCAPTCHA 확인을 완료해주세요.");  // 메시지 표시
    }
  }
});

/**********************************************************************/
/* 사용자 정의                                                           */
/**********************************************************************/

function check_recaptcha() {
  var v = grecaptcha.getResponse();
  return v.length !== 0;  // reCAPTCHA가 유효하면 true, 아니면 false
}
