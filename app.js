//Book constuctor
function Book(title, author, isbn) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}

//UI Constructor
function UI() {}

//Add book to list
UI.prototype.addBookToList = function (book) {
  const list = document.getElementById("book-list");

  //Create tr element for table
  const row = document.createElement("tr");

  row.innerHTML = `<td>${book.title}</td>
                     <td>${book.author}</td>
                     <td>${book.isbn}</td>
                     <a href='#' class='delete'>x</a>`;

  list.appendChild(row);
};

//Clears the form fields
UI.prototype.clearFields = function () {
  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  document.getElementById("isbn").value = "";
};

//Deletes a Book
UI.prototype.deleteBook = function (target) {
  if (target.className === "delete") {
    target.parentElement.remove();
  }
};

//Alert for error
UI.prototype.showAlert = function (message, className) {
  const div = document.createElement("div");

  div.className = `alert ${className} u-full-width`;
  div.appendChild(document.createTextNode(message));

  //Get parent
  const container = document.querySelector(".container");
  const form = document.querySelector("#book-form");

  container.insertBefore(div, form);

  setTimeout(function () {
    document.querySelector(".alert").remove();
  }, 3000);
};

//Local Storage of Books
function Store() {}

Store.prototype.addBook = function (book) {
  const storage = new Store();
  const books = storage.getBooks();

  books.push(book);
  localStorage.setItem("books", JSON.stringify(books));
};

Store.prototype.deleteBook = function (isbn) {
  const storage = new Store();
  let books = storage.getBooks();

  books.forEach(function (book, index) {
    if (book.isbn === isbn) {
      books.splice(index, 1);
    }
  });

  localStorage.setItem("books", JSON.stringify(books));
};

Store.prototype.getBooks = function () {
  let books;

  if (localStorage.getItem("books") === null) {
    books = [];
  } else {
    books = JSON.parse(localStorage.getItem("books"));
  }

  return books;
};

Store.prototype.displayBooks = function () {
  const storage = new Store();
  const books = storage.getBooks();

  books.forEach(function (book) {
    const ui = new UI();
    ui.addBookToList(book);
  });
};

//DOM Load Event
document.addEventListener("DOMContentLoaded", function () {
  const storage = new Store();
  storage.displayBooks();
});

//Event Listener for adding Book
document.getElementById("book-form").addEventListener("submit", function (e) {
  //Get form values
  const title = document.getElementById("title").value,
    author = document.getElementById("author").value,
    isbn = document.getElementById("isbn").value;

  //Instantiate Book
  const book = new Book(title, author, isbn);

  const ui = new UI();

  if (title === "" || author === "" || isbn === "") {
    ui.showAlert("Please fill in all fields", "error");
  } else {
    //Adds book to list
    ui.addBookToList(book);

    //Clears the form fields
    ui.clearFields();

    ui.showAlert("Added book", "success");
  }

  //Save to local storage
  const storage = new Store();
  storage.addBook(book);

  e.preventDefault();
});

// Event listener for deleting Book
document.getElementById("book-list").addEventListener("mouseup", function (e) {
  const ui = new UI();

  //Delete from Local Storage
  const storage = new Store();
  storage.deleteBook(e.target.previousElementSibling.textContent);

  //Deletes book
  ui.deleteBook(e.target);

  //Show message
  ui.showAlert(`Book Removed`, "success");

  e.preventDefault();
});
