function	base64(str)	 {
    return	new	Buffer(str).toString('base64');
}

var crypto	=	require('crypto');

function	sha1(string)	{
    var sha1	=	crypto.createHash('sha1');
    sha1.update(string);
    return	sha1.digest('base64');
}

exports.base64 = base64;
exports.sha1 = sha1;