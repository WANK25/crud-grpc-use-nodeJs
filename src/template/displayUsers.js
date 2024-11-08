function displayUsers(userList) {
  const userContainer = document.getElementById('data');

  let numberTable = 1;

  const userHtml = userList
    .map((user) => {
      const userObj = user.toObject();
      return `
          
    <tr>
    <td class="data-item" data-id='${userObj.id}'>${numberTable++}</td>
    <td>${userObj.name}</td>
    <td>${userObj.email}</td>
    <td><button class="delete" data-id='${userObj.id}' id='delete'>Delete</button></td>
    </tr>

    `;
    })
    .join('');

  userContainer.innerHTML = userHtml;
}

export default displayUsers;
