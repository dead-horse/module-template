TESTS =  $(shell ls -S `find test -type f -name "*.test.js" -print`)
REPORTER = tap
TIMEOUT = 3000
MOCHA_OPTS =

export PATH := node_modules/.bin:$(PATH)
export SHELL := /bin/bash

install:
	@npm install --registry=http://registry.npm.taobao.org

standard:
	@standard

test:
	@NODE_ENV=test mocha \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		--require should \
		$(MOCHA_OPTS) \
		$(TESTS)

test-cov:
	@NODE_ENV=test node \
		node_modules/.bin/istanbul cover \
		./node_modules/.bin/_mocha \
		-- -u exports \
		--require should \
		$(TESTS) \
		--bail

test-travis:
	@$(MAKE) standard
	@NODE_ENV=test node \
		node_modules/.bin/istanbul cover \
		./node_modules/.bin/_mocha \
		--report lcovonly \
		-- -u exports \
		--require should \
		$(TESTS) \
		--bail

autod: install
	@autod -w --prefix="~" \
  -D mocha,istanbul,should,standard
	@$(MAKE) install

.PHONY: test
