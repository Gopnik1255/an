const socket = io();

document.getElementById('register-btn').addEventListener('click', async function() {
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    const profilePic = document.getElementById('profile-pic').files[0];

    if (name && password) {
        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, password, profilePic }),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    }
});

document.getElementById('login-btn').addEventListener('click', async function() {
    const name = document.getElementById('login-name').value;
    const password = document.getElementById('login-password').value;

    if (name && password) {
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, password }),
            });
            const data = await response.json();
            localStorage.setItem('token', data.token);
            document.getElementById('auth').style.display = 'none';
            document.getElementById('chat').style.display = 'block';
        } catch (error) {
            console.error(error);
        }
    }
});

document.getElementById('create-group-btn').addEventListener('click', async function() {
    const groupName = document.getElementById('group-name').value;

    if (groupName) {
        try {
            const response = await fetch('/groups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ name: groupName, userId: 'your_user_id_here' }),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    }
});

document.getElementById('send-btn').addEventListener('click', async function() {
    const message = document.getElementById('message').value;

    if (message) {
        try {
            const response = await fetch('/sendMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ groupId: 'your_group_id_here', message }),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    }
});

socket.on('newMessage', (message) => {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messagesDiv.appendChild(messageElement);
});