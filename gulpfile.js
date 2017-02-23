/*global require*/
/* Require the gulp and node packages */
var gulp = require('gulp'),
    pkg = require('./package.json'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    header = require('gulp-header'),
    pixrem = require('gulp-pixrem'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    minifyCss = require('gulp-minify-css'),
    swig = require('gulp-swig'),
    frontMatter = require('gulp-front-matter'),
    data = require('gulp-data'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    jshint = require('gulp-jshint'),
    gulpIf = require('gulp-if'),
    gulpUtil = require('gulp-util'),
    jshintConfig = pkg.jshintConfig;


/* Set up the banner */
var banner = [
    '/**',
    ' * @name <%= pkg.name %>: <%= pkg.description %>',
    ' * @version <%= pkg.version %>: <%= new Date().toUTCString() %>',
    ' * @author <%= pkg.author %>',
    ' * @license <%= pkg.license %>',
    ' */'
].join('\n');

/* Autoprefixer settings */
var AUTOPREFIXER_BROWSERS = [
  'ie >= 9',
  'ie_mob >= 10',
  'ff >= 20',
  'chrome >= 4',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

/* Build destination */
var outputDir = './build';

/* Where CSS, JS, imgs are piped */
var assetPath = './dist';

/* Source files for the pipe */
var src = {
	css: './src/scss/',
	js: './src/js/',
    fonts: './src/fonts/',
	html: './src/templates/',
  img: './src/img/'
};

/* Destination for the build */
var dest = {
	css: assetPath + '/css/',
	js:  assetPath + '/js/',
	html: outputDir,
    img: assetPath + '/img/',
    fonts: assetPath + '/fonts/'
};

/* Set the PSI variables */
var publicUrl = '', //publicly accessible URL on your local machine, demo, staging, live...
    psiStrategy = 'mobile'; //'mobile' or 'desktop'

/* Error notificaton*/
var onError = function(err) {
    notify.onError({
        title:    "Gulp",
        subtitle: "Failure!",
        message:  "Error: <%= error.message %>",
        sound:    "Beep"
    })(err);

    this.emit('end');
};

/************************
 *  Task definitions 
 ************************/
/* Lint JS */
gulp.task('lint', function() {
	return gulp.src(src.js)
		.pipe(jshint(jshintConfig))
		.pipe(jshint.reporter('default'));
});

gulp.task('js:concat', function () {
  return gulp.src([src.js + 'modules.js', src.js + 'modules/**/*.js', src.js + 'app.js'])
    .pipe(concat('app.js'))
    .pipe(gulp.dest(dest.js))
	.pipe(uglify())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest(dest.js));
});

gulp.task('js:async', function () {
});

gulp.task('js:vendor', function () {
    return gulp.src(src.js + 'vendor/**/*.js')
  		.pipe(uglify())
  		.pipe(rename({suffix: '.min'}))
  		.pipe(gulp.dest(dest.js + 'vendor/'));
});

gulp.task('js', ['js:concat', 'js:async', 'js:vendor']);

/* Build the flat html */
gulp.task('html', function(){
    return gulp.src(src.html + '/**/*.html')
        .pipe(plumber({errorHandler: onError}))
        .pipe(frontMatter({ property: 'data' }))
        .pipe(data(function(file) {
            return {'assetPath': assetPath};
        }))
        .pipe(swig({
            defaults: {
                cache: false
            }
        }))
      .pipe(gulp.dest(dest.html));
});

/* 
 * SASS > CSS
 * Build CSS from scss, prefix and add px values from rem
 *
 */
gulp.task('sass', function () {
    return gulp.src([src.css + '**/*.scss', '!' + src.css + '{fonts,kss}/*.*'])
          .pipe(plumber({errorHandler: onError}))
          .pipe(sourcemaps.init())
          .pipe(sass())
          .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
          .pipe(pixrem())
          .pipe(header(banner, {pkg : pkg}))
          .pipe(sourcemaps.write())
          .pipe(minifyCss())
          .pipe(gulp.dest(dest.css));
});

gulp.task('css', ['sass']);

/* Optimize images */
gulp.task('img', function () {
    return gulp.src([src.img + '**/*'])
        .pipe(imagemin({
          progressive: true,
          interlaced: true,
          svgoPlugins: [{removeViewBox: true}]
        }))
        .pipe(gulp.dest(dest.img));
});

/* Fonts */
gulp.task('font', function() {
    return gulp.src(src.fonts + '**/*.*')
        .pipe(gulp.dest(dest.fonts));
});

/************************
 *  Task API
 ************************/
/* Final build task including compression */
gulp.task('build', ['html', 'css', 'js', 'img', 'font']);

/* Default 'refresh' task */
gulp.task('default', ['build']);