import {readOnlySetup, Nightmare} from './setup';

const login = () => Nightmare()
	.goto("http://localhost:3000")
	.type('input[type="email"]', "gbass@lec.edu")
	.type('input[type="password"]', "Milferd13")
	.click('button[type="submit"]')
	.wait(1000)


describe("Initial nightmare test", () => {
	readOnlySetup();

	test(
		"Log out button", 
		async (done) => {
			let path = await login()
				.wait('#userMenu button')
				.click('#userMenu button')
				.click('[data-test="logout-button"]')
				.wait(500)
				.path()
				.end();
			console.log(path)
			expect(path).toBe('/');
			done()
		},
		10000
	)

	test(
		"Going to index /", 
		async (done) => {
			let url = await login().url().end()
			expect(url).toContain("dashboard");
			done()
		}, 
		20000000
	)
})
