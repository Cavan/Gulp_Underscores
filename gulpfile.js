const themename = 'development'

const gulp = require('gulp');
//require packages
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const image = require('gulp-image');
const jshint = require('gulp-jshint');
const postcss = require('gulp-sass');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

//Only work with new or updated files
const newer = require('gulp-newer');

//Name of working theme folder
const root = '../' + themename + '/';
const scss = root + 'sass/';
const js = root + 'js/';
const img = root + 'images/';
const languages = root + 'languages/';

// compile scss into css
function style() {
    return gulp.src(scss + '{style.scss,rtl.scss}')
	.pipe(sourcemaps.init())
	.pipe(sass({
		outputStyle: 'expanded', 
		indentType: 'tab',
		indentWidth: '1'
	}).on('error', sass.logError))
	.pipe(postcss([
		autoprefixer('last 2 versions', '> 1%')
	]))
	.pipe(sourcemaps.write(scss + 'maps'))
	.pipe(gulp.dest(root))
    //4. Stream changes to all browsers
    .pipe(browserSync.stream());
}

// Optimize images through gulp-image
function images()
{
    return gulp.src(img + 'RAW/**/*.{jpg,JPG,png}')
	.pipe(newer(img))
	.pipe(image())
	.pipe(gulp.dest(img));
}


function javascript()
{
    return gulp.src([js + '*.js'])
	.pipe(jshint())
	.pipe(jshint.reporter('default'))
	.pipe(gulp.dest(js));
}

// Watch everything
function watch() {
    browserSync.init({
        open: 'external',
        proxy: 'wordpressdevelopment/wordpress/',
        port: 3000
    });

        
        gulp.watch([root + '**/*.css', root + '**/*.scss' ], gulp.series('style'));
	gulp.watch(js + '**/*.js', gulp.series('javascript'));
	gulp.watch(img + 'RAW/**/*.{jpg,JPG,png}', gulp.series('images'));
	gulp.watch(root + '**/*').on('change', browserSync.reload);
}



exports.style = style;
exports.images = images;
exports.javascript = javascript;
exports.watch = watch;