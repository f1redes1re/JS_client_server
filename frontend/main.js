// Этап 1. В HTML файле создайте верстку элементов, которые будут статичны(неизменны).

// Этап 2. Создайте массив объектов студентов.Добавьте в него объекты студентов, например 5 студентов.

const SERVER_URL = 'http://localhost:3000';

async function serverAddStudent(obj) {
  let response = await fetch(SERVER_URL + '/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj),
  });

  let data = await response.json();

  return data
};

async function serverGetStudent() {
  let response = await fetch(SERVER_URL + '/api/students', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  let data = await response.json();

  return data
};

async function serverDeleteStudent(id) {
    let response = await fetch(SERVER_URL + '/api/students/' + id, {
      method: 'DELETE',
    });

    let data = await response.json();

    return data;
};

let studentsList = [];

let serverData = await serverGetStudent();

if (serverData) {
  studentsList = serverData;
};

// Этап 3. Создайте функцию вывода одного студента в таблицу, по аналогии с тем, как вы делали вывод одного дела в модуле 8. Функция должна вернуть html элемент с информацией и пользователе.У функции должен быть один аргумент - объект студента.

function getNewStudentTR(studentObj) {

  // Создание строки и ячеек для добавления информации о студенте
  const studentTr = document.createElement('tr'),
        studentFio = document.createElement('td'),
        studentFaculty = document.createElement('td'),
        studentBirthDate = document.createElement('td'),
        studentStartDate = document.createElement('td'),
        studentDeleteTd = document.createElement('td'),
        studentDeleteBtn = document.createElement('button');

  // Создание функции форматирования даты рождения и возраста
  function formatBirthDateAndCalculateAge(birthDate) {

    // Создание констант для даты рождения
    const birthYear = birthDate.getFullYear(),
          birthMonth = birthDate.getMonth(),
          birthDay = birthDate.getDate();

    // Создание константы для форматированной даты рождения
    const formattedBirthDate = `${String(birthDay).padStart(2, '0')}.${String(birthMonth + 1).padStart(2, '0')}.${birthYear}`;

    // Создание констант для текущей даты с целью определения возраста
    const currentDate = new Date(),
          currentYear = currentDate.getFullYear(),
          currentMonth = currentDate.getMonth(),
          currentDay = currentDate.getDate();

    // Создание переменной возраста и сверки с датой рождения
    let age = currentYear - birthYear;
    if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
      age--;
    };

    // Вывод форматированной даты рождения и возраста
    return `${formattedBirthDate} (${age} лет)`;
  };

  function formatStartDateAndCalculateCourse(studyStart) {

    // Создание констант для текущей даты с целью определения возраста
    const currentDate = new Date(),
          currentYear = currentDate.getFullYear(),
          currentMonth = currentDate.getMonth();

    // Создание переменных для последнего года обучения и номера курса
    let finalStudyYear = parseInt(studyStart) + 4;
    let studyStatus;

    // Проверка статуса обучения
    if (currentYear > finalStudyYear || (currentYear === finalStudyYear && parseInt(currentMonth) >= 9)) {
      studyStatus = 'Закончил';
    } else if (currentYear === studyStart && parseInt(currentMonth) < 9) {
      studyStatus = 'Скоро первый';
    } else if (currentYear === studyStart && parseInt(currentMonth) > 9) {
      studyStatus = 1;
    } else {
      studyStatus = parseInt(currentYear - studyStart);
    };

    // Итоговый вывод годов обучения и курса
    return `${studyStart}-${finalStudyYear} (${studyStatus} курс)`;
  };

  // Наполнение полей студента контентом
  studentFio.textContent = studentObj.lastname + " " + studentObj.name + " " + studentObj.surname;
  studentFaculty.textContent = studentObj.faculty;
  studentBirthDate.textContent = formatBirthDateAndCalculateAge(new Date(studentObj.birthday));
  studentStartDate.textContent = formatStartDateAndCalculateCourse(studentObj.studyStart);

  // Программирование кнопки "удалить"
  studentDeleteBtn.classList.add('btn', 'btn-danger', 'w-100');
  studentDeleteTd.append(studentDeleteBtn);
  studentDeleteBtn.textContent = 'Удалить';
  studentDeleteBtn.addEventListener('click', async function() {
    if (confirm('Вы уверены, что хотите удалить эту информацию')) {
      await serverDeleteStudent(studentObj.id);
      studentTr.remove();
    };
  });

  // Добавление в строку созданных ячеек
  studentTr.append(studentFio, studentFaculty, studentBirthDate, studentStartDate, studentDeleteTd);

  // Вывод строки с информацией о студенте
  return studentTr
};

