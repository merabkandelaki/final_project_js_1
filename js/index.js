const userList = document.querySelector(".users-info-cards");
let oldID = null;
let users = [];

/* open modal new user */
const newUser = document.querySelector(".new-user");
const modalNewUser = document.querySelector(".modal-create-user");
const titleApplication = document.querySelector(".title-application");

newUser.addEventListener("click", () => {
  modalNewUser.style.display = "block";
  newUser.style.opacity = 0.15;
  userList.style.opacity = 0.15;
  titleApplication.style.opacity = 0.15;
});

/* close modal new user */
const closeNewUser = document.querySelector(".close");
closeNewUser.addEventListener("click", () => {
  modalNewUser.style.display = "none";
  newUser.style.opacity = 1;
  userList.style.opacity = 1;
  titleApplication.style.opacity = 1;
});

/* create user */
document
  .querySelector(".btn-create-user")
  .addEventListener("click", async (e) => {
    const inputName = document.querySelector(".input-name");
    const name = inputName.value;
    const inputUserName = document.querySelector(".input-username");
    const username = inputUserName.value;
    const inputEmail = document.querySelector(".input-email");
    const email = inputEmail.value;
    e.preventDefault();
    if (!inputName.value && !inputUserName.value && !inputEmail.value) {
      alert("Fill all fields");
      return;
    }
    // validation email
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const isValidMail = regex.test(inputEmail.value);
    if (!isValidMail) {
      alert("Please enter correct email");
      return false;
    }

    const res = await fetch("https://jsonplaceholder.typicode.com/users", {
      method: "POST",
      body: JSON.stringify({
        name,
        username,
        email,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const user = await res.json();
    users.push(user);
    userToHTML(user);
    inputName.value = "";
    inputUserName.value = "";
    inputEmail.value = "";
    window.scroll({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
    modalNewUser.style.display = "none";
    newUser.style.opacity = 1;
    userList.style.opacity = 1;
    titleApplication.style.opacity = 1;
    console.log(user);
  });

/* fetch users */
async function getAllUsers() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  users = await res.json();
  console.log(users);
  users.forEach((user) => userToHTML(user));
}
window.addEventListener("DOMContentLoaded", getAllUsers);

/* render users */
function userToHTML({ id, name, username, email }) {
  userList.insertAdjacentHTML(
    "beforeend",
    `   
      <div class="user-info-card" id="user${id}">
          <div class="buttons">
            <button onclick=deleteUser(${id}) class="delete">Delete</button>
            <button class="edit" onclick=editCurrentUser(${id})>Edit</button>
          </div>
          <div class="name-email-info">
            <div class="firstname-lastname">
              <img
                src="./icons/firstname_lastname.png"
                alt="icon firstname lastname"
              />
              <h2>User:</h2>
              <h3 class="firstname-lastname-value">${name}</h3>
            </div>
            <div class="username">
              <img src="./icons/username.png" alt="icon username" />
              <h2>Username:</h2>
              <h3 class="username-value">${username}</h3>
            </div>
            <div class="email">
              <img src="./icons/email.png" alt="icon email" />
              <h2>E-mail:</h2>
              <h3 class="email-value">${email}</h3>
            </div>
          </div>
      </div>
    `
  );
}

/* delete user */
async function deleteUser(id) {
  if (oldID === id) return;
  oldID = id;
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  await res.json();
  document.getElementById(`user${id}`).remove();
  alert(`Are you sure you to delete this user?`);
  return;
}

/* open modal edit user */
const modalEditUser = document.querySelector(".modal-edit-user");
const editUser = document.querySelector(".edit");

function editCurrentUser(id) {
  modalEditUser.style.display = "block";
  newUser.style.opacity = 0.15;
  userList.style.opacity = 0.15;
  titleApplication.style.opacity = 0.05;

  const matchedUser = users.find((user) => user.id === id);
  if (!matchedUser) return;

  const nameInput = document.querySelector(".modal-edit-name");
  nameInput.value = matchedUser.name;
  const userNameInput = document.querySelector(".modal-edit-username");
  userNameInput.value = matchedUser.username;
  const emailInput = document.querySelector(".modal-edit-email");
  emailInput.value = matchedUser.email;

  console.log(id, matchedUser);

  document
    .querySelector(".btn-edit-user")
    .addEventListener("click", async (e) => {
      e.preventDefault();

      const name = nameInput.value;
      const username = userNameInput.value;
      const email = emailInput.value;

      // validation email
      const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      const isValidMail = regex.test(email);
      if (!isValidMail) {
        alert("Please enter correct email");
        return false;
      }

      const res = await fetch(
        `https://jsonplaceholder.typicode.com/users/${id !== 11 ? id : 10}`,
        {
          method: "PUT",
          body: JSON.stringify({
            name,
            username,
            email,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      const user = await res.json();
      const matchedUserCardName = document.querySelector(
        `#user${id} .firstname-lastname-value`
      );
      const matchedUserCardUsername = document.querySelector(
        `#user${id} .username-value`
      );
      const matchedUserCardEmail = document.querySelector(
        `#user${id} .email-value`
      );
      matchedUserCardName.innerText = name;
      matchedUserCardUsername.innerText = username;
      matchedUserCardEmail.innerText = email;

      console.log(user);

      modalEditUser.style.display = "none";
      newUser.style.opacity = 1;
      userList.style.opacity = 1;
      titleApplication.style.opacity = 1;
    });
}

/* close modal edit user */
const closeEditUser = document.querySelector(".close-edit");
closeEditUser.addEventListener("click", () => {
  modalEditUser.style.display = "none";
  newUser.style.opacity = 1;
  userList.style.opacity = 1;
  titleApplication.style.opacity = 1;
});
