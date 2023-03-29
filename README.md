Link to Dapp - https://penumbradapp.zpoken.io

# Basic Considerations

### Web3 Browser Detection

To verify if the browser is running Penumbra, copy and paste the code snippet below in the developer console of your web browser:

	const checkIsPenumbraInstalled = async () => {
		const isInstalled = await isPenumbraInstalled() //import from ProviderPenumbra
		if(isInstalled){
			console.log('Penumbra is installed!');
		} else {
			console.log('Please, install penumbra');
		}
	}