// Этап 4. Создайте функцию отрисовки всех студентов. Аргументом функции будет массив студентов.Функция должна использовать ранее созданную функцию создания одной записи для студента.Цикл поможет вам создать список студентов.Каждый раз при изменении списка студента вы будете вызывать эту функцию для отрисовки таблицы.

async function renderStudentsTable(someList) {

  // Создание копии массива студентов
  let copyStudentList = [...someList];

  // Создание констант для таблицы, её заглавной строки
  const tableBody = document.getElementById('tableBody');

  tableBody.innerHTML = '';

  // Создание цикла отрисовки строки с данными студента в таблицу
  for (let student of copyStudentList) {
    const studentTr = getNewStudentTR(student);
    tableBody.append(studentTr);
  };
};

renderStudentsTable(studentsList);

// Этап 5. К форме добавления студента добавьте слушатель события отправки формы, в котором будет проверка введенных данных.Если проверка пройдет успешно, добавляйте объект с данными студентов в массив студентов и запустите функцию отрисовки таблицы студентов, созданную на этапе 4.

document.getElementById('studentForm').addEventListener('submit', async function(event) {

  // Отмена дефолт действия формы
  event.preventDefault();

  // Создание констант для формы и полей ввода данных
  const studentFormInputName = document.getElementById('studentForm__name'),
        studentFormInputSurname = document.getElementById('studentForm__surname'),
        studentFormInputLastname = document.getElementById('studentForm__lastname'),
        studentFormInputFaculty = document.getElementById('studentForm__faculty'),
        studentFormInputBirthDate = document.getElementById('studentForm__birthDate'),
        studentFormInputStudyStart = document.getElementById('studentForm__studyStart');

  // Создание атрибута для поля ввода дня рождения
  studentFormInputBirthDate.setAttribute('min', '1900-01-01');

  // Создание атрибутов для поля ввода года начала обучения
  const currentYear = new Date().getFullYear();
  studentFormInputStudyStart.setAttribute('min', '2000');
  studentFormInputStudyStart.setAttribute('max', currentYear.toString());

  // Валидация формы, проверка на пустоту для имени, фамилии и факультета
  if (!studentFormInputName.value.trim() || !studentFormInputLastname.value.trim() || !studentFormInputFaculty.value.trim()) {
    return
  };

  let newStudentObj = {
      name: studentFormInputName.value,
      lastname: studentFormInputLastname.value,
      surname: studentFormInputSurname.value,
      birthday: new Date(studentFormInputBirthDate.value).toISOString(),
      studyStart: parseInt(studentFormInputStudyStart.value),
      faculty: studentFormInputFaculty.value,
  };

  let serverDataObj = await serverAddStudent(newStudentObj);

  // Добавление информации о студенте в общий массив
  studentsList.push(serverDataObj);

  // Запуск функции отрисовки таблицы
  renderStudentsTable(studentsList);

  // Очистка полей ввода
  (function clearStudentInput() {
    studentFormInputName.value = '';
    studentFormInputSurname.value = '';
    studentFormInputLastname.value = '';
    studentFormInputFaculty.value = '';
    studentFormInputBirthDate.value = '';
    studentFormInputStudyStart.value = '';
  })();
});

// Этап 5. Создайте функцию сортировки массива студентов и добавьте события кликов на соответствующие колонки.

// Создание констант для столбцов заголовка таблицы
const tableHeadThFio = document.getElementById('tableHeadThFio'),
      tableHeadThFaculty = document.getElementById('tableHeadThFaculty'),
      tableHeadThBirthDate = document.getElementById('tableHeadThBirthDate'),
      tableHeadThStartDate = document.getElementById('tableHeadThStartDate');

// Создание переменной для направления сортировки
let isAscending = true;

// Создание обработчиков событий для сортировки
tableHeadThFio.addEventListener('click', function() {
  studentSort(studentsList, 'name');
});
tableHeadThFaculty.addEventListener('click', function() {
  studentSort(studentsList, 'faculty');
});
tableHeadThBirthDate.addEventListener('click', function() {
  studentSort(studentsList, 'birthday');
});
tableHeadThStartDate.addEventListener('click', function() {
  studentSort(studentsList, 'studyStart');
});

