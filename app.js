let newAccount;
let phantomWallet;

const {Keypair,
    Connection,
    LAMPORTS_PER_SOL,
    PublicKey,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction } = solanaWeb3;

//function to create a keypair
async function createKeyPair() {
    const connection = new Connection("http://127.0.0.1:8899 ", "confirmed");
    // Generate a new KeyPair
    newAccount = Keypair.generate();

    // Airdrop 6 SOL to the new KeyPair
    const airdropSignature = await connection.requestAirdrop(
        newAccount.publicKey,
        2 * LAMPORTS_PER_SOL
    );

    // Confirm transaction
    await connection.confirmTransaction(airdropSignature);
    await getWalletBalance(newAccount.publicKey);

    alert(`New account created with public key: ${newAccount.publicKey.toBase58()}`);
}

//function to connectphantom wallet
async function connectWallet() {
    try {
        const provider = window.solana;
        //check if wallet is phantom
        if (!provider || !provider.isPhantom) {
            alert("Phantom wallet not found. Please install it.");
            return;
        }

        // Connect to Phantom wallet
        const response = await provider.connect();
        phantomWallet = response.publicKey;

        alert(`Connected to Phantom wallet with public key: ${phantomWallet.toBase58()}`);
        await getWalletBalance(phantomWallet);
    } catch (err) {
        console.error(err);
        alert("Failed to connect to Phantom wallet.");
    }
}



async function sendSol() {
    if (!newAccount || !phantomWallet) {
        alert("Please complete the previous steps first.");
        return;
    }

    const connection = new Connection("http://127.0.0.1:8899","confirmed");

    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: newAccount.publicKey,
            toPubkey: phantomWallet,
            lamports: 1 * LAMPORTS_PER_SOL,
        })
    );

    // Sign the transaction with the newly created KeyPair
    const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [newAccount]
    );

    alert(`1 SOL transferred to Phantom wallet. Transaction signature: ${signature}`);
    console.log(`newAccount balance:`);
    await getWalletBalance(newAccount.publicKey)
    console.log(`phantom balance:`);
    await getWalletBalance(phantomWallet);
}

const getWalletBalance = async (walletPublicKey) => {
    try {
        const connection = new Connection("http://127.0.0.1:8899 ", "confirmed");
        const walletBalance = await connection.getBalance(
            new PublicKey(walletPublicKey)
        );
        console.log(`Wallet balance: ${parseInt(walletBalance) / LAMPORTS_PER_SOL} SOL`);
    } catch (err) {
        console.log(err);
    }
  };