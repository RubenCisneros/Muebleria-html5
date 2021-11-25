const { src, dest, watch, series, parallel } = require('gulp')

const del = require('del')

const htmlmin = require('gulp-htmlmin')

const sourcemaps = require('gulp-sourcemaps')

const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

const babel = require('gulp-babel')

const squoosh = require('gulp-squoosh')

function minifyHtml(){
    return src('./src/**/*.html')
        .pipe(htmlmin({
            removeComments: true,
            collapseWhitespace: true
          }))
        .pipe( dest('./docs'))
}

function css(){
    return src('src/css/**/*.css')
        .pipe(sourcemaps.init())
        .pipe( postcss([ autoprefixer(), cssnano() ]))
        .pipe( sourcemaps.write('.') )
        .pipe( dest('docs/css'))
}

function js(){
    return src('src/js/**/*.js')
        .pipe( sourcemaps.init() )
        .pipe( babel({ presets: ['@babel/env']}) )
        .pipe( sourcemaps.write('.') )
        .pipe( dest('docs/js'))
}

function images(){
    return src('src/images/**/*')
        .pipe( squoosh() )
        .pipe( dest('docs/images') )
}

function icons(){
    return src('src/*.ico')
        .pipe(dest('docs'))
}

function dev(){
    watch('src/**/*.html', minifyHtml)
    watch('src/css/**/*.css', css)
    watch('src/js/**/*.js', js)
    watch('src/images/*/*', images)
}

function clean(){
    return del(['docs/**', '!docs'])
}

exports.html = minifyHtml

exports.images = images
exports.icons = icons
exports.dev = dev
exports.clean = clean
exports.build = series(clean, parallel(minifyHtml, css, js, images, icons))
exports.default = parallel(minifyHtml, css, js)