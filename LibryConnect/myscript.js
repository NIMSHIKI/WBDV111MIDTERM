let libraryCatalog = [
  { title: 'Naruto Vol. 1', author: 'Masashi Kishimoto', genre: 'Shonen Manga', available: true },
  { title: 'One Piece Vol. 1', author: 'Eiichiro Oda', genre: 'Shonen Manga', available: true },
  { title: 'Jujutsu Kaisen Vol. 1', author: 'Gege Akutami', genre: 'Shonen Manga', available: true }
];

let searchTimeout = null;
let activeSearchQuery = '';

function searchBook() {
  activeSearchQuery = document.getElementById('searchInput').value.trim();
  const query = activeSearchQuery;
  const statusMessage = document.getElementById('statusMessage');
  const resultsPanel = document.getElementById('searchResults');

  if (!query) {
    statusMessage.textContent = 'Please enter a search query.';
    statusMessage.className = 'status-text warning';
    resultsPanel.innerHTML = '';
    return;
  }

  const q = query.toLowerCase();
  const matches = libraryCatalog.filter(item => {
    return (
      item.title.toLowerCase().includes(q) ||
      item.author.toLowerCase().includes(q) ||
      item.genre.toLowerCase().includes(q)
    );
  });

  if (matches.length === 0) {
    statusMessage.textContent = `No results found for "${query}".`;
    statusMessage.className = 'status-text danger';
    resultsPanel.innerHTML = '';
    return;
  }

  statusMessage.textContent = `${matches.length} result(s) found for "${query}".`;
  statusMessage.className = 'status-text success';

  renderResults(matches);
}

function updateStatus(message, statusType) {
  const statusMessage = document.getElementById('statusMessage');
  if (!statusMessage) return;
  statusMessage.textContent = message;
  statusMessage.className = `status-text ${statusType}`;
}

function liveSearchBook() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(searchBook, 250);
}

function clearSearch() {
  document.getElementById('searchInput').value = '';
  document.getElementById('statusMessage').textContent = '';
  document.getElementById('statusMessage').className = 'status-text';
  document.getElementById('searchResults').innerHTML = '';
  activeSearchQuery = '';
}

function borrowBook(title) {
  const book = libraryCatalog.find(item => item.title === title);
  if (!book) {
    updateStatus('Could not find the book to borrow.', 'danger');
    return;
  }

  if (!book.available) {
    updateStatus(`'${title}' is already checked out.`, 'warning');
    return;
  }

  book.available = false;
  updateStatus(`You have successfully borrowed '${title}'.`, 'success');

  if (activeSearchQuery) {
    searchBook();
  } else {
    renderResults(libraryCatalog);
  }
}

function renderResults(results) {
  const resultsPanel = document.getElementById('searchResults');
  resultsPanel.innerHTML = '';

  const table = document.createElement('table');
  const head = document.createElement('thead');
  head.innerHTML = `
    <tr>
      <th>Title</th>
      <th>Author</th>
      <th>Genre</th>
      <th>Status</th>
      <th>Action</th>
    </tr>
  `;
  table.appendChild(head);

  const body = document.createElement('tbody');
  results.forEach(item => {
    const row = document.createElement('tr');
    const actionButton = item.available
      ? `<button class="small" onclick="borrowBook('${item.title.replaceAll("'", "\\'") }')">Borrow</button>`
      : '';

    row.innerHTML = `
      <td>${item.title}</td>
      <td>${item.author}</td>
      <td>${item.genre}</td>
      <td class="${item.available ? 'available' : 'unavailable'}">${item.available ? 'Available' : 'Checked out'}</td>
      <td>${actionButton}</td>
    `;
    body.appendChild(row);
  });

  table.appendChild(body);
  resultsPanel.appendChild(table);
}

function showOverdue() {
  const overdueInfo = document.getElementById('overdueInfo');
  if (overdueInfo) {
    overdueInfo.textContent = 'Overdue books must be returned within 7 days. Fine: $1/day.';
  }
}

let loanRecords = [
  { book: 'The Great Gatsby', borrower: 'Juan Dela Cruz', dueDate: '2026-03-25', status: 'Overdue' },
  { book: '1984', borrower: 'Maria Santos', dueDate: '2026-04-10', status: 'Returned' }
];

