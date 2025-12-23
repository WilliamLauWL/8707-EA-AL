// 所有記錄存放於此陣列
let leaves = [];

const STORAGE_KEY = 'leave_tracker_ea_al';

// 從 localStorage 載入
function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      leaves = JSON.parse(raw) || [];
    } else {
      leaves = [];
    }
  } catch (e) {
    leaves = [];
  }
}

// 儲存至 localStorage
function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leaves));
}

// 新增一條記錄
function addLeave() {
  const dateInput = document.getElementById('leaveDate');
  const typeInput = document.getElementById('leaveType');
  const daysInput = document.getElementById('leaveDays');
  const noteInput = document.getElementById('leaveNote');

  const date = dateInput.value;
  const type = typeInput.value;
  const days = parseFloat(daysInput.value || '0');
  const note = noteInput.value.trim();

  if (!date) {
    alert('請先選擇日期');
    return;
  }
  if (!days || days <= 0) {
    alert('天數必須大於 0');
    return;
  }

  leaves.push({
    id: Date.now(),      // 簡單唯一 ID
    date: date,          // 'YYYY-MM-DD'
    type: type,          // 'EA' 或 'AL'
    days: days,          // 數字，可半日
    note: note
  });

  saveData();
  renderTable();
  updateStats();

  // 重置輸入（日期保留今日方便連續輸入）
  daysInput.value = '1';
  noteInput.value = '';
}

// 刪除某一條記錄
function deleteLeave(id) {
  if (!confirm('確定刪除此記錄？')) return;
  leaves = leaves.filter(item => item.id !== id);
  saveData();
  renderTable();
  updateStats();
}

// 渲染表格
function renderTable() {
  const tbody = document.getElementById('recordsBody');
  tbody.innerHTML = '';

  // 按日期排序（由早到晚）
  const sorted = [...leaves].sort((a, b) => a.date.localeCompare(b.date));

  sorted.forEach((item, index) => {
    const tr = document.createElement('tr');

    const tdIndex = document.createElement('td');
    tdIndex.textContent = index + 1;

    const tdDate = document.createElement('td');
    tdDate.textContent = item.date;

    const tdType = document.createElement('td');
    tdType.textContent = item.type;

    const tdDays = document.createElement('td');
    tdDays.textContent = item.days;

    const tdNote = document.createElement('td');
    tdNote.textContent = item.note || '';

    const tdAction = document.createElement('td');
    const btn = document.createElement('button');
    btn.textContent
