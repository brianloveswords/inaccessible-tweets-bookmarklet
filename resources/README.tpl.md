# inaccessible-tweets-bookmarklet


make your twitter experience even worse by blurring tweets with that have images with no alt text (which is, unfortunately, most of them).


## usage

1. copy this to your clipboard:
```js
javascript:%%%JS%%%
```
2. follow these instructions to figure out how to install a bookmarklet https://mreidsma.github.io/bookmarklets/installing.html

3. give it a name like "🎭 No Alt" or something, I dunno


## why?


I want to stop retweeting images without alt text, but twitter makes it uhhhhh not easy to tell which images actually *have* alt text.

there are great bots like [@AltTextReminder](https://twitter.com/AltTxtReminder) and [@CaptionClerk](https://twitter.com/CaptionClerk) that will tell you when you've (re)tweeted something without alt, but since I mostly retweet, I want a way of knowing *before* I retweet so I don't have to un-retweet.


## how?

twitter's DOM is div 🍲 with classes like `c-a209l` and `r-av3d1`, but fortunately there are a few things can hang our hats on a few things:

- `div[data-testid=tweetPhoto]`: tweets with photos will have this `data` attribute.
- `img[alt=Image]`: images without provided alt [get the default of "Image"](https://twitter.com/thingskatedid/status/1360331792067166208)
- `article`: tweets are contained in an `article` element

so we can find `div[data-testid=tweetPhoto] > img[alt=Image]` then walk back up from there until we hit the first `article` and blur the shit out of it.

twitter loads/unloads tweets into the timeline element when the viewport moves, so we gotta keep doing this on a regular basis. we can use a [`MutationObserver`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) for this and stick it on the `main` element, which contains the timeline.


## but this only works for twitter web


yeah, that's the version I use everywhere. honestly I recommend it; for some reason I don't get any promoted tweets and it's the last to get new features so things will come and go and you'll never even notice because you never got it. sometimes I think they forgot it exits.


## building

- DON'T edit `README.md` directly
- make changes to `resources/README.tpl.md`
- make changes to `src/bookmarklet.js`
- `npm run build`
