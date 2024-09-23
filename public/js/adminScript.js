/**********************************************************************/
/* 화면초기화 및 초기설정                                                   */
/**********************************************************************/
$(document).ready(function() {

    //localhost가 아닌 경우 http로 접속 시 http로 리다이렉트  
    if(location.hostname != "localhost"){
    if(window.location.protocol == "http:"){
        window.location.protocol = "https:";
    }
    }
    
    // 좌측 네비게이션 버튼 활성화 이벤트
    var path = window.location.pathname;

    if (path.includes('/home') || path == "/admin/admin_login_process") {
        $('#home').addClass('active');
    } else if (path.includes('/profile')) {
        $('#profile').addClass('active');
    } else if (path.includes('/work')) {
        $('#work').addClass('active');
    }
    
});
  