document.addEventListener('DOMContentLoaded', function() {
    const chatBody = document.getElementById('chat-body');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    sendBtn.addEventListener('click', async function() {
        const userMessage = userInput.value.trim();
        console.log('Send button clicked, user message:', userMessage); // Debugging statement
        if (userMessage !== '') {
            appendMessage('You', userMessage);
            userInput.value = '';
            const botResponse = await sendMessage(userMessage);
            if (botResponse && botResponse.response) {
                appendMessage('Berry', botResponse.response);
            } else {
                appendMessage('Error', 'Failed to get a response from the server.');
            }
        }
    });

    function appendMessage(sender, message) {
        const messageElement = document.createElement('p');
        messageElement.innerHTML = `<strong>${sender}: </strong>${message}`;
        chatBody.appendChild(messageElement);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    const sendMessage = async (message) => {
        const loadingElement = document.createElement('div');
        const loadingTextElement = document.createElement('p');
        
        loadingElement.className = 'loading-animation';
        loadingTextElement.className = 'loading-text';
        loadingTextElement.innerText = 'Loading... Please wait';

        chatBody.appendChild(loadingElement);
        chatBody.appendChild(loadingTextElement);

        const requestBody = {
            prompt: message
        };

        const url = '/chatbot';

        try {
            console.log('Sending request to server'); // Debugging statement
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Response from server:', data); // Debugging statement

            chatBody.removeChild(loadingElement);
            chatBody.removeChild(loadingTextElement);

            return data;

        } catch (error) {
            console.error('Error:', error);

            const errorMessageElement = document.createElement('p');
            errorMessageElement.className = 'error-message';
            errorMessageElement.innerText = 'Error: Failed to send message';
            chatBody.appendChild(errorMessageElement);

            chatBody.removeChild(loadingElement);
            chatBody.removeChild(loadingTextElement);

            return { error: error.message };
        }
    };
});
