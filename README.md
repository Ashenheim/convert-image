My Boilerplate
===========

Basic boilerplate for my needs. It uses native Javascript, Stylus and Jade.

Requirements
-----------

[NodeJS](http://nodejs.org/) and [Gulp](http://gulpjs.com/).

Installing
-----------

Step 1. Install [NodeJS](http://nodejs.org/download/)

Step 2. Install [Gulp] `$ npm install --global gulp`

Step 3. Install all the NPM dependencies you need for Gulp.

```shell
cd path/to/project
$ npm install
$ bower install
```

Step 4.
Non, you're all done!

Gulp tasks
-----------

1. `gulp build` Builds the project
2. `gulp dist` Builds the project meant for distribution
3. `gulp serve` Starts a local server under `http://localhost:8080`
4. `gulp deploy` Deploys the contents of the build folder to the gh-pages (only works if this is hosted on Github)
5. `gulp` This starts up both `build` and `serve` for quick startup.


Folder structure
-------------

The development is done in `_source/js/`, `source/stylus/` and `source/markup/` which then will be compiled into `build/`.
