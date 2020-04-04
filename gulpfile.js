const path = require('path')
const gulp = require('gulp')
const gutil = require('gulp-util')
const print = require('gulp-print')
const sequence = require('gulp-sequence')
const ghPages = require('gulp-gh-pages')

const assets = require('niehues-assets-dup')

const config = require('./lib/config')
config.load(assets.configs[config.get('env')])
config.loadFile(path.resolve(__dirname, 'lib', 'environments', `${config.get('env')}.json`))

const tasks = [
  require('./lib/tasks/template-tasks'),
  require('./lib/tasks/release-tasks'),
  require('./lib/tasks/development-tasks')
]

tasks.forEach(service => service.load(gulp, config))

gulp.task('run', sequence(['watch', 'server']))

gulp.task('deploy', ['dist'], () => {
  gulp.src([config.get('distGlob'), 'CNAME'])
  .pipe(ghPages().on('error', gutil.log))
  .pipe(print())
})
