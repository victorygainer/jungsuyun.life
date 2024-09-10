/**********************************************************************/
/* 화면 초기화 및 초기설정                                                  */
/**********************************************************************/

$(document).ready(function() {
  // 테이블 설정
  setupDataTable();

  // 한글패치
  koreanPatch();
});

/**********************************************************************/
/* 서비스 트랜잭션 함수                                                    */
/**********************************************************************/

function createProfile(e) {

  var status = $("#profile-table tbody tr.new-profile").length > 0;

  if(status){
    if (!confirm('이 프로필을 저장하시겠습니까?')) return;

    var isValid = true;
    var params = [];

    $("#profile-table tbody tr.new-profile").each(function () {

      var profiles = {
        title: $(this).find("input[name='title']").val(),
        year: $(this).find("input[name='year']").val(),
        language: $(this).find("select[name='language']").val(),
        category: $(this).find("select[name='category']").val()
      };
  
      // 현재 행의 모든 필드에 대한 유효성 검사
      var rowIsValid = validCheck($(this).find("input[name='title']")) &&
                       validCheck($(this).find("input[name='year']")) &&
                       validCheck($(this).find("select[name='language']")) &&
                       validCheck($(this).find("select[name='category']"));
  
      if (!rowIsValid) {
        isValid = false;
      } else {
        params.push(profiles);
      }
    });

    var csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
  
    if (isValid && params.length > 0) {
      $.ajax({
        url: `/admin/profile/create`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ 
          params: params,
          _csrf: csrfToken
        }),
        success: function () {
          alert('프로필이 등록되었습니다.');
          window.location.reload();
        },
        error: function () {
          alert('프로필 등록에 실패했습니다.');
        }
      });
    } 
    // else {
    //   alert('입력한 데이터 중 유효하지 않은 항목이 있습니다. 다시 확인해주세요.');
    // }
  } else {
    return false;
  }
}

function deleteProfile(profileId) {  
  if (profileId !== undefined) {
    if (!confirm('이 프로필을 삭제하시겠습니까?')) return;

    // CSRF 토큰 가져오기
    var csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');

    $.ajax({
      url: `/admin/profile/delete/${profileId}`,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        _csrf: csrfToken
      }),
      success: function() {
        alert('프로필이 삭제되었습니다.');
        $(`#profile-row-${profileId}`).remove();
      },
      error: function() {
        alert('프로필 삭제에 실패했습니다.');
      }
    });
  }
}

function updateProfile(profileId) {
  var $row = $('#profile-row-' + profileId);
  var title = $row.find("input[name='title']").val();
  var year = $row.find("input[name='year']").val();
  var language = $row.find("select[name='language']").val();
  var category = $row.find("select[name='category']").val();

  if (profileId) {
    if (!confirm('이 프로필을 수정하시겠습니까?')) return;

    var csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');

    $.ajax({
      url: `/admin/profile/update/${profileId}`,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        // 여기에 수정할 프로필 데이터를 추가
        title: title,
        year: year,
        language: language,
        category: category,
        _csrf: csrfToken
      }),
      success: function () {
        alert('프로필이 수정되었습니다.');
        window.location.reload();
      },
      error: function () {
        alert('프로필 수정에 실패했습니다.');
      }
    });
  }

  $('#add-profile-btn').prop('disabled', false);
  $('#save-profile-btn').prop('disabled', false);
  $('.btn-info, .btn-danger').prop('disabled', false);
}

/**********************************************************************/
/* 공통버튼 컨트롤                                                        */
/**********************************************************************/

function buttonState() {
  var btnStatus = $("#profile-table tbody tr.new-profile").length > 0;
  $('.btn-info').prop('disabled', btnStatus);
}

// 프로필 추가
$('#add-profile-btn').on('click', addProfile);

// 프로필 저장 
$('#save-profile-btn').on('click', createProfile);

// 삭제 버튼
$('#profile-table').on('click', '#delete-profile', function() {
    var profileId = $(this).data('id');
    if(profileId && profileId != "undefined"){
      deleteProfile(profileId);
    } else {
      $(this).closest('tr').remove();
      buttonState();
    }
});

// 수정 버튼
$('#profile-table').on('click', '#edit-profile', function() {
  var profileId = $(this).data('id');
  editProfile(profileId);
});

// 수정완료 버튼
$('#profile-table').on('click', '#update-profile', function() {
  var profileId = $(this).data('id');
  updateProfile(profileId);
});

// 취소 버튼
$('#profile-table').on('click', '#cancel-edit', function() {
  var profileId = $(this).data('id');
  cancelEdit();
});

/**********************************************************************/
/* Object 컨트롤                                                        */
/**********************************************************************/

