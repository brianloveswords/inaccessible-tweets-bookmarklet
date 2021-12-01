// @ts-check
(function () {
    /**
     * @param {string} selector
     * @returns {HTMLElement}
     */
    function qs(selector) {
        return document.querySelector(selector);
    }

    /**
     * @param {string} selector
     * @returns {NodeListOf<HTMLElement>}
     */
    function qsa(selector) {
        return document.querySelectorAll(selector);
    }

    /**
     * @returns {HTMLElement[]} the list of all elements with the given
     */
    function selectInaccessibleImages() {
        const selector = "div[data-testid=tweetPhoto] > img[alt=Image]";
        // @ts-ignore
        return [...qsa(selector)];
    }

    /**
     * @param {HTMLElement} img
     */
    function mutateElement(img) {
        let p = findUp(img, (e) => e.tagName.toLowerCase() === "article");
        if (!p) {
            return;
        }
        p.classList.add("alt-bookmarklet-image");
        p.style.opacity = "0.25";
        p.style.filter = "blur(1px)";
    }

    /**
     * @param {HTMLElement} e
     * @param {(e: HTMLElement) => Boolean} predicate
     */
    function findUp(e, predicate) {
        while (e && !predicate(e)) {
            e = e.parentElement;
        }
        return e;
    }

    function lowlightInaccessibleImages() {
        selectInaccessibleImages().forEach((e) => mutateElement(e));
    }

    /** @type {MutationObserverInit} */
    const elementMutationsOnly = {
        childList: true,
        subtree: true,
    };

    /** @type {MutationObserverInit} */
    const allMutations = {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
    };

    function composeObserverCallback() {
        console.trace("compose observer callback");
        if (composeHasAlt()) {
            showTweetButton();
        } else {
            hideTweetButton();
        }
    }

    function getTweetButton() {
        return qs("[data-testid=tweetButton]");
    }

    function hideTweetButton() {
        let button = getTweetButton();

        if (!button) {
            return;
        }

        button.style.display = "none";
    }

    /** @returns {boolean} */
    function isComposeModalOpenWithImage() {
        let dialog = getComposeDialog();
        if (!dialog) {
            return false;
        }
        return !!dialog.querySelector("[data-testid=altTextLabel]");
    }

    function showTweetButton() {
        let button = getTweetButton();

        if (!button) {
            return;
        }

        button.style.display = "";
    }

    function composeHasAlt() {
        return qs("[role=dialog] [data-testid=altTextLabel]")?.innerText !== "Add description";
    }

    function getComposeDialog() {
        return qs("[role=dialog]");
    }

    function bodyObserverCallback() {
        checkComposeObserver();
        lowlightInaccessibleImages();
    }

    /** @type {MutationObserver} */
    let composeObserver;
    let composeObserverConnected = false;
    function checkComposeObserver() {
        if (!composeObserver) {
            composeObserver = new MutationObserver(composeObserverCallback);
        }

        if (isComposeModalOpenWithImage()) {
            composeObserver.observe(getComposeDialog(), allMutations);
            composeObserverCallback();
            composeObserverConnected = true;
        } else {
            if (composeObserverConnected) {
                showTweetButton();
                composeObserver.disconnect();
                composeObserverConnected = false;
            }
        }
    }

    const mainElement = document.querySelector("main");
    if (!mainElement) {
        throw new Error("Could not find main element");
    }
    const bodyObserver = new MutationObserver(bodyObserverCallback);
    lowlightInaccessibleImages();
    bodyObserver.observe(document.body, elementMutationsOnly);
})();

// sketch for disabling tweets without alt
// document.body.querySelector("[data-testid=altTextLabel]")?.innerText === 'Add description'
// document.body.querySelector("[data-testid=tweetButton]").style.display = "none"
// document.body.querySelector("[role=dialog] [data-testid=tweetButton]")
