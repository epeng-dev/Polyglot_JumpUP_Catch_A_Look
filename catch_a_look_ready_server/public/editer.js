var canvas;
var clearEl = $('clear-canvas');
var target;
var width = 20;
var mode;


function all_clear() {
    var clear_cheak = confirm("정말 지우시겠습니까?");
    if (clear_cheak == true) {
        canvas.clear();
        console.log("전체 지우기 실행");
    } else {
        console.log("전체 지우기 취소");
    }

};

$(function() {

    canvas = window._canvas = new fabric.Canvas('c');
    canvas.isDrawingMode = 1;
    canvas.freeDrawingBrush.width = 20;

    document.getElementById('pick').addEventListener('click', function(e) {
        target = e.target.id;
        if (target != "pick") {
            $('#choose_color').val(target);
            console.log("색 해쉬 코드 : " + target);
            canvas.freeDrawingBrush.color = target;
        }
    });
    $('#choose_color').change(function() {
        target = $('#choose_color').val();
        console.log("색 해쉬 코드 : " + target);
        canvas.freeDrawingBrush.color = target;
    });
    $("#owner_drawing").mouseup(function(e) {
        console.log("마우스 떼면 전송");
        setTimeout("trsvg_fun()", 100);

    });
});
/*
function noEvent() {
    if (event.keyCode == 123) {
            return false;
        }
    }
document.onkeydown = noEvent;
*/