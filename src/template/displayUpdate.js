function displayUpdates(id, name, email, updateUser) {
  const userContainer = document.getElementById('update-item');

  userContainer.innerHTML = `
    <div class="create-item">
      <div class="grup-input">
      <input type="hidden" id="user-id" value="${id}" />
      <input type="text" id="name-update" value="${name}" placeholder="Nama" />
      <input type="email" id="email-update" value="${email}" placeholder="Email" />
      </div>
      <button id="update-user-btn">Update</button>
    </div>
  `;

  document.getElementById('update-user-btn').addEventListener('click', () => {
    const nameInput = document.getElementById('name-update').value;
    const emailInput = document.getElementById('email-update').value;
    const idInput = document.getElementById('user-id').value;

    if (!nameInput || !emailInput) {
      alert('Nama dan Email tidak boleh kosong.');
      return;
    }

    updateUser(idInput, nameInput, emailInput);
  });
}

export default displayUpdates;
