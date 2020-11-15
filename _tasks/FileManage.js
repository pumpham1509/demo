export default (_) => {
	function Copy(fileGlob, destination) {
		return _.gulp
			.src(fileGlob, {
				allowEmpty: true,
			})
			.pipe(_.gulp.dest(destination));
	}

	function Delete(pathName) {
		return _.del(pathName);
	}

	return {
		Copy,
		Delete,
	};
};
