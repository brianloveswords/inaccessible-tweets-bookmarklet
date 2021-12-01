# inaccessible-tweets-bookmarklet

make your twitter experience even worse by blurring tweets with inaccessible images (no alt text). spoiler: it's most of them.

## usage

1. Copy this to your clipboard:
```js
javascript:(function(){function i(){const e="div[data-testid=tweetPhoto] > img[alt=Image]";return[...document.body.querySelectorAll(e)]}function l(e){let t=s(e,n=>n.tagName.toLowerCase()==="article");!t||(t.classList.add("alt-bookmarklet-image"),t.style.opacity="0.25",t.style.filter="blur(1px)")}function s(e,t){for(;e&&!t(e);)e=e.parentElement;return e}function o(){i().forEach(e=>l(e))}const a={childList:!0,subtree:!0};function c(e,t){for(const n of e)n.type==="childList"&&o()}const r=document.querySelector("main");if(!r)throw new Error("Could not find main element");new MutationObserver(c).observe(r,a),o()})();
```
2. Follow these instructions to figure out how to install a bookmarklet https://mreidsma.github.io/bookmarklets/installing.html

3. Give it a name like "🎭 No Alt Images" or something


