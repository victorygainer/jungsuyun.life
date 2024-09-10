/**********************************************************************/
/* 화면 초기화 및 초기설정                                                  */
/**********************************************************************/

$(document).ready(function() {
    $('.gnb a.home').addClass('active');

    handleImageLoad();
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
  
/**********************************************************************/
/* 사용자 정의                                                           */
/**********************************************************************/

function handleImageLoad() { 

var imgPath = $('#m_img').attr('src');
var img = new Image();

img.onload = function() {
    $('.main').css('opacity', 0);

    var a = img.height;
    var b = img.width;
    var win = $(window).height();
    var std = win - 120;

    var imgAspectRatio = b / a;

    if (b > a) {
        // 이미지가 가로로 길 경우
        var imgHeight = $('.img_wrapper #m_img').height();
        var ptop = (std - imgHeight) / 2;
        setTimeout(function() {
            if (imgHeight > std) {
                // 이미지가 창보다 큰 경우
                var modi = std * 0.8;
                $('.img_wrapper').css('height', std + 'px');
                $('.img_wrapper #m_img').css({
                    'height': modi + 'px',
                    'width': 'auto',
                    'margin': '0 auto'
                });
                var width = $('#m_img').outerWidth();
                $('.img_wrapper p').css('width', width);
            } else {
                // 이미지가 창보다 작은 경우
                $('.img_wrapper').css('height', std + 'px');
            }
            // .main 요소의 투명도를 1로 설정하여 나타냄
            $('.main').css('opacity', 1);
        }, 100);
    } else {
        // 이미지가 세로로 길 경우
        setTimeout(function() {
            var $img = $('#m_img');
            var $imgWrapper = $('.img_wrapper');

            // 상단 여백 
            $imgWrapper.css('padding-top', 10 + 'px');    

            // 이미지 높이 설정
            $img.css('height', std + 'px');

            // 이미지의 새로운 폭 계산
            var newWidth = std * imgAspectRatio;

            // 이미지의 높이가 화면 높이를 초과하는 경우
            if (std > $(window).height()) {
                std = $(window).height();
                $img.css('height', std + 'px');
                newWidth = std * imgAspectRatio;
            }

            // 화면 폭을 초과하지 않도록 이미지 폭 조정
            if (newWidth > $(window).width()) {
                newWidth = $(window).width();
                std = newWidth / imgAspectRatio;
                $img.css('width', newWidth + 'px');
                $img.css('height', std + 'px');
            } else {
                $img.css('width', newWidth + 'px');
            }

            // .main 요소 투명도 재설정
            $('.main').css('opacity', 1);
        }, 100);
    }
};

img.src = imgPath;

}