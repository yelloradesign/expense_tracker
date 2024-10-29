// DOM Elements
const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const transactionListEl = document.getElementById("transactionList");
const openModalBtn = document.getElementById("openModalBtn");
const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("closeModalBtn");
const transactionForm = document.getElementById("transactionForm");
const nameInput = document.getElementById("name");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const typeSelect = document.getElementById("type");
const categorySelect = document.getElementById("category");
const submitBtn = document.getElementById("submitBtn");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let editIndex = -1; // To track the index of the item being edited

// Update Local Storage
function updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Update Balance
function updateBalance() {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    // Update balance display
    balanceEl.innerText = `₹${(income - expense).toFixed(2)}`;
    // Update income and expense display
    incomeEl.innerText = `₹${income.toFixed(2)}`;
    expenseEl.innerText = `₹${expense.toFixed(2)}`;
}

// Render Transactions
function renderTransactions() {
    transactionListEl.innerHTML = '';
    transactions.forEach((transaction, index) => {
        const li = document.createElement("li");
        li.classList.add(transaction.type); // Add class based on type
        li.innerHTML = `
            <span>${transaction.name} - ₹${transaction.amount.toFixed(2)} (${transaction.type})</span>
            <small>${transaction.date} - ${transaction.category}</small>
            <button class="edit-btn" onclick="editTransaction(${index})">Edit</button>
            <button class="delete-btn" onclick="deleteTransaction(${index})">Delete</button>
        `;
        transactionListEl.appendChild(li);
    });
}

// Open Modal
openModalBtn.onclick = function() {
    modal.style.display = "block";
    document.getElementById("modalTitle").innerText = "Add Transaction";
    submitBtn.innerText = "Add Transaction";
    editIndex = -1; // Reset edit index
}

// Close Modal
closeModalBtn.onclick = function() {
    modal.style.display = "none";
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Handle Transaction Form Submission
transactionForm.onsubmit = function(event) {
    event.preventDefault();
    const transaction = {
        name: nameInput.value,
        amount: parseFloat(amountInput.value),
        date: dateInput.value,
        type: typeSelect.value,
        category: categorySelect.value,
    };

    if (editIndex >= 0) {
        // Editing existing transaction
        transactions[editIndex] = transaction;
    } else {
        // Adding new transaction
        transactions.push(transaction);
    }

    updateLocalStorage();
    updateBalance();
    renderTransactions();
    modal.style.display = "none";
    transactionForm.reset(); // Reset the form fields
};

// Edit Transaction Function
function editTransaction(index) {
    editIndex = index;
    const transaction = transactions[index];
    nameInput.value = transaction.name;
    amountInput.value = transaction.amount;
    dateInput.value = transaction.date;
    typeSelect.value = transaction.type;
    categorySelect.value = transaction.category;

    modal.style.display = "block";
    document.getElementById("modalTitle").innerText = "Edit Transaction";
    submitBtn.innerText = "Update Transaction";
}

// Delete Transaction Function
function deleteTransaction(index) {
    transactions.splice(index, 1);
    updateLocalStorage();
    updateBalance();
    renderTransactions();
}

// Initial Load
updateBalance();
renderTransactions();
