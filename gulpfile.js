import gulp from "gulp";
import gulpSass from "gulp-sass";
import sass from "sass";
const sassCompiler = gulpSass(sass);
import ts from "gulp-typescript";

gulp.task("scss", function () {
  return gulp
    .src("./src/assets/styles/**/*.scss")
    .pipe(sassCompiler().on("error", sassCompiler.logError))
    .pipe(gulp.dest("./dist/styles"));
});

gulp.task("typescript", function () {
  return gulp
    .src("./src/scripts/**/*.ts")
    .pipe(ts({ noImplicitAny: true }))
    .pipe(gulp.dest("./dist/scripts"));
});

gulp.task("watch", function () {
  gulp.watch("./src/assets/styles/**/*.scss", gulp.series("scss"));
  gulp.watch("./src/scripts/**/*.ts", gulp.series("typescript"));
});

gulp.task("default", gulp.series("scss", "typescript", "watch"));
