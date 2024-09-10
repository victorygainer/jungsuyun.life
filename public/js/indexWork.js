/**********************************************************************/
/* 화면 초기화 및 초기설정                                                  */
/**********************************************************************/

$(document).ready(function(){
    $('.gnb a.work').addClass('active');
        
    var width = $('.painting').width()
    $('.painting').height(width);
    $(".painting img").lazyload({
        effect : "fadeIn"
    });
});

/**********************************************************************/
/* 서비스 트랜잭션 함수                                                    */
/**********************************************************************/

/**********************************************************************/
/* 공통버튼 컨트롤                                                        */
/**********************************************************************/

/**********************************************************************/
/* Object 컨트롤                                                        */
/**********************************************************************/
  
document.getElementById('artwork_list').onclick = function(event) {
    event = event || window.event;
    var target = event.target || event.srcElement;
    var link = target.nodeName === 'IMG' ? target.parentNode : target;
    var options = {
        index: link,
        event: event,
        onslide: function(index, slide) {
            var currentLink = this.list[index];
            var description = currentLink.dataset.description; 
            var descriptionNode = document.querySelector('.description'); 
            descriptionNode.innerHTML = description;
        }
    };
    blueimp.Gallery(this.getElementsByTagName('a'), options);
};

/**********************************************************************/
/* 사용자 정의                                                           */
/**********************************************************************/
  