const { src, dest, parallel } = require('gulp');

function buildIcons() {
	return src('**/*.svg', { cwd: 'nodes' })
		.pipe(dest('dist/nodes'));
}

function buildCredentialIcons() {
	return src('**/*.svg', { cwd: 'credentials' })
		.pipe(dest('dist/credentials'));
}

exports['build:icons'] = parallel(buildIcons, buildCredentialIcons);
