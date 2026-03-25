const KLASA = 28;

const NAZWISKA = [
  "Null","Bagiński","Czaja","Domcio","Górecki","Górski","Gręda","Kaja",
  "Kawul","Kopaczewski","Kopeć","Kotus","Kuligowski","Majewski","Fifi",
  "Mroczek","Nagodziński","Pająk","Podsiad","Roszpuna","Rojo","Kinga",
  "Skowron","Sobczak","cwel","Wąsikowski","Woszczyk","Alicja","Zjawa"
];

const LESSON_DAYS = [1, 2, 3, 5]; 

function formatDateInputValue(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function parseDateInput(value) {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function isLessonDay(date) {
  return LESSON_DAYS.includes(date.getDay());
}
function getNextLessonDate(fromDate, allowSameDay = false) {
  const d = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  if (!(allowSameDay && isLessonDay(d))) {
    d.setDate(d.getDate() + 1);
    while (!isLessonDay(d)) d.setDate(d.getDate() + 1);
  }
  return d;
}
function getPrevLessonDate(fromDate) {
  const d = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  d.setDate(d.getDate() - 1);
  while (!isLessonDay(d)) d.setDate(d.getDate() - 1);
  return d;
}

document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("idata");
  const now = new Date();

  let initialDate;
  if (isLessonDay(now) && now.getHours() < 16) {
    initialDate = now;
  } else {
    initialDate = getNextLessonDate(now, false);
  }

  dateInput.value = formatDateInputValue(initialDate);
  generateTableFromDateString(dateInput.value);
});

function applyDate(e){
  e.preventDefault();
  const inputEl = document.getElementById("idata");
  let d = parseDateInput(inputEl.value);
  if (!d) return;

  if (!isLessonDay(d)) {
    d = getNextLessonDate(d, false);
    inputEl.value = formatDateInputValue(d);
  }
  generateTableFromDateString(inputEl.value);
}

function jumpToNextLesson() {
  const inputEl = document.getElementById("idata");
  const base = parseDateInput(inputEl.value) || new Date();
  const next = getNextLessonDate(base, false);
  inputEl.value = formatDateInputValue(next);
  generateTableFromDateString(inputEl.value);
}
function jumpToPrevLesson() {
  const inputEl = document.getElementById("idata");
  const base = parseDateInput(inputEl.value) || new Date();
  const prev = getPrevLessonDate(base);
  inputEl.value = formatDateInputValue(prev);
  generateTableFromDateString(inputEl.value);
}

function generateTableFromDateString(datestr){
  if (!datestr) return;
  const parts = datestr.split("-");
  const day = parseInt(parts[2], 10);
  const month = parseInt(parts[1], 10);
  let orderArr = []; 
  if (month === 1) {
    orderArr = styczen(day, month);
  } else {
    orderArr = tabela(day, month);
  }
  renderRows(orderArr);
}

function renderRows(orderArr){
  const tbody = document.getElementById("tbody-rows");
  tbody.innerHTML = "";

  for (let kol = 1; kol <= KLASA; kol++) {
    const nr = orderArr[kol-1]; 
    const tr = document.createElement("tr");

    const tdKolejnosc = document.createElement("td");
    tdKolejnosc.textContent = kol;

    const tdImie = document.createElement("td");

    tdImie.textContent = (NAZWISKA[nr] !== undefined) ? NAZWISKA[nr] : ("#"+nr);

    const tdNr = document.createElement("td");
    tdNr.textContent = nr;

    tr.appendChild(tdKolejnosc);
    tr.appendChild(tdImie);
    tr.appendChild(tdNr);

    tbody.appendChild(tr);
  }
}

function tabela(number, month) {
  const nr_arr = [];
  let current = number;
  const result = [];

  for (let x = 1; x <= KLASA; x++) {
    let number_temp;
    if (current + month <= KLASA) {
      number_temp = current + month;
    } else {
      number_temp = current + month - KLASA;
    }
    current = number_temp;

    if (nr_arr.includes(current) && current === KLASA) {
      current = 1;
    } else if (nr_arr.includes(current)) {
      current++;
    }
    nr_arr.push(current);

    result.push(current);
  }
  return result;
}

function styczen(dayst, month) {
  const nrarr = [];
  const result = [];
  let numer;
  if (dayst + month <= KLASA) {
    numer = dayst + month;
  } else {
    numer = dayst + month - KLASA;
  }
  nrarr.push(numer);
  result.push(numer);

  let x = 2;
  while (x <= KLASA) {
    let wynik_temp;
    if (numer + dayst <= KLASA) {
      wynik_temp = numer + dayst;
    } else {
      wynik_temp = numer + dayst - KLASA;
    }
    numer = wynik_temp;

    if (nrarr.includes(numer) && numer === KLASA) {
      numer = 1;
    } else if (nrarr.includes(numer)) {
      numer++;
    }
    if (numer >= 24) { 
      numer -= KLASA;
    }
    nrarr.push(numer);
    result.push(numer);
    x++;
  }

  return result;
}
