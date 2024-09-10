/**********************************************************************/
/* 화면 초기화 및 초기설정                                                  */
/**********************************************************************/

$(document).ready(function() {
  
});
  
/**********************************************************************/
/* 서비스 트랜잭션 함수                                                    */
/**********************************************************************/

function createWork() {
  var formData = new FormData();
  var csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');

  formData.append("title", $('#work-title').val());
  formData.append("year", $('#work-year').val());
  formData.append("medium", $('#work-medium').val());
  formData.append("dimensions", $('#work-dimensions').val());
  formData.append("pieces", $('#work-pieces').val());
  formData.append("imagePath", $('#work-imagePath')[0].files[0]);

  $.ajax({
    url: '/admin/work/create', 
    type: 'POST',
    headers: {'CSRF-Token': csrfToken},
    data: formData,
    processData: false,  
    contentType: false,
    success: function(data) {
      location.reload();
    },
    error: function(xhr, status, error) {
        console.error('Error:', error);
        alert('작업 추가에 실패했습니다.');
    }
  });
} 

function updateWork() { 
  if (!confirm('해당 작업을 수정하시겠습니까?')) return;
  var id = $('#edit-work-id').val();
  var title = $('#edit-work-title').val();
  var year = $('#edit-work-year').val();
  var medium = $('#edit-work-medium').val();
  var dimensions = $('#edit-work-dimensions').val();
  var pieces = $('#edit-work-pieces').val();
  var csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');

  // JSON 객체를 사용하여 서버에 데이터를 전송합니다.
  var data = {
    id: id,
    title: title,
    year: year,
    medium: medium,
    dimensions: dimensions,
    pieces: pieces
  };

  $.ajax({
    url: '/admin/work/update/',
    type: 'POST',
    headers: {'CSRF-Token': csrfToken},
    contentType: 'application/json', 
    data: JSON.stringify(data),
    success: function(response) {
      location.reload();
    },
    error: function(xhr, status, error) {
      alert('작품 정보 업데이트에 실패했습니다.');
    }
  });
}
  
function deleteWork(workId) {  
    if (workId) {
      if (!confirm('해당 작업을 삭제하시겠습니까?')) return;
      
      var csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');

      $.ajax({
        url: `/admin/work/delete/${workId}`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          _csrf: csrfToken
        }),
        success: function() {
          alert('작업이 삭제되었습니다.');
          $(`#work-row-${workId}`).remove();
        },
        error: function() {
          alert('작업 삭제에 실패했습니다.');
        }
      });
    }
  }
  
  /**********************************************************************/
  /* 공통버튼 컨트롤                                                        */
  /**********************************************************************/
  
  // 작업 추가 버튼
  $('#add-work-btn').on('click', function() {
    $('#addWorkModal').modal('show');
  });  
  
  $('#addWorkModal').on('click', '#create-work-btn', function() {
    createWork();
  });

  // 수정 버튼
  $('#work-table').on('click', '#edit-work-btn', function() {

    // 데이터 속성에서 작품 정보를 추출합니다.
    var id =         $(this).data('id');
    var title =      $(this).data('title');
    var year =       $(this).data('year');
    var medium =     $(this).data('medium');
    var dimensions = $(this).data('dimensions');
    var pieces =     $(this).data('pieces');
    var imagePath =  $(this).data('imagePath');

    // 모달의 입력 필드에 정보를 설정합니다.
    $('#edit-work-id').val(id);
    $('#edit-work-title').val(title);
    $('#edit-work-year').val(year);
    $('#edit-work-medium').val(medium);
    $('#edit-work-dimensions').val(dimensions);
    $('#edit-work-pieces').val(pieces);
    $('#edit-work-current-image').attr('src', imagePath);

    // 모달 창을 표시합니다.
    $('#editWorkModal').modal('show');
  });

  // 삭제 버튼
  $('#work-table').on('click', '#delete-work-btn', function() {
    var workId = $(this).data('id');
    if(workId && workId != "undefined"){
      deleteWork(workId);
    } 
  });

  // 저장 버튼
  $('#update-work-btn').on('click', function() {
    updateWork();
  });  
  

/**********************************************************************/
/* Object 컨트롤                                                        */
/**********************************************************************/

/**********************************************************************/
/* 사용자 정의                                                           */
/**********************************************************************/
    
    