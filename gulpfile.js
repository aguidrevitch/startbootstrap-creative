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
const inlinesource = require('gulp-inline-source');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');

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
    return del(["./*.html", "./css", "./js", "./font"]);
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
function buildJs(src, dst, name) {
    return function () {
        var b = browserify({
            entries: src,
            debug: true
        }).transform("babelify", {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-proposal-class-properties"]
        });

        return b.bundle()
            .pipe(source(dst))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            // Add transformation tasks to the pipeline here.
            .pipe(uglify())
            .pipe(rename({
                suffix: '.min'
            }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./js/'))
            .pipe(browsersync.stream());

    }
}
gulp.task("js", buildJs('./src/js/index.js', 'app.js'));
gulp.task("shopjs", buildJs('./src/js/shop.js', 'shop.js'));
gulp.task("prelaunch", buildJs('./src/js/prelaunch.js', 'prelaunch.js'));

function inline() {
    return gulp.src('./src/html/**/*.html', { base: './src/html/' })
        .pipe(inlinesource({ compress: false }))
        .pipe(gulp.dest('./'))
        .pipe(browsersync.stream());
};

function fonts() {
    return gulp.src('./src/font/*')
        .pipe(gulp.dest('./font/'))
        .pipe(browsersync.stream());
};

// Watch files
function watchFiles() {
    gulp.watch(["./src/scss/**/*"], gulp.series(css, inline, browserSyncReload));
    gulp.watch(["./src/js/**/*"], gulp.series("js", "shopjs", "prelaunch", inline, browserSyncReload));
    gulp.watch(["./src/html/**/*.html"], gulp.series(inline, browserSyncReload));
}

// Define complex tasks
const build = gulp.series(clean, gulp.parallel(css, "js", "shopjs", "prelaunch", fonts), inline);
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync));

// Export tasks
exports.css = css;
exports.clean = clean;
exports.inline = inline;
exports.build = build;
exports.watch = watch;
exports.default = build;
