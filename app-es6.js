class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

//Class for book list storage
class Store {
  static getBooks() {
    let books;

    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }

    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static deleteBook(isbn) {
    let books = Store.getBooks();

    books.forEach(function (book, index) {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
    // console.log(book);
  }

  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(function (book) {
      const ui = new UI();
      ui.addBookToList(book);
    });
  }
}

class UI {
  addBookToList(book) {
    const list = document.getElementById("book-list");

    //Create tr element for table
    const row = document.createElement("tr");

    row.innerHTML = `<td>${book.title}</td>
                       <td>${book.author}</td>
                       <td>${book.isbn}</td>
                       <a href='#' class='delete'>x</a>`;

    list.appendChild(row);

    // Store.addBook(book);
  }

  deleteBook(target) {
    if (target.className === "delete") {
      target.parentElement.remove();
    }
  }

  showAlert(message, className) {
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
  }

  clearFields() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  }
}

//DOM Load Event
document.addEventListener("DOMContentLoaded", Store.displayBooks());

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

  Store.addBook(book);

  e.preventDefault();
});

// Event listener for deleting Book
document.getElementById("book-list").addEventListener("click", function (e) {
  const ui = new UI();

  //Deletes from localStorage
  Store.deleteBook(e.target.previousElementSibling.textContent);

  ui.deleteBook(e.target);

  //Show message
  ui.showAlert(`Book Removed`, "success");

  e.preventDefault();
});
