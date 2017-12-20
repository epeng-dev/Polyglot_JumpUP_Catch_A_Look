var i = 0;

function want_room() {
    var make_room = document.getElementById("add_room");
    var darkly = document.getElementById("darkly");
    make_room.classList.remove("hidden");
    darkly.classList.remove("hidden");
}

function close_popup() {
    var make_room = document.getElementById("add_room");
    var darkly = document.getElementById("darkly");
    make_room.classList.add("hidden");
    darkly.classList.add("hidden");
    document.getElementById('room_name--input').value = "";
    document.getElementById('room_explan--input').value = "";
}

function make_room() {
    alert("안녕하세요. 함수 호출이 된거 같아요! 앙 기모띠!");
}

//-----------------------------------------------------------