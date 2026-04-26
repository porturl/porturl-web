# Changelog

## [0.2.0](https://github.com/porturl/porturl-web/compare/v0.1.0...v0.2.0) (2026-04-26)


### Features

* allow external configuration using env.js, add github workflows (release-please, build + release pipeline, add docker build ([9e18436](https://github.com/porturl/porturl-web/commit/9e18436ba522b1103d9a84c1621c0884b148f570))
* automatically redirect to keycloak without session ([696b981](https://github.com/porturl/porturl-web/commit/696b98121ee3b90c0ded8cea3451a3068110f04f))
* improve responsive layout, fix deprecated mui grid properties ([b4cacf2](https://github.com/porturl/porturl-web/commit/b4cacf21eb3ffa17d66d5c2347a71a0032e9160d))
* list/grid mode ([966541f](https://github.com/porturl/porturl-web/commit/966541f090ea6c0e7d416221b0d12ac01e63b068))
* refactoring of category/application loading using separate rest calls ([7319eb0](https://github.com/porturl/porturl-web/commit/7319eb0000c04db27a547569feccb90e0a9584fe))
* structure source ([f198c4a](https://github.com/porturl/porturl-web/commit/f198c4aa1564d6b83bb158b4c0c8a89ab5004af8))
* support localization ([a40d51b](https://github.com/porturl/porturl-web/commit/a40d51bb66e7cb144eb83cde170d2220e930f357))
* use normal hyperlink to allow browser to display url on mouseover and middle click ([3eba248](https://github.com/porturl/porturl-web/commit/3eba248ef09da62d1ef2972e8c63dff91e8bec3f))
* use openapi.yaml like in android app, make layout more responsive ([a7cc8a0](https://github.com/porturl/porturl-web/commit/a7cc8a0ac20a1acfa825901a26b76d9b4d7d1ecd))


### Bug Fixes

* align layout more with android app by using buttons in searchfield, adding fabs, moving profile into the sidebar bottom ([49a5525](https://github.com/porturl/porturl-web/commit/49a55253886d1d07ef294f980cb606ccc700ea54))
* app sizing in list mode on small screens should span the whole category ([cde672e](https://github.com/porturl/porturl-web/commit/cde672e6197fbe4e405969e103eb3f7adcfb8c07))
* consistent spacing between categories ([cbb419a](https://github.com/porturl/porturl-web/commit/cbb419ac6d845c4163ede274a56c2fc1d65df9fd))
* container restart loop, allow running with readonly filesystem ([4b5444e](https://github.com/porturl/porturl-web/commit/4b5444e9f234fd443101f15bdaae009adbb639cb))
* disable telemetry ([cf8f756](https://github.com/porturl/porturl-web/commit/cf8f756df6258b4dece7a31a26d1e5aa9085ab19))
* lint errors ([af12caf](https://github.com/porturl/porturl-web/commit/af12cafb4360c520215ff30b263bedbf9fbcb2ff))
* lint errors ([5a6f6ec](https://github.com/porturl/porturl-web/commit/5a6f6ec36f02a3486891e778b54813d0994d2dbc))
* lint errors ([6922365](https://github.com/porturl/porturl-web/commit/6922365f213a4700ab2e3f32de62760cbff28839))
* lint errors ([41a35e4](https://github.com/porturl/porturl-web/commit/41a35e48b88c7cc3bbf294012ee62a4e0a821193))
* lint errors, mostly explicit typing ([3bc6d04](https://github.com/porturl/porturl-web/commit/3bc6d045bba3e14072d71751807ffad600f95f30))
* open fab only on click, not hover ([2111163](https://github.com/porturl/porturl-web/commit/2111163afd6f97a6d857d8b8f90d2ad8ebde44fe))
* resizing window to small phone size leads to not being able to click anything ([9710d45](https://github.com/porturl/porturl-web/commit/9710d45171d4ed49000a453f20e75f7af00835f0))
* sizing of app icons ([c4a6ba2](https://github.com/porturl/porturl-web/commit/c4a6ba20191a05c986046ac2599cd42c94cffdcc))
* small screen layout prevented clicks before ([8abf9ce](https://github.com/porturl/porturl-web/commit/8abf9ce1f04fe6e9f636e0018fef59c174ea6076))
