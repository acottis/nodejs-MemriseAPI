exports.login = function (creds) {
	return (
		creds.name &&
		creds.name.toString().trim() !== '' &&
		creds.password &&
		creds.password.toString().trim() !== ''
	);
};
