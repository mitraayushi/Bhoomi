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