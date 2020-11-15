import gulp from "gulp";
import del from "del";
import pug from "gulp-pug";
import sass from "gulp-sass";
import concat from "gulp-concat";
import postcss from "gulp-postcss";
import cssSort from "css-declaration-sorter";
import clean from "gulp-clean-css";
import autoprefixer from "autoprefixer";
import stripComment from "gulp-strip-comments";
import uglify from "gulp-uglify";
import rename from "gulp-rename";
import plumber from "gulp-plumber";
import babelify from "babelify";
import babel from "gulp-babel";
import babelMinify from "gulp-babel-minify";
import browserify from "browserify";
import buffer from "vinyl-buffer";
import source from "vinyl-source-stream";
import bSync from "browser-sync";
import tsify from "tsify";
import sourcemaps from "gulp-sourcemaps";

import { readFileSync } from "fs";

// Import task functions
import FileManage from "./_tasks/FileManage";
import CoreBuild from "./_tasks/Core";
import MainBuild from "./_tasks/Main";
import Serve from "./_tasks/Serve";
//
// Define packages
const _ = {
	gulp,
	del,
	pug,
	sass,
	postcss,
	cssSort,
	autoprefixer,
	concat,
	clean,
	sourcemaps,
	readFileSync,
	stripComment,
	uglify,
	rename,
	plumber,
	babel,
	babelify,
	babelMinify,
	browserify,
	buffer,
	source,
	bSync,
	tsify,
};

const vendors = JSON.parse(readFileSync("_vendors.json"));
// Clean dist
const cleanDist = () => {
	return FileManage(_).Delete("dist");
};
// Copy fonts
const copyFonts = () => {
	let fonts = vendors.fonts;
	return FileManage(_).Copy(fonts, "dist/fonts");
};
// Copy favicon
const copyFavicon = () => {
	return FileManage(_).Copy("./src/favicon/**/**", "dist/favicon");
};
// Copy assets
const copyAssets = () => {
	return FileManage(_).Copy(
		"src/assets/**/**.{svg,png,jpg,jpeg,gif,mp4}",
		"dist/assets",
	);
};
// Copy fake api
const copyFakeApi = () => {
	return FileManage(_).Copy("src/api/**/**", "dist/api");
};

const coreJs = () => {
	return CoreBuild(_).js(vendors);
};

const coreCss = (cb) => {
	return CoreBuild(_).css(vendors);
};

const mainTs_Browserify = () => {
	return MainBuild(_).tsBrowserify();
};

const mainJs_NormalBabel = () => {
	return MainBuild(_).jsNormalBabel();
};

const mainCss = () => {
	return MainBuild(_).css();
};

const mainHtml = () => {
	const glob = ["src/*.pug"];
	return MainBuild(_).html(glob);
};

const serve = () => {
	return Serve(_).server();
};

exports.dev = gulp.series(
	cleanDist,
	copyAssets,
	copyFonts,
	copyFavicon,
	copyFakeApi,
	coreJs,
	coreCss,
	mainTs_Browserify,
	mainJs_NormalBabel,
	mainCss,
	mainHtml,
	serve,
);
