build:
	docker build -t langcopilotbot .

run:
	docker run -p 3000:3000 --name langcopilotbot --rm langcopilotbot