Link to Dapp - https://penumbradapp.zpoken.io

# Basic Considerations

### Web3 Browser Detection

To verify if the browser is running Penumbra, copy and paste the code snippet below in the developer console of your web browser:

	const checkIsPenumbraInstalled = async () => {
		const isInstalled = await isPenumbraInstalled() // import from ProviderPenumbra
		if(isInstalled){
			console.log('Penumbra is installed!');
		} else {
			console.log('Please, install penumbra');
		}
	}

### Connecting to Penumbra

"Connecting" or "logging in" to Penumbra effectively means "to access the user's account(s)".

We recommend that you provide a button to allow the user to connect Penumbra to your dapp. Clicking this button should call the following method:

	const handleConnect = async () => {
		const data = await window.penumbra.publicState()
		const account = data.account
	}

# Accessing Accounts

If you'd like to be notified when the user state changes, we have an event you can subscribe to:

	window.penumbra.on('state', state => {
		console.log(state)
	})

# Sending Transactions

Transactions are a formal action on a blockchain. They are always initiated in Penumbra with a call to the signTransaction method. They can involve a simple sending of token. They are always initiated by a signature from an external account, or a simple key pair.

In Penumbra, using the penumbra.signTransaction method directly, sending a transaction will involve composing an options object like this:

	const sendTx = async () => {

		const fullViewingKey = userData.fvk  // fullViewingKey get`s from window.penumbra.publicState()

		const filteredNotes = notes.filter(
			note =>
				!note.noteRecord?.heightSpent &&
				uint8ToBase64(note.noteRecord?.note?.value?.assetId?.inner!) ===
				assetId
		)
		.map(i => i.noteRecord?.toJson()) // notes get`s from penumbra.on('notes')

		if (!filteredNotes.length) console.error('No notes found to spend')

		const fmdParameters = (await window.penumbra.getFmdParameters()).parameters
		if (!fmdParameters) console.error('No found FmdParameters')

		const chainParameters = (await window.penumbra.getChainParameters()).parameters
		if (!chainParameters) console.error('No found chain parameters')

		const viewServiceData = {
			notes: filteredNotes,
			chain_parameters: chainParameters,
			fmd_parameters: fmdParameters,
		}

		const valueJs = {
			amount: {
				lo: amount * 1000000,
				hi: 0,
			},
			assetId: { inner: assetId },
		}

		const transactionPlan = await wasm.send_plan( // import wasm as "import * as wasm from 'penumbra-web-assembly'"
			fvk,
			valueJs,
			reciever,
			viewServiceData
		)
		
		await window.penumbra.signTransaction(transactionPlan)
	}
