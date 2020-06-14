const toDoForm = document.querySelector(".js-toDoForm"),
    toDoInput = toDoForm.querySelector("input"),
    toDoList = document.querySelector(".js-pending"),
    finishedList = document.querySelector(".js-finished");

const PENDING_LOCAL_STORAGE = "PENDING",
    FINISHED_LOCAL_STORAGE = "FINISHED";

let toDos = []; // object 타입으로 각 todo들의 데이터를 저장
let finToDos = [];
let newId = 1; // 고유한 값을 가지는 li 태그에 id를 부여하기 위해 만듦.

function switchLocalStorage(isFinished, currentId) {
    // array to object
    let moveItem;
    if(isFinished) {
        for(let i = 0; i < toDos.length; ++i) {
            if(toDos[i].id === parseInt(currentId, 10)) {
                moveItem = toDos.splice(i, 1);
                finToDos.push(moveItem[0]);
                break;
            }
        }
    } else {
        for(let i = 0; i < finToDos.length; ++i) {
            if(finToDos[i].id === parseInt(currentId, 10)) {
                moveItem = finToDos.splice(i, 1); 
                toDos.push(moveItem[0]);
                break;
            }
        }
    }
}

function switchToDo(event) {
    const btn = event.target; // event가 발생한 button element를 반환
    const li = btn.parentNode; // 부모 태그 element를 반환
    if (li.parentNode === toDoList) { // 현재 js-pending 클래스 소속
        finishedList.appendChild(li); 
        btn.innerText = "⏪";
        switchLocalStorage(true, li.id);
    } else { // 현재 js-finished 클래스 소속
        toDoList.appendChild(li);
        btn.innerText = "✔";
        switchLocalStorage(false, li.id);
    }
    saveLocalStorages(3);
}

function deleteToDo(event) {
    const btn = event.target; // event가 발생한 button element를 반환
    const li = btn.parentNode; // 부모 태그 element를 반환
    if (li.parentNode === toDoList) {
        toDoList.removeChild(li);
        const cleanToDos = toDos.filter(function(toDo) {
            return toDo.id !== parseInt(li.id, 10);
            // toDos 배열 안의 id 들과 삭제하기로 선택된 li 태그의 id가 다른 경우만 return한다.
            // 즉, 삭제하기로 선택된 태그는 cleanToDos 배열에 들어갈 수 없다.
        });
        toDos = cleanToDos;
        saveLocalStorages(1);
    } else {
        finishedList.removeChild(li);
        const cleanFinToDos = finToDos.filter(function(finToDo) {
            return finToDo.id !== parseInt(li.id, 10);
        });
        finToDos = cleanFinToDos;
        saveLocalStorages(2);
    }
}

function saveLocalStorages(eachSituation) {
    // JSON.stringify() => JavaScript의 object 타입을 string 타입으로 변환해준다.
    if (eachSituation === 1) {
        localStorage.setItem(PENDING_LOCAL_STORAGE, JSON.stringify(toDos));
    } else if (eachSituation === 2) {
        localStorage.setItem(FINISHED_LOCAL_STORAGE, JSON.stringify(finToDos));    
    } else { // 3
        localStorage.setItem(PENDING_LOCAL_STORAGE, JSON.stringify(toDos));
        localStorage.setItem(FINISHED_LOCAL_STORAGE, JSON.stringify(finToDos));
    }
}

function paintToDo(text) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    const delBtn = document.createElement("button");
    const chkBtn = document.createElement("button");
    delBtn.innerText = "❌";
    chkBtn.innerText = "✔";
    delBtn.addEventListener("click", deleteToDo); // click event
    chkBtn.addEventListener("click", switchToDo); // click event
    span.innerText = text;
    li.appendChild(span);
    li.appendChild(delBtn);
    li.appendChild(chkBtn);
    li.id = newId;
    toDoList.appendChild(li); // 이것들 때문에 함수 두개로 나눔
    const typeOfElement = {  // 너도
        text: text, // todo가 적힐 text
        id: newId // li에 부여할 고유한 id값
    };
    toDos.push(typeOfElement); // toDos 배열에 toDo object를 push
    newId++; // id값 1증가 => 절대 감소하지 않기 때문에 겹치지 않음
    saveLocalStorages(1); // 데이터 갱신
}

function paintFinToDo(text) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    const delBtn = document.createElement("button");
    const chkBtn = document.createElement("button");
    delBtn.innerText = "❌";
    chkBtn.innerText = "⏪";
    delBtn.addEventListener("click", deleteToDo); // click event
    chkBtn.addEventListener("click", switchToDo); // click event
    span.innerText = text;
    li.appendChild(span);
    li.appendChild(delBtn);
    li.appendChild(chkBtn);
    li.id = newId;
    finishedList.appendChild(li);
    const typeOfElement = {
        text: text, // todo가 적힐 text
        id: newId // li에 부여할 고유한 id값
    };
    finToDos.push(typeOfElement); // toDos 배열에 toDo object를 push
    newId++; // id값 1증가 => 절대 감소하지 않기 때문에 겹치지 않음
    saveLocalStorages(2); // 데이터 갱신
}

function handleSubmit(event) { // submit event
    event.preventDefault(); // 기본 동작 제한
    const currentValue = toDoInput.value; // input을 currentValue에 옮김
    paintToDo(currentValue); // input을 넘겨주고,
    toDoInput.value = ""; // 입력된 칸을 다시 비워준다. => 마치 submit된 효과
}

function loadToDos() {
    // 기존에 Local Storage에 저장된 값이 있다면 불러오는 역할
    const loadedToDos = localStorage.getItem(PENDING_LOCAL_STORAGE);
    if(loadedToDos !== null) {
        const parsedToDos = JSON.parse(loadedToDos);
        // JSON.parse() => JSON 타입의 문자열을 JavaScript의 object 타입으로 변환해준다.
        parsedToDos.forEach(function(toDo) {
            paintToDo(toDo.text);
        });
    }
    const loadedFinToDos = localStorage.getItem(FINISHED_LOCAL_STORAGE);
    if(loadedFinToDos !== null) {
        const parsedFinToDos = JSON.parse(loadedFinToDos);
        // JSON.parse() => JSON 타입의 문자열을 JavaScript의 object 타입으로 변환해준다.
        parsedFinToDos.forEach(function(finToDo) {
            paintFinToDo(finToDo.text);
        });
    }
}

function init() {
    loadToDos();
    toDoForm.addEventListener("submit", handleSubmit);
}

init();