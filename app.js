const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const WebAppStrategy = require('ibmcloud-appid').WebAppStrategy;
var port = process.env.VCAP_APP_PORT || 8080;
app.use(session({
	secret: '123456',
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((user, cb) => cb(null, user));
passport.use(new WebAppStrategy({
	tenantId: "a2059eef-dfb8-4b84-8f82-1e876fbe6dab",
	clientId: "ef50a223-d785-42f4-8a7a-f7ad1bcbcb86",
	secret: "YTJjMTMyMzItM2JlZC00Mzg5LWJhY2UtYjRhZjk4NzhjOWEw",
	oauthServerUrl: "https://eu-gb.appid.cloud.ibm.com/oauth/v4/a2059eef-dfb8-4b84-8f82-1e876fbe6dab",
	redirectUri: "https://hotel-management-pro.eu-gb.cf.appdomain.cloud/appid/callback"
}));

app.get('/appid/callback', passport.authenticate(WebAppStrategy.STRATEGY_NAME));
app.use(passport.authenticate(WebAppStrategy.STRATEGY_NAME));

app.get('/api/user', (req, res) => {
	console.log(req.session[WebAppStrategy.AUTH_CONTEXT]);
	res.json({
		user: {
			name: req.user.name
		}
	});
});


app.get('/appid/logout', function(req, res){
	WebAppStrategy.logout(req);
	res.redirect('/');
});

app.use(express.static("./public"));
app.listen(port, () => {
    console.log('Listening on https://hotel-management-pro.eu-gb.cf.appdomain.cloud/');
});
