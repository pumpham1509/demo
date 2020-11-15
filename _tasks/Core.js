export default (_) => {
	function css() {
		const vendors = JSON.parse(_.readFileSync("_vendors.json"));
		const cssVendors = vendors.css;
		return _.gulp
			.src(cssVendors, {
				allowEmpty: true,
			})
			.pipe(_.concat("core.min.css"))
			.pipe(
				_.clean({
					compatibility: "ie8",
				}),
			)
			.pipe(_.gulp.dest("dist/css"));
	}

	function js() {
		const vendors = JSON.parse(_.readFileSync("_vendors.json"));
		const jsVendors = vendors.js;
		return _.gulp
			.src(jsVendors, {
				allowEmpty: true,
			})
			.pipe(_.concat("core.min.js"))
			.pipe(_.stripComment())
			.pipe(_.gulp.dest("dist/js"));
	}

	return {
		css,
		js,
	};
};
