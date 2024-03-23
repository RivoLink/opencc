install:
	yarn install
	composer install
.PHONY: install

ecs:
	./vendor/bin/ecs check
.PHONY: ecs

ecs-fix:
	./vendor/bin/ecs --fix
.PHONY: ecs-fix

eslint:
	yarn run eslint --config .eslintrc.yaml ./../src/assets/js
.PHONY: eslint

eslint-fix:
	yarn run eslint --config .eslintrc.yaml ./../src/assets/js --fix
.PHONY: eslint-fix

ci:
	./vendor/bin/ecs check
	yarn run eslint --config .eslintrc.yaml ./../src/assets/js
.PHONY: ci