// Updated sort function with a second parameter to identify sorting criteria
function studentSort(arr, sortType) {
  if (isAscending) {
    arr.sort((a, b) => {
      if (sortType === 'name') {
        let fullNameA = `${a.lastname} ${a.name} ${a.surname}`.toUpperCase();
        let fullNameB = `${b.lastname} ${b.name} ${b.surname}`.toUpperCase();
        return fullNameA < fullNameB ? -1 : fullNameA > fullNameB ? 1 : 0;
      } else if (sortType === 'faculty') {
        return a.faculty.toUpperCase() < b.faculty.toUpperCase() ? -1 : a.faculty.toUpperCase() > b.faculty.toUpperCase() ? 1 : 0;
      } else if (sortType === 'birthday' || sortType === 'studyStart') {
        return new Date(a[sortType]) - new Date(b[sortType]);
      }
    });
  } else {
    arr.sort((a, b) => {
      if (sortType === 'name') {
        let fullNameA = `${a.lastname} ${a.name} ${a.surname}`.toUpperCase();
        let fullNameB = `${b.lastname} ${b.name} ${b.surname}`.toUpperCase();
        return fullNameA > fullNameB ? -1 : fullNameA < fullNameB ? 1 : 0;
      } else if (sortType === 'faculty') {
        return a.faculty.toUpperCase() > b.faculty.toUpperCase() ? -1 : a.faculty.toUpperCase() < b.faculty.toUpperCase() ? 1 : 0;
      } else if (sortType === 'birthday' || sortType === 'studyStart') {
        return new Date(b[sortType]) - new Date(a[sortType]);
      }
    });
  };
  isAscending = !isAscending;
  renderStudentsTable(arr);
};

// Этап 6. Создайте функцию фильтрации массива студентов и добавьте события для элементов формы.

(function studentFilter() {

  // Создание констант для полей ввода
  const filterInputStudentFio = document.getElementById('filterForm__fio');
  const filterInputStudentFaculty = document.getElementById('filterForm__faculty');
  const filterInputStudentstudyStart = document.getElementById('filterForm__studyStart');
  const filterInputStudentFinishYear = document.getElementById('filterForm__finishYear');

  let filterInputs = [filterInputStudentFio, filterInputStudentFaculty, filterInputStudentstudyStart, filterInputStudentFinishYear];

  filterInputs.forEach(input => {
    input.addEventListener('input', function() {
      applyFilters();
    });
  });

  function applyFilters() {

    // Создание переменных для введенных значений фильтров
    let fioInpVal = filterInputStudentFio.value;
    let facultyInpVal = filterInputStudentFaculty.value;
    let studyStartInpVal = filterInputStudentstudyStart.value;
    let finishYearInpVal = filterInputStudentFinishYear.value;

    // Создание массива студентов для отрисовки после фильтров
    let filteredStudents = [...studentsList];

    if (fioInpVal.trim() !== "") {
      filteredStudents = filterFio(filteredStudents, fioInpVal);
    }

    if (facultyInpVal.trim() !== "") {
      filteredStudents = filterFaculty(filteredStudents, facultyInpVal);
    }

    if (studyStartInpVal.trim() !== "") {
      filteredStudents = filterstudyStart(filteredStudents, studyStartInpVal);
    };

    if (finishYearInpVal.trim() !== "") {
      filteredStudents = filterFinishYear(filteredStudents, finishYearInpVal);
    };

    renderStudentsTable(filteredStudents);
  };

  // Создание фильтров по ФИО, факультету и годам
  function filterFio(studentsList, value) {
    let result = [],
        copy = [...studentsList];
    for (const item of copy) {
      const fullFio = `${item.lastname} ${item.name} ${item.surname}`;
      if (fullFio.toLowerCase().includes(value.toLowerCase())) result.push(item)
    }
    return result;
  };
  function filterFaculty(studentsList, value) {
    let result = [],
        copy = [...studentsList];
    for (const item of copy) {
      const faculty = String(item.faculty);
      if (faculty.includes(value) == true) result.push(item)
    }
    return result
  };
  function filterstudyStart(studentsList, value) {
    let result = [],
        copy = [...studentsList];
    for (const item of copy) {
      const studyStart = String(item.studyStart);
      if (studyStart.includes(value) == true) result.push(item)
    }
    return result
  };
  function filterFinishYear(studentsList, value) {
    let result = [],
        copy = [...studentsList];
    for (const item of copy) {
      const finishYear = String(parseInt(item.studyStart) + 4);
      if (finishYear.includes(value) == true) result.push(item)
    }
    return result
  };
})();
