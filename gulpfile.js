const { src, dest, parallel } = require('gulp');

function buildIcons() {
	return src('**/*.svg', { cwd: 'nodes' })
		.pipe(dest('dist/nodes'));
}

function buildCredentialIcons() {
	return src('**/*.svg', { cwd: 'credentials' })
		.pipe(dest('dist/credentials'));
}

function buildNodeJson() {
	return src('**/*.node.json', { cwd: 'nodes' })
		.pipe(dest('dist/nodes'));
}

exports['build:icons'] = parallel(buildIcons, buildCredentialIcons, buildNodeJson);
