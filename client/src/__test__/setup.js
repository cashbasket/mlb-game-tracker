import {execAsync} from 'async-child-process';
const Nightmare = require('nightmare')
const nightmare = () => Nightmare({ dock: true, show: process.env.SHOW_TESTS || false })

export { nightmare as Nightmare }

export const upDB = async () => {
	return await execAsync("npm run run-seeds");
}

export const tryUpDB = async () => {
	try {
		await upDB()
	} catch(error) {}
}

export const downDB = async () => {
	return await execAsync("npm run drop-seeds");
}

export const reloadDB = async () => {
	try {
		await upDB();
	} catch(error) {
		await downDB()
		return await upDB();
	}
}

export const fullSetup = (before, after) => {
	beforeEach(() => {
		if(before) before();
		upDB();
	})

	afterEach(() => {
		if(after) after();
		downDB();
	})
}

export const readOnlySetup = () => {
	beforeEach(() => {
		tryUpDB()
	})
}

