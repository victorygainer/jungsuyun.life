/**********************************************************************/
/* 화면초기화 및 초기설정                                                   */
/**********************************************************************/
$(document).ready(function() {
  //localhost가 아닌 경우 http로 접속 시 https로 리다이렉트  
  if(location.hostname != "localhost"){
    if(window.location.protocol == "http:"){
      window.location.protocol = "https:";
    }
  } 
});
  