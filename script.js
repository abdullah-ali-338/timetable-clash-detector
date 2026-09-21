const STORAGE_KEY = 'timetable_schedule_data';

const form = document.getElementById('course-form');
const nameInput = document.getElementById('course-name');
const daySelect = document.getElementById('day-select');
const startInput = document.getElementById('start-time');
const endInput = document.getElementById('end-time');
const formError = document.getElementById('form-error');

const emptyState = document.getElementById('empty-state');
const scheduleList = document.getElementById('schedule-list');
const conflictBanner = document.getElementById('conflict-banner');
const clearAllBtn = document.getElementById('clear-all-btn');

function getStoredCourses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    showFormError('Corrupted schedule data found in storage. Resetting storage.');
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

function saveCourses(courses) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
}

function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function checkOverlap(c1, c2) {
  if (c1.day !== c2.day) return false;
  const startA = timeToMinutes(c1.startTime);
  const endA = timeToMinutes(c1.endTime);
  const startB = timeToMinutes(c2.startTime);
  const endB = timeToMinutes(c2.endTime);
  return Math.max(startA, startB) < Math.min(endA, endB);
}

function showFormError(msg) {
  formError.textContent = msg;
  formError.hidden = false;
}

function clearFormError() {
  formError.textContent = '';
  formError.hidden = true;
}

function render() {
  const courses = getStoredCourses();

  if (courses.length === 0) {
    emptyState.hidden = false;
    scheduleList.hidden = true;
    conflictBanner.hidden = true;
    clearAllBtn.hidden = true;
    return;
  }

  emptyState.hidden = true;
  scheduleList.hidden = false;
  clearAllBtn.hidden = false;
  scheduleList.innerHTML = '';

  const conflictingIds = new Set();

  for (let i = 0; i < courses.length; i++) {
    for (let j = i + 1; j < courses.length; j++) {
      if (checkOverlap(courses[i], courses[j])) {
        conflictingIds.add(courses[i].id);
        conflictingIds.add(courses[j].id);
      }
    }
  }

  if (conflictingIds.size > 0) {
    conflictBanner.textContent = `Warning: ${conflictingIds.size} schedule slot(s) contain overlapping time intervals.`;
    conflictBanner.hidden = false;
  } else {
    conflictBanner.hidden = true;
  }

  courses.forEach(course => {
    const isConflict = conflictingIds.has(course.id);
    const item = document.createElement('div');
    item.className = `course-card ${isConflict ? 'conflict' : ''}`;

    const info = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = course.name;

    if (isConflict) {
      const badge = document.createElement('span');
      badge.className = 'conflict-tag';
      badge.textContent = 'CLASH';
      title.appendChild(badge);
    }

    const meta = document.createElement('p');
    meta.className = 'course-meta';
    meta.textContent = `${course.day} | ${course.startTime} - ${course.endTime}`;

    info.appendChild(title);
    info.appendChild(meta);

    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn-remove';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => removeCourse(course.id));

    item.appendChild(info);
    item.appendChild(removeBtn);
    scheduleList.appendChild(item);
  });
}

function addCourse(name, day, startTime, endTime) {
  clearFormError();

  const startMin = timeToMinutes(startTime);
  const endMin = timeToMinutes(endTime);

  if (startMin >= endMin) {
    showFormError('End time must be later than start time.');
    return;
  }

  if (endMin - startMin < 30) {
    showFormError('Lecture slot must be at least 30 minutes in duration.');
    return;
  }

  const courses = getStoredCourses();
  courses.push({
    id: Date.now().toString(),
    name,
    day,
    startTime,
    endTime
  });

  saveCourses(courses);
  form.reset();
  render();
}

function removeCourse(id) {
  let courses = getStoredCourses();
  courses = courses.filter(c => c.id !== id);
  saveCourses(courses);
  render();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  addCourse(
    nameInput.value.trim(),
    daySelect.value,
    startInput.value,
    endInput.value
  );
});

clearAllBtn.addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  render();
});

render();
