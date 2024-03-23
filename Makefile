start:
	php -S localhost:7001 -t src/
.PHONY: start

open:
	open http://localhost:7001
.PHONY: open

helper:
	yarn install --cwd .helper
	composer install --working-dir .helper
.PHONY: helper

token:
	php .helper/scripts/token.php
.PHONY: token

build:
	php .helper/scripts/build.php
.PHONY: build
