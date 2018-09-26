import { PassportStatic } from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { User } from './models'
export const UserFields = [
  'id',
  'userType',
  'password',
  'firstName',
  'lastName',
  'licenseStatus',
  'preferredCurrencyCode'
]

export const passportConfig = (passport: PassportStatic) => {
  passport.use(
    'local-login',
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
      },
      function(req, email, password, done) {
        // if (email)
        //     email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(async function() {
          const user = await User.findOne({
            where: { email },
            attributes: UserFields
          })
          if (!user) {
            return done(null, false)
          }

          const result = await user.validatePassword(password)
          if (result) {
            return done(null, user)
          } else {
            return done(null, false)
          }
        })
      }
    )
  )
}