function addProfile() {
  $('.btn-info').prop('disabled', true);
  var rowItem = `
  <tr class='new-profile'>
    <td></td>
    <td><input type='text'   name='title' id='title'/>
      <p></p>  
    </td>

    <td><input type='number' name='year' id='year'/>
      <p></p>
    </td>

    <td>
      <select name='language' id='language'>
        <option value='Korean'>한국어</option>
        <option value='English'>영어</option>
      </select>
    </td>
    <td>
      <select name='category' id='category'>
        <option value='biography'>이력</option>
        <option value='solo_exhibition'>개인전</option>
        <option value='group_exhibition'>단체전</option>
        <option value='award'>수상</option>
      </select>
    </td>
    <td>
      <button class="btn btn-sm btn-danger" id="delete-profile">삭제</button>
    </td>
  </tr>
`;

  $('#profile-table tbody').append(rowItem);
}

function editProfile(profileId) {
  $('#add-profile-btn').prop('disabled', true);
  $('#save-profile-btn').prop('disabled', true);
  $('.btn-info, .btn-danger').prop('disabled', true);

  var $row = $('#profile-row-' + profileId);
  var title = $row.find('.profile-title').text();
  var year = $row.find('.profile-year').text();
  var language = $row.find('.profile-language').attr('data-language');
  var category = $row.find('.profile-category').attr('data-category');

  //원본데이터 저장
  $row.data('original', {
    profileId: profileId,
    title: $row.find('.profile-title').text(),
    year: $row.find('.profile-year').text(),
    language: $row.find('.profile-language').data('language'),
    category: $row.find('.profile-category').data('category')
  });

  $row.find('.profile-title').html(`<input type="text" name="title" value="${title}" />`);
  $row.find('.profile-year').html(`<input type="number" name="year" value="${year}" />`);
  $row.find('.profile-language').html(`
    <select name="language">
      <option value="Korean" ${language === 'Korean' ? 'selected' : ''}>한국어</option>
      <option value="English" ${language === 'English' ? 'selected' : ''}>영어</option>
    </select>
  `);
  $row.find('.profile-category').html(`
    <select name="category">
      <option value="biography" ${category === 'biography' ? 'selected' : ''}>이력</option>
      <option value="solo_exhibition" ${category === 'solo_exhibition' ? 'selected' : ''}>개인전</option>
      <option value="group_exhibition" ${category === 'group_exhibition' ? 'selected' : ''}>단체전</option>
      <option value="award" ${category === 'award' ? 'selected' : ''}>수상</option>
    </select>
  `);

  $row.find('td:last-child').html(
    `
    <button class="btn btn-sm btn-primary" id="update-profile" data-id="${profileId}">수정완료</button>
    <button class="btn btn-sm btn-warning" id="cancel-edit">취소</button>
    `
  );
}

function cancelEdit() {
  $('#profile-table tbody tr').each(function() {
    var $row = $(this);

    if ($row.data('original')) {
      // 저장된 원본 데이터로 복원
      var original = $row.data('original');
      $row.find('.profile-title').html(original.title);
      $row.find('.profile-year').html(original.year);
      $row.find('.profile-language').html(original.language).attr('data-language', original.language);
      $row.find('.profile-category').html(original.category).attr('data-category', original.category);

      // "수정"과 "삭제" 버튼 재표시
      $row.find('td:last-child').html(
      `
      <button class="btn btn-sm btn-info" id="edit-profile" data-id="${original.profileId}">수정</button>
      <button class="btn btn-sm btn-danger" id="delete-profile" data-id="${original.profileId}">삭제</button>
      `
     );

      $('.btn-info, .btn-danger').prop('disabled', false);
    }
  });

  koreanPatch();

  // "프로필 추가" 및 "프로필 저장" 버튼 다시 활성화
  $('#add-profile-btn').prop('disabled', false);
  $('#save-profile-btn').prop('disabled', false);
}

/**********************************************************************/
/* 사용자 정의                                                           */
/**********************************************************************/

function setupDataTable() {
  $('#profile-table').DataTable({
    "paging": false,
    "lengthChange": false,
    "searching": false,
    "ordering": true,
    "info": false,
    "autoWidth": false,
    "responsive": true,
  });
}

function koreanPatch() {
  $('[data-category]').each(function () {
    var category = $(this).data('category');
    switch (category) {
      case 'biography':
        $(this).text('이력');
        break;
      case 'solo_exhibition':
        $(this).text('개인전');
        break;
      case 'group_exhibition':
        $(this).text('단체전');
        break;
      case 'award':
        $(this).text('수상');
        break;
    }
  });

  $('[data-language]').each(function () {
    var language = $(this).data('language');
    switch (language) {
      case 'Korean':
        $(this).text('한국어');
        break;
      case 'English':
        $(this).text('영어');
        break;
    }
  });
}

function validCheck(e) {
  var checkText = "";
  var thisVal = $(e).val();

  switch ($(e).attr("name")) {
    case "title":
      if (thisVal.length == 0) {
        checkText = "타이틀을 입력해주세요.";
      }
      break;
    case "year":
      if (thisVal.length == 0) {
        checkText = "연도를 입력해주세요.";
      }
      break;
  }

  if (checkText != "") {
    $(e).next("p").html(checkText).show();
    return false;
  } else {
    $(e).next("p").hide();
    return true;
  }
}
  
  