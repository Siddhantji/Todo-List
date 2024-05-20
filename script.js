let arr = [];

const today = new Date();
const day = String(today.getDate()).padStart(2, "0"); // ensure two digits
const month = String(today.getMonth() + 1).padStart(2, "0"); // months are 0-based
const year = today.getFullYear();
const todayStr = `${year}-${month}-${day}`;

document.addEventListener("DOMContentLoaded", function () {
  load("myData");
  console.log("loaded");
});

document.getElementById("add").addEventListener("click", function (event) {
  event.preventDefault();
  let item = document.getElementById("item").value;
  let deadline = document.getElementById("deadline").value;
  let priority = document.getElementById("priority").value;
  if(item === '' || deadline.toString()===''){
    document.getElementById("msg").style.display="block";
    return;
  }
  document.getElementById("deadline").value = "";
  document.getElementById("priority").value = "";
  document.getElementById("item").value = "";
  const obj = {
    name: item,
    date: deadline,
    priority: priority,
    completed: false,
  };
  arr.push(obj);
  set("myData", arr);
  display(arr);
});

function set(key, value) {
  const jsonString = JSON.stringify(value);
  localStorage.setItem(key, jsonString);
}

function load(key) {
  const jdata = localStorage.getItem(key);
  arr = jdata ? JSON.parse(jdata) : [];
  console.log(arr);
  display(arr);
}
let comp = [];
let todayTasks = [];
let futureTasks = [];
function display(arr) {
  let b = [];
  comp = arr.filter((value) => value.completed === true);
  b = arr.filter((value) => !value.completed);

  b.sort((a, b) => new Date(a.date) - new Date(b.date));

  todayTasks = b.filter((value) => value.date === todayStr);
  futureTasks = b.filter((value) => value.date !== todayStr);

  dComplete(comp);
  dAll(todayTasks, "today");
  dAll(futureTasks, "future");
}

function dComplete(array) {
  let c = document.getElementById("complete");
  c.innerHTML = "";
  array.forEach((element, index) => {
    let k;
    if (element.priority == 0) {
      k = "Low";
    } else if (element.priority == 1) {
      k = "Medium";
    } else {
      k = "High";
    }
    c.innerHTML += `
      <div class="display" style:"border: 1px solid black">
        <p class="ms">${index + 1}. ${element.name}</p>
        <p>${element.date}</p>
        <p >Priority: ${k}</p>
        <div style="width:90px; display:flex; justify-content:end"><button class="d" onclick="deleteTask(${index},'complete')"><img class="w" src="./Vector.png" alt=""></button></div>
      </div>
    `;
  });
}

function dAll(array, id) {
  let c = document.getElementById(`${id}`);
  c.innerHTML = "";
  array.forEach((element, index) => {
    let k;
    if (element.priority == 0) {
      k = "Low";
    } else if (element.priority == 1) {
      k = "Medium";
    } else {
      k = "High";
    }
    c.innerHTML += `
      <div class="display black">
        <p class="ms">${index + 1}. ${element.name}</p>
        <p>${element.date}</p>
        <p>Priority: ${k}</p>
        <div class="btn">
          <button class="d black" onclick="complete(${index}, '${id}')"><img src="./check-circle 1.png" alt=""></button>
          <button class="d black" onclick="deleteTask(${index},'${id}')"><img src="./trash 1.png" alt=""></button>
        </div>
      </div>
    `;
  });
}

function deleteTask(index, id) {
  if (id == "complete") {
    comp.splice(index, 1);
  } else if (id == "today") {
    todayTasks.splice(index, 1);
  } else {
    futureTasks.splice(index, 1);
  }
  arr = [...comp, ...todayTasks, ...futureTasks];
  set("myData", arr);
  display(arr);
}

function complete(index, id) {
  if (id == "complete") {
    comp[index].completed = true;
  } else if (id == "today") {
    todayTasks[index].completed = true;
  } else {
    futureTasks[index].completed = true;
  }
  arr = [...comp, ...todayTasks, ...futureTasks];
  set("myData", arr);
  display(arr);
  console.log("complete called display");
}
