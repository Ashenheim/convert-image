/* ====================================

    dependencies
==================================== */
var gulp            = require('gulp');
var sass            = require('gulp-sass');
var sassGlob        = require('gulp-sass-glob');
var postcss         = require('gulp-postcss');
var assets          = require('postcss-assets');
var autoprefixer    = require('autoprefixer');
var csswring        = require('csswring');
var cssMqpacker     = require('css-mqpacker');
var browserify      = require('browserify');
var source          = require('vinyl-source-stream');
var buffer          = require('vinyl-buffer');
var uglify          = require('gulp-uglify');
var eslint          = require('gulp-eslint');
var sourcemaps      = require('gulp-sourcemaps');
var imagemin        = require('gulp-imagemin');
var pngquant        = require('imagemin-pngquant');
var changed         = require('gulp-changed');
var argv            = require('yargs').argv;
var gulpif          = require('gulp-if');
var browserSync     = require('browser-sync');
var plumber         = require('gulp-plumber');
var watch           = require('gulp-watch');
var del             = require('del');
var filter          = require('gulp-filter');

var files = {
    copy: [
        'source/markup/**/*',
        '!source/markup/_extends/',
        '!source/markup/_includes/',
        '!source/markup/assets/',
        '!source/markup/**/*.{jade,yml}'
    ],
    sass: 'source/sass/**/*.{scss,sass}',
    javascript: 'source/js/init.js',
    media: [
        'source/media/**/*'
    ]
}

function onError(err) {
    console.log(err.message);
    browserSync.notify('<pre><code>' + err.message + '</code></pre>');
    this.emit('end');
}

/* ====================================
    Gulp tasks
==================================== */




/* #Copy
 * ------------------------------------ */
gulp.task('copy', function() {
    return gulp.src(files.copy)
        .pipe(gulp.dest('build/'))
        .pipe(browserSync.reload({stream: true}));
})

/* #Sass
 * ------------------------------------ */
gulp.task('sass', function() {
    browserSync.notify('<span style="color: grey">Running:</span> Stylus compiling');
    return gulp
        .src(files.sass)
        .pipe(plumber({ errorHandler: onError }))
        .pipe(gulpif(!argv.production, sourcemaps.init()))
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(postcss([
            cssMqpacker(),
            assets({
                basePath: 'source/markup/',
                loadPaths: ['assets/media/'],
                cachebuster: true
            }),
            autoprefixer({ browsers: ['> 0.5%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'] }),
            csswring()
        ]))
        .pipe(gulpif(!argv.production, sourcemaps.write('./')))
        .pipe(gulp.dest('build/assets/css/'))
        .pipe(gulp.dest('source/markup/assets/css/'))
        .pipe(filter(['*.css']))
        .pipe( browserSync.reload({stream:true}) );
});

/* #eslint
 * ------------------------------------ */
gulp.task('eslint', function() {
    return gulp.src('source/js/**/*.js')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(eslint())
        .on('error', onError)
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

/* #Scripts
 * ------------------------------------ */
gulp.task('scripts', ['eslint'], function() {
    browserSync.notify('<span style="color: yellow">Running:</span> Javascript compiling');
    var b = browserify();
    b.add(files.javascript, { debug: true });
    b.transform('babelify', {presets: ['es2015']});

    return b.bundle()
        .on('error', onError)
        .pipe(plumber({ errorHandler: onError }))
        .pipe(source('global.js'))
        .pipe(buffer())
        .pipe(gulpif(!argv.production, sourcemaps.init({loadMaps: true})))
        .pipe(gulpif(!argv.production, sourcemaps.write('./')))
        .pipe(gulpif(argv.production, uglify()))
        .pipe(gulp.dest('build/assets/js/'))
        .pipe( browserSync.reload({stream:true}) )
        .pipe(gulp.dest('source/markup/assets/js/'));
});

/* #Media compression
 * ------------------------------------ */
gulp.task('media-compression', function () {
    gulp
        .src(files.media)
        .pipe(changed('dist/img'))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('build/assets/media/'))
        .pipe( browserSync.reload({stream:true}) )
        .pipe(gulp.dest('source/markup/assets/media/'));
});

/* #Server
 * ------------------------------------ */
gulp.task('server', function() {
    browserSync({
        server: {
            baseDir: 'build/'
        },
        host: "localhost",
        online: false,
        open: false,
        notify: {
            styles: [
                'color: rgba(255, 255, 255, .8)', 'position: fixed', 'z-index: 999999', 'bottom: 0px', 'left: 0px', 'font-size: 1em', 'background: rgba(0, 0, 0, 0.8)', 'font-family: arial, sans-serif', 'padding: 10px', 'box-shadow: 0 0 5px rgba(0,0,0,.3)'
            ]
        }
    });
});

/* #Clean
 * ------------------------------------ */
 gulp.task('clean', function() {
    return del([ 'build/**/*', 'source/markup/assets/**/*' ]);
})

/* #Watch
 * ------------------------------------ */
gulp.task('watch',function() {
    watch( files.copy, function() { gulp.start('copy'); });
    watch( 'source/sass/**/*.{scss,sass}', function() { gulp.start('sass'); });
    watch( 'source/js/**/*.js', function() { gulp.start('scripts'); });
    watch( 'source/markup/**/*.jade', function() { gulp.start('jade'); });
});

/*
 * `gulp` will build the HTML, JS and CSS and start the server
 * `gulp serve` will only start the server and watches the source for changes
 * `gulp build` will only build the HTML, JS and CSS
 * `gulp build --production` will build the files for production use
 * ------------------------------------ */
gulp.task('build', ['sass', 'scripts', 'copy', 'media-compression']);
gulp.task('serve', ['server', 'watch'])
gulp.task('default', ['build', 'serve'])
