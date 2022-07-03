
export class SocialsRegex {

    static TwitterValidation(profile) {
        const regExp = new RegExp('http(?:s)?://(?:www.)?twitter.com/([a-zA-Z0-9_]+)');
        if(regExp.test(profile)){
            window.open(profile, '_blank');
        } else {
            window.open(`https://twitter.com/${profile}`, '_blank');
        }
    }

    static RedditValidation(profile) {
        let typeOfProfile = 'u'; //Defaulting to user
        if(profile.includes('u/')) {
            typeOfProfile = 'u';
            profile=profile.split('u/')[1];
        } else if(profile.includes('r/')){
            typeOfProfile = 'r'; //Also checks for subreddit
            profile = profile.split('r/')[1];
        }
        const regExp = new RegExp(`http(?:s)?://(?:www.)?reddit.com/${typeOfProfile}/([a-zA-Z0-9_]+)`);
        if(regExp.test(profile)){
            window.open(profile, '_blank');
        } else {
            window.open(`https://reddit.com/${typeOfProfile}/${profile}`, '_blank');
        }
    }

    static DiscordValidation(profile) {
        const regExp = new RegExp('http(?:s)?://?(www.)?(discord.(gg|io|me|li)|discordapp.com/invite)/.+[a-z]');
        if(regExp.test(profile)){
            window.open(profile, '_blank');
        }
    }

    static TelegramValidation(profile) {
        const regExp = new RegExp('http(?:s)?://?(www[.])?(telegram|t).me/([a-zA-Z0-9_-]*)/?$');
        
        if(regExp.test(profile)){
            window.open(profile, '_blank');
        } else {
            window.open(`https://www.telegram.me/${profile}`, '_blank')
        }
    }

    static CheckTwitterHandle(profile) {
        
        const regExp = new RegExp('http(?:s)?://(?:www.)?twitter.com/([a-zA-Z0-9_]+)');
        if(regExp.test(profile)){
            return profile.split('/')[3];
        } else {
            
            return profile;
        }
    }

    static IpfsValidation(profile) {
        const regExp = new RegExp('Qm[1-9A-Za-z]{44}[^OIl]');
        if(regExp.test(profile)){
            return true;
        } else {
            return false;
        }
    }
}