"use strict";

// Load plugins
const path = require('path');
const browsersync = require("browser-sync").create();
const cleanCSS = require("gulp-clean-css");
const del = require("del");
const gulp = require("gulp");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const inlinesource = require('gulp-inline-source');
const gzip = process.argv.includes('--prod')
    ? require('gulp-gzip')
    : require("gulp-empty-pipe");


// BrowserSync
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "./",
            reloadDebounce: 500
        },
        port: 3000,
        open: false
    });
    done();
}

// BrowserSync reload
function browserSyncReload(done) {
    browsersync.reload();
    done();
}

// Clean vendor
function clean() {
    return del(["./*.html", "./*.html.gz", "./css/*", "./js/*", "./font/*"]);
}

// CSS task
function css() {
    return gulp
        .src([
            "./src/scss/*.scss",
            "!./src/scss/_*.scss"
        ])
        .pipe(plumber())
        .pipe(sass({
            // outputStyle: "expanded",
            includePaths: "./node_modules",
        }))
        .on("error", sass.logError)
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest("./css"))
        .pipe(browsersync.stream());
}

// JS task
function js() {
    return gulp
        .src([
            './node_modules/plyr/dist/plyr.js',
            './src/js/*.js',
        ])
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./js'))
        .pipe(browsersync.stream());
}

function inline() {
    return gulp.src('./src/html/*.html')
        .pipe(inlinesource({ compress: false }))
        .pipe(rename(function (file) {
            file.dirname = path.dirname(file.dirname);
        }))
        .pipe(gzip())
        .pipe(gulp.dest('./'))
        .pipe(browsersync.stream());
};

function fonts() {
    return gulp.src('./src/font/*')
        .pipe(gzip())
        .pipe(gulp.dest('./font/'))
        .pipe(browsersync.stream());
};

// Watch files
function watchFiles() {
    gulp.watch(["./src/scss/**/*"], gulp.series(css, inline, browserSyncReload));
    gulp.watch(["./src/js/**/*"], gulp.series(js, inline, browserSyncReload));
    gulp.watch(["./src/html/**/*.html"], gulp.series(inline, browserSyncReload));
}

// Define complex tasks
const build = gulp.series(clean, gulp.parallel(css, js, fonts), inline);
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync));

// Export tasks
exports.css = css;
exports.js = js;
exports.clean = clean;
exports.inline = inline;
exports.build = build;
exports.watch = watch;
exports.default = build;
