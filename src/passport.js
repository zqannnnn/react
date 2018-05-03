const LocalStrategy    = require('passport-local').Strategy
const jwt    = require('jsonwebtoken');

const Models = require('./models')
const UserGitlab = Models.UserGitlab
const UserLocal = Models.UserLocal
const User = Models.User

const consts = require('./config/static')

module.exports = passport => {
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        // if (email)
        //     email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
    
        // asynchronous
        process.nextTick(function() {
            User.findOne({
                where: {email},
                attributes:['id','userType','password','companyConfirmed']
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