function saveData() {
  localStorage.setItem('libraryCatalog', JSON.stringify(libraryCatalog));
  localStorage.setItem('libraryMembers', JSON.stringify(libraryMembers));
  localStorage.setItem('loanRecords', JSON.stringify(loanRecords));
}

function loadData() {
  const storedCatalog = localStorage.getItem('libraryCatalog');
  const storedMembers = localStorage.getItem('libraryMembers');
  const storedLoans = localStorage.getItem('loanRecords');

  if (storedCatalog) {
    try {
      const parsed = JSON.parse(storedCatalog);
      if (Array.isArray(parsed)) libraryCatalog = parsed;
    } catch (e) {}
  }

  if (storedMembers) {
    try {
      const parsed = JSON.parse(storedMembers);
      if (Array.isArray(parsed)) libraryMembers = parsed;
    } catch (e) {}
  }

  if (storedLoans) {
    try {
      const parsed = JSON.parse(storedLoans);
      if (Array.isArray(parsed)) loanRecords = parsed;
    } catch (e) {}
  }
}

function renderLoanPickers() {
  const bookOptions = document.getElementById('bookOptions');
  const memberOptions = document.getElementById('memberOptions');
  if (!bookOptions || !memberOptions) return;

  bookOptions.innerHTML = '';
  memberOptions.innerHTML = '';

  libraryCatalog
    .filter(item => item.available)
    .forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.title;
      bookOptions.appendChild(opt);
    });

  libraryMembers.forEach(member => {
    const opt = document.createElement('option');
    opt.value = member.name;
    memberOptions.appendChild(opt);
  });
}

function renderLoans(list) {
  const tbody = document.querySelector('#loanTable tbody');
  if (!tbody) return;

  tbody.innerHTML = '';
  const today = new Date();

  list.forEach((loan, index) => {
    const due = new Date(loan.dueDate);
    let status = loan.status;
    if (status !== 'Returned' && due < today) {
      status = 'Overdue';
    }

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${loan.book}</td>
      <td>${loan.borrower}</td>
      <td>${loan.dueDate}</td>
      <td class="${status === 'Overdue' ? 'danger' : status === 'Returned' ? 'available' : 'warning'}">${status}</td>
      <td>
        ${status !== 'Returned' ? `<button class="small" onclick="markReturned(${index})">Mark Returned</button>` : ''}
      </td>
    `;

    tbody.appendChild(row);
  });
}

function updateLoanMessage(message, type = 'success') {
  const messageEl = document.getElementById('loanMessage');
  if (!messageEl) return;
  messageEl.textContent = message;
  messageEl.className = `status-text ${type === 'success' ? 'success' : type === 'danger' ? 'danger' : 'warning'}`;
}

function addLoan() {
  const bookInput = document.getElementById('newLoanBook');
  const borrowerInput = document.getElementById('newLoanBorrower');
  const dueDateInput = document.getElementById('newLoanDueDate');

  const bookName = bookInput.value.trim();
  const borrowerName = borrowerInput.value.trim();
  const dueDate = dueDateInput.value;

  if (!bookName || !borrowerName || !dueDate) {
    updateLoanMessage('Book, borrower, and due date are required.', 'warning');
    return;
  }

  const bookItem = libraryCatalog.find(item => item.title.toLowerCase() === bookName.toLowerCase());
  if (!bookItem) {
    updateLoanMessage(`Book '${bookName}' is not in catalog.`, 'danger');
    return;
  }

  if (!bookItem.available) {
    updateLoanMessage(`Book '${bookItem.title}' is currently checked out.`, 'danger');
    return;
  }

  const member = libraryMembers.find(m => m.name.toLowerCase() === borrowerName.toLowerCase());
  if (!member) {
    updateLoanMessage(`Member '${borrowerName}' not found.`, 'danger');
    return;
  }

  const due = new Date(dueDate);
  if (isNaN(due.getTime())) {
    updateLoanMessage('Data inválida de vencimento.', 'danger');
    return;
  }

  if (due < new Date().setHours(0, 0, 0, 0)) {
    updateLoanMessage('Due date must be today or in the future.', 'warning');
    return;
  }

  loanRecords.push({ book: bookItem.title, borrower: member.name, dueDate, status: 'Loaned' });
  bookItem.available = false;
  saveData();
  renderLoans(loanRecords);
  renderLoanPickers();

  bookInput.value = '';
  borrowerInput.value = '';
  dueDateInput.value = '';
  updateLoanMessage('Loan added successfully.', 'success');
}

function markReturned(index) {
  if (index >= 0 && index < loanRecords.length) {
    const record = loanRecords[index];
    record.status = 'Returned';
    const bookItem = libraryCatalog.find(item => item.title === record.book);
    if (bookItem) bookItem.available = true;
    saveData();
    renderLoans(loanRecords);
    renderLoanPickers();
    updateLoanMessage('Loan marked as returned.', 'success');
  }
}

function filterLoans() {
  const query = document.getElementById('loanSearchInput').value.trim().toLowerCase();
  if (!query) {
    renderLoans(loanRecords);
    return;
  }

  const filtered = loanRecords.filter(loan =>
    loan.book.toLowerCase().includes(query) || loan.borrower.toLowerCase().includes(query)
  );

  renderLoans(filtered);
}

function resetLoanSearch() {
  document.getElementById('loanSearchInput').value = '';
  renderLoans(loanRecords);
  updateLoanMessage('Search reset.', 'success');
}

let libraryMembers = [
  { name: 'Juan Dela Cruz', id: '001' },
  { name: 'Maria Santos', id: '002' }
];

function renderMembers(list) {
  const tbody = document.querySelector('#memberTable tbody');
  if (!tbody) return;

  tbody.innerHTML = '';
  list.forEach((member, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${member.name}</td>
      <td>${member.id}</td>
      <td><button class="small danger" onclick="removeMember(${index})">Remove</button></td>
    `;

    tbody.appendChild(row);
  });
}

