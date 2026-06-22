module.exports.cookieOptions = {
		httpOnly: true,
		sameSite: 'Lax',
		secure: process.env.NODE_ENV === 'production',
		maxAge: 24*60*60*1000
	};