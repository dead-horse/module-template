TESTS = test/*.test.js
REPORTER = tap
TIMEOUT = 3000
MOCHA_OPTS =

install:
	@npm install --registry=http://registry.npm.taobao.org

autod:
	@node_modules/.bin/autod -w -e example.js --prefix=~
	@$(MAKE) install

.PHONY: test
