// 
import { ethers } from "./ethers-5.1.esm.min.js"
import { abi } from "./constants.js"
import { contractAddress } from "./constants.js"
// 
const connectBtn = document.querySelector("#connectBtn");
const depositBtn = document.querySelector("#depositBtn");
const withdrawBtn = document.querySelector("#withdrawBtn");
const toggleDepoBtn = document.querySelector("#toggleDepoBtn");
const closeBtn = document.querySelector("#closeBtn");
const getBalanceBtn = document.querySelector("#getBalanceBtn");
const overlay = document.querySelector(".overlay");


const successAlert = (txt) => {
    swal.fire(
        'Success',
        `${txt}`,
        'success'
    )
}

/**@Toogle_Deposit_Form */
const toggleDepo = () => {
    overlay.classList.toggle("active")
}

/**@CONNECT */
const connect = async () => {
    try {
        if (typeof window.ethereum !== "undefined") {
            await window.ethereum.request({ method: "eth_requestAccounts" })
            successAlert("Connected Successfully");
            connectBtn.textContent = "Connected!"
            connectBtn.classList.add("active")
        }
    } catch (error) {
        console.log(error);
    }
}


/**@GET_BALANCE */
const getBalance = async () => {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(contractAddress)
        successAlert(`${ethers.utils.formatEther(balance)}Eth`);//conv erts it to readable number (js)
    }
}

// TRANSACTION MINE / LISTENER

const listenForTransactionMine = (transactionResponse, provider) => {
    console.log(`Mining ${transactionResponse.hash}...`);
    // return new Promise()
    // listen for the transaction to finish
    // provider.once is async in nature
    // so we have to create our own promise and run our provider.once in the promise to cancel the sync nature
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(`Completed with ${transactionReceipt.confirmations} confirmations`);
            resolve();
        })
    })

}

/**@Deosit */
const deposit = async (e) => {
    e.preventDefault();
    const ethAmount = document.querySelector("#amount").value;
    console.log(`Funding with ${ethAmount}.....`);
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner() //is gonna return whatever wallet is connect from the provider
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
            const transactionResponse = await contract.deposit({
                value: ethers.utils.parseEther(ethAmount),
            })
            //   hey,wait for this transaction to finish
            // console.log(transactionResponse.events);
            await listenForTransactionMine(transactionResponse, provider);
            successAlert(`${ethAmount} Deposited Successfully`);//conv erts it to readable number (js)

        } catch (error) {
            if (error.message.includes("User denied")) {
                console.log("Transaction rejected by user");
            } else {
                console.log(error);
            }
        }

    }
}

/**@WITHDRAW */
const withdraw = async () => {
    if (typeof window.ethereum !== "undefined") {
        console.log("withdrawing....");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner() //is gonna return whatever wallet is connect from the provider
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
            successAlert(`Withdraw Successfully`);//conv erts it to readable number (js)
        } catch (error) {
            console.log(error);
        }
    }
}



// EVENT LISTENERS

connectBtn.addEventListener("click", connect)
toggleDepoBtn.addEventListener("click", toggleDepo)
closeBtn.addEventListener("click", toggleDepo)
getBalanceBtn.addEventListener("click", getBalance)
depositBtn.addEventListener("click", deposit)
withdrawBtn.addEventListener("click", withdraw)
window.addEventListener("load", () => {
    // window.ethereum._state.accounts --> gives us a list of connected account or returns empty array when it's not connected to any accounts
    if (window.ethereum._state.accounts.length > 0) {
        connectBtn.textContent = "Connected!"
        connectBtn.classList.add("active")
    }
})