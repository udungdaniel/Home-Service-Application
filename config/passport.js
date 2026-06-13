const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const User = require('../models/User');

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL:
                process.env.NODE_ENV === 'production'
                    ? 'https://home-service-application-u66j.onrender.com/auth/github/callback'
                    : 'http://localhost:8181/auth/github/callback'
        },

        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({
                    githubId: profile.id
                });

                if (!user) {
                    const email =
                        profile.emails &&
                        profile.emails.length
                            ? profile.emails[0].value
                            : null;

                    // Check if the email already exists
                    if (email) {
                        user = await User.findOne({
                            email: email
                        });
                    }

                    if (!user) {
                        // Create a new user
                        user = await User.create({
                            githubId: profile.id,
                            name:
                                profile.displayName ||
                                profile.username,

                            email:
                                email ||
                                `${profile.username}@github.local`,

                            role: 'customer',

                            phone: '',

                            address: ''
                        });
                    } else {
                        // Link existing account to GitHub
                        user.githubId = profile.id;
                        await user.save();
                    }
                }

                return done(null, user);

            } catch (error) {
                return done(error, null);
            }
        }
    )
);

/*
|--------------------------------------------------------------------------
| Serialize User
|--------------------------------------------------------------------------
*/

passport.serializeUser((user, done) => {
    done(null, user._id);
});

/*
|--------------------------------------------------------------------------
| Deserialize User
|--------------------------------------------------------------------------
*/

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);

        done(null, user);

    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
