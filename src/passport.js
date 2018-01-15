const GitLabStrategy = require('passport-gitlab2').Strategy;
const LocalStrategy    = require('passport-local').Strategy
const jwt    = require('jsonwebtoken');

const Models = require('./models')
const UserGitlab = Models.UserGitlab
const UserLocal = Models.UserLocal
const User = Models.User

const gitlabConfig = require('./config/gitlab')
const consts = require('./config/static')

module.exports = passport => {

    passport.use("gitlab",new GitLabStrategy({
        clientID: gitlabConfig.clientID,
        clientSecret: gitlabConfig.clientSecret,
        callbackURL: gitlabConfig.callbackURL,
        baseURL: gitlabConfig.baseURL,
        state: true
    },function(accessToken, refreshToken, profile, done) {
        // console.log("accessToken:",accessToken)
        // console.log("refreshToken:",refreshToken)
        // search for attributes
        User.findOne({
            where: { "gitlabData.id":{$eq: profile.id}}
        }).then(user => {
            // project will be the first entry of the Projects table with the title 'aProject' || null
            if(user){
                return done(null, user.get({
                    plain: true
                }));
            }else{
                User.create({ userName: profile.username, email: profile.emails[0].value, userType:consts.USER_TYPE_NORMAL, gitlabData: profile })
                .then(user => {
                    return done(null, user.get({
                        plain: true
                    })); 
                })
            }
        })
    }))
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        // if (email)
        //     email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
    
        // asynchronous
        process.nextTick(function() {
            User.findOne({
                where: {email: email}
            }).then(user => {
                if (!user)
                    return done(null, false);
                
                user.validatePassword(password).then(result=>{
                    if(result){
                        return done(null, user.get());
                    }else{
                        return done(null, false);
                    }
                })
            })
        });
    
    }));
}

