'use strict';

const gulp = require('gulp');
const install = require('gulp-install');
const zip = require('gulp-zip');

const buildDir = './build/';
const exportDir = './export/';
const zipFileName = 'dist.zip';

gulp.task('build-js', () => {
	console.log('Copying javascript to build dir');
	return gulp.src('./index.js')
		.pipe(gulp.dest(buildDir));
});

gulp.task('build-npm', () => {
	console.log('Running npm install');
	return gulp.src('./package.json')
		.pipe(gulp.dest(buildDir))
		.pipe(install({ production: true }));
});

gulp.task('build-zip', () => {
	console.log(`Exporting distribution zip ${zipFileName}`);
	return gulp
		.src([
			buildDir + '**/*',
			'!' + buildDir + 'package.json',
		])
		.pipe(zip(zipFileName))
		.pipe(gulp.dest(exportDir));
});

gulp.task('build', gulp.series(
	'build-js',
	'build-npm',
	'build-zip'
));
