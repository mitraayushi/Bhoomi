// Toggle chat popup display
const chatBtn = document.getElementById('chatBtn');
const chatPopup = document.getElementById('chatPopup');
const closeChat = document.getElementById('closeChat');

// Show the popup when the chat button is clicked
chatBtn.addEventListener('click', () => {
  chatPopup.style.display = 'flex';
});

// Hide the popup when the close button is clicked
closeChat.addEventListener('click', () => {
  chatPopup.style.display = 'none';
});

// Handle sending messages
const sendMessageBtn = document.getElementById('sendMessage');
const chatBody = document.getElementById('chatBody');
const userMessageInput = document.getElementById('userMessage');

sendMessageBtn.addEventListener('click', async () => {
  const userMessage = userMessageInput.value;
  if (userMessage) {
    const response = await fetch('http://127.0.0.1:8000/chat_gen', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: userMessage }), // Use the inputText as prompt
    });
    const data = await response.json();
    console.log(data.ans, "===================");

    appendMessage('user', userMessage);
    setTimeout(() => {

      appendMessage('bot', ` ${data.ans}`);
    }, 1000);
    userMessageInput.value = '';
  }

  // const response = await fetch('http://127.0.0.1:8000/chat_gen', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ prompt: inputText }), // Use the inputText as prompt
  // });
});

// Function to append messages to chat
function appendMessage(sender, message) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add(sender === 'bot' ? 'bot-message' : 'user-message');
  messageDiv.textContent = message;
  chatBody.appendChild(messageDiv);
  chatBody.scrollTop = chatBody.scrollHeight; // Scroll to bottom
}


let clientAddress;
function showInvestPopup(address) {
  document.getElementById("invest-popup").style.display = "flex";
  clientAddress = address;
}

function closeInvestPopup() {
  document.getElementById("invest-popup").style.display = "none";
}

function submitInvestment() {
  const amount = document.getElementById("investment-amount").value;
  if (amount > 0) {
    // alert(`You have successfully invested $${amount}!`);
    fetch("/withdraw", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        clientAddress,
        claimAmt: amount,
      }),
    });
    closeInvestPopup();
  } else {
    alert("Please enter a valid amount to invest.");
  }
}

const isWalletConnected = () => {
  return localStorage.getItem("clientAddress");
};
window.onload = () => {
  if (isWalletConnected) {
    document.querySelector(".connect-wallet").innerText = "Connected";
  }
};

async function connectWallet() {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // Request connection to MetaMask only when the button is clicked
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // Get the connected wallet's signer
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    // Update button text to "Connected"
    document.querySelector(".connect-wallet").innerText = "Connected";

    // Store the connected address in localStorage
    localStorage.setItem("clientAddress", address);
    console.log("Connected wallet address:", address);
  } catch (error) {
    console.error("Error connecting to MetaMask:", error);
  }
}

