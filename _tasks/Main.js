export default (_) => {
	function html(glob) {
		return _.gulp
			.src(glob)
			.pipe(
				_.plumber(function (err) {
					console.error(err.message.toString());
					this.emit("end");
				}),
			)
			.pipe(
				_.pug({
					pretty: "\t",
				}),
			)
			.pipe(_.gulp.dest("dist"));
	}

	function css() {
		return _.gulp
			.src("src/styles/**.scss", "!src/styles/_*.scss")
			.pipe(_.sourcemaps.init())
			.pipe(
				_.sass({
					sync: true,
					fiber: _.Fiber,
				}).on("error", _.sass.logError),
			)
			.pipe(
				_.postcss([
					_.autoprefixer({
						cascade: false,
					}),
					_.cssSort({
						order: "smacss",
					}),
				]),
			)
			.pipe(
				_.clean({
					compatibility: "ie8",
				}),
			)
			.pipe(
				_.rename({
					suffix: ".min",
				}),
			)
			.pipe(_.sourcemaps.write("."))
			.pipe(_.gulp.dest("dist/css"));
	}

	function tsBrowserify() {
		return _.browserify({
			basedir: ".",
			debug: true,
			entries: ["src/scripts/main.ts"],
			cache: {},
			packageCache: {},
		})
			.plugin(_.tsify)
			.transform("babelify", {
				presets: ["@babel/env"],
				plugins: [
					"@babel/plugin-proposal-class-properties",
					"@babel/plugin-proposal-async-generator-functions",
				],
				extensions: [".ts", ".js"],
			})
			.bundle()
			.on("error", function (err) {
				console.error(err.toString());
				this.emit("end");
			})
			.pipe(_.source("main.min.js"))
			.pipe(_.buffer())
			.pipe(_.sourcemaps.init({ loadMaps: true }))
			.pipe(_.uglify())
			.pipe(_.sourcemaps.write("./"))
			.pipe(_.gulp.dest("dist/js"));
	}

	function jsNormalBabel() {
		return _.gulp
			.src(["src/scripts/**.js"])
			.pipe(
				_.plumber(function (err) {
					console.error(err.toString());
					this.emit("end");
				}),
			)
			.pipe(
				_.babel({
					presets: ["@babel/env"],
				}),
			)
			.pipe(
				_.babelMinify({
					keepClassName: true,
				}),
			)
			.pipe(
				_.rename({
					suffix: ".min",
				}),
			)
			.pipe(_.gulp.dest("dist/js"));
	}

	return {
		html,
		css,
		tsBrowserify,
		jsNormalBabel,
	};
};
