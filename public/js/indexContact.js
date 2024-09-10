/**********************************************************************/
/* 화면 초기화 및 초기설정                                                  */
/**********************************************************************/

$(document).ready(function() {

    $('.gnb a.contact').addClass('active');
});

$(window).on('load', function(){
    $('#contact_form button').prop('disabled', false);
});

/**********************************************************************/
/* 서비스 트랜잭션 함수                                                    */
/**********************************************************************/
function reqSendEmail(e) {
    e.preventDefault();
    var isValid = true;

    if (!check_recaptcha()) {
        isValid = false;
        e.preventDefault(); 
    }

    var params = [];

    var contactInfo = {
        name:     $("input[name='name']").val(),
        email:    $("input[name='email']").val(),
        subject:  $("input[name='subject']").val(),
        message:  $("textarea[name='message']").val()
    };
    
    var rowIsValid = validCheck($("input[name='name']"))
                     && validCheck($("input[name='email']"))
                     && validCheck($("input[name='subject']"))
                     && validCheck($("textarea[name='message']"));

    if (!rowIsValid) {
        isValid = false;
        e.preventDefault();
    } else {
        params.push(contactInfo);
    }

    var csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');

    if(isValid && params.length > 0) {
        $.ajax({
                url: `/contact/send-email`,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ 
                params: params,
                _csrf: csrfToken
            }),
            beforeSend: function() {
                $('#loading_spinner').css('display', 'flex');
            },
            success: function () {
                $('#contact_modal').modal('show');
            },
            error: function () {
                alert('이메일 송신 요청이 실패했습니다.');
            },
            complete: function() {
                $('#loading_spinner').hide();

            }
        });
    }
}


/**********************************************************************/
/* 공통버튼 컨트롤                                                        */
/**********************************************************************/
$("button[name='submit']").on('click', reqSendEmail);

$('#checkBtn').on('click', function(){
    $('#contact_modal').modal('hide');
})

/**********************************************************************/
/* Object 컨트롤                                                        */
/**********************************************************************/
$('#contact_modal').on('hide.bs.modal', function (e) {
    window.location.reload();
});

/**********************************************************************/
/* 사용자 정의                                                           */
/**********************************************************************/
function centerModals($element) {
    var $modals;
    if ($element.length) {
        $modals = $element;
    } else {
        $modals = $('.modal-vcenter:visible');
    }
    $modals.each( function(i) {
        var $clone = $(this).clone().css('display', 'block').appendTo('body');
        var isInIFrame = (window.location != window.parent.location);
        if(isInIFrame==true){
            var top = 300;
        }else{
            var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
        }
        top = top > 0 ? top : 0;
        $clone.remove();
        $(this).find('.modal-content').css("margin-top", top);
    });
}
$('.modal-vcenter').on('show.bs.modal', function(e) {
    centerModals($(this));
});

function check_recaptcha(){
    var v = grecaptcha.getResponse();
    if(v.length == 0){
        alert("로봇이 아닙니다를 확인해주세요."); 
        return false;
    }else{
        return true;
    }
}

function validCheck(e) {
    var checkText = "";
    var thisVal = $(e).val();

    switch ($(e).attr("name")) {
        case "name":
            if (thisVal.length == 0) {
                checkText = "이름을 입력해주세요.";
            } else if (/\d/.test(thisVal)) { 
                checkText = "이름에 숫자가 포함될 수 없습니다.";
            }
        break;

        case "email":
            if (thisVal.length == 0) {
                checkText = "이메일 주소를 입력해주세요.";
            } else if (!thisVal.includes("@")) {
                checkText = "유효한 이메일 주소를 입력해주세요.";
            }
        break;

        case "subject":
            if (thisVal.length == 0) {
                checkText = "제목을 입력해주세요.";
            }
        break;

        case "message":
            if (thisVal.length == 0) {
                checkText = "내용을 입력해주세요.";
            }
        break;
    }
  
    if (checkText != "") {
        if($(e).attr("name") != "message"){
            $(e).next("p").html(checkText).show();
        } else {
            $(e).attr("placeholder", checkText);
        }
    
        $(e).focus();
        return false;

    } else {
      $(e).next("p").hide();
      return true;
    }
  }