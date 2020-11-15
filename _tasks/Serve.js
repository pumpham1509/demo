import MainBuild from "./Main";
import CoreBuild from "./Core";
import FileManage from "./FileManage";
import compress from "compression";

export default (_) => {
	const imageChangeTask = (path, stats) => {
		const fileName = path.replace(/[\/\\]/g, "/");
		const destinationPathname = fileName
			.replace("src", "dist")
			.replace(fileName.split("/")[fileName.split("/").length - 1], "");
		_.del(fileName.replace("src", "dist"));
		console.log(`Copy: "${fileName}"   =====>   "${destinationPathname}"`);
		return _.gulp.src(fileName).pipe(_.gulp.dest(destinationPathname));
	};

	const imageRemoveTask = (path, stats) => {
		const fileName = path.replace(/[\/\\]/g, "/");
		const destinationPathname = fileName.replace("src", "dist");
		console.log(`Deleted: "${destinationPathname}"`);
		return _.del(destinationPathname);
	};

	const watchScss = () => {
		return MainBuild(_).css();
	};

	const watchPug = () => {
		return MainBuild(_).html("src/**.pug");
	};

	const watchTypescript = () => {
		return MainBuild(_).tsBrowserify();
	};

	const watchJavascript = () => {
		return MainBuild(_).jsNormalBabel();
	};

	const watchApi = () => {
		return FileManage(_).Copy("src/api/**", "dist/api");
	};

	function server() {
		_.bSync.init({
			notify: false,
			server: {
				baseDir: "dist",
				middleware: function (req, res, next) {
					var gzip = compress();
					gzip(req, res, next);
				},
			},
			port: 8000,
		});

		_.gulp.watch(["src/**.pug"]).on("change", (path, stats) => {
			const fileName = path.split("\\" || "/")[1];
			const glob = path.replace(/[\\\/]/g, "/");
			console.log(`Render file ${fileName}`);
			return MainBuild(_).html(glob);
		});

		_.gulp
			.watch([
				"src/_templates/**/**.pug",
				"!src/_templates/_layout/**.pug",
			])
			.on("change", (path, stats) => {
				const fileName = path.split("\\" || "/")[2];
				const glob = `src/${fileName}.pug`;
				console.log(`Render file ${fileName}.pug`);
				return MainBuild(_).html(glob);
			});

		_.gulp
			.watch(["src/assets/**/**"], {
				ignorePermissionErrors: true,
				delay: 300,
				events: "all",
			})
			.on("add", imageChangeTask)
			.on("change", imageChangeTask)
			.on("addDir", imageChangeTask)
			.on("unlink", imageRemoveTask)
			.on("unlinkDir", imageRemoveTask);

		_.gulp.watch(
			["_vendors.json", "vendors/**/**.css", "vendors/**/**.js"],
			_.gulp.series(CoreBuild(_).css, CoreBuild(_).js),
		);

		_.gulp.watch(
			["src/_templates/_layout/**.pug"],
			_.gulp.series(watchPug),
		);

		_.gulp.watch(["src/scripts/**.js"], _.gulp.series(watchJavascript));

		_.gulp.watch(
			[
				"src/scripts/main.ts",
				"src/scripts/libraries/**.ts",
				"src/scripts/utilities/**.ts",
			],
			_.gulp.series(watchTypescript),
		);

		_.gulp.watch(["src/styles/**/**.scss"], _.gulp.series(watchScss));

		_.gulp.watch("src/api/**/**", _.gulp.series(watchApi));

		_.gulp.watch(["dist/**/**.**"]).on("change", _.bSync.reload);
	}

	return {
		server,
	};
};