function updateMemberMessage(message, type = 'success') {
  const messageEl = document.getElementById('memberMessage');
  if (!messageEl) return;
  messageEl.textContent = message;
  messageEl.className = `status-text ${type === 'success' ? 'success' : type === 'danger' ? 'danger' : 'warning'}`;
}

function addMember() {
  const nameInput = document.getElementById('newMemberName');
  const idInput = document.getElementById('newMemberId');

  const name = nameInput.value.trim();
  const id = idInput.value.trim();

  if (!name || !id) {
    updateMemberMessage('Name and ID are required.', 'warning');
    return;
  }

  if (libraryMembers.some(member => member.id.toLowerCase() === id.toLowerCase())) {
    updateMemberMessage('Member ID already exists.', 'danger');
    return;
  }

  libraryMembers.push({ name, id });
  saveData();
  renderMembers(libraryMembers);
  renderLoanPickers();

  nameInput.value = '';
  idInput.value = '';
  updateMemberMessage('Member added successfully.', 'success');
}

function removeMember(index) {
  if (index >= 0 && index < libraryMembers.length) {
    libraryMembers.splice(index, 1);
    saveData();
    renderMembers(libraryMembers);
    renderLoanPickers();
    updateMemberMessage('Member removed.', 'warning');
  }
}

function filterMembers() {
  const query = document.getElementById('memberSearchInput').value.trim().toLowerCase();
  if (!query) {
    renderMembers(libraryMembers);
    return;
  }

  const filtered = libraryMembers.filter(member =>
    member.name.toLowerCase().includes(query) || member.id.toLowerCase().includes(query)
  );

  renderMembers(filtered);
}

function resetMemberSearch() {
  document.getElementById('memberSearchInput').value = '';
  renderMembers(libraryMembers);
  updateMemberMessage('Search reset.', 'success');
}

document.addEventListener('DOMContentLoaded', () => {
  loadData();

  const suggestions = document.getElementById('bookSuggestions');
  if (suggestions) {
    libraryCatalog.forEach(item => {
      const option = document.createElement('option');
      option.value = `${item.title} (${item.author})`;
      suggestions.appendChild(option);
    });
  }

  const memberTable = document.getElementById('memberTable');
  if (memberTable) {
    renderMembers(libraryMembers);
  }

  const loanTable = document.getElementById('loanTable');
  if (loanTable) {
    renderLoans(loanRecords);
    renderLoanPickers();
  }

  // make sure library-derived form lists are fresh
  renderLoanPickers();
});