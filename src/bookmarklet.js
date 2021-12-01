// @ts-check
(function () {
    /**
     * @returns {HTMLElement[]} the list of all elements with the given
     */
    function selectInaccessibleImages() {
        const selector = "div[data-testid=tweetPhoto] > img[alt=Image]";
        // @ts-ignore
        return [...document.body.querySelectorAll(selector)];
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
    const observerConfig = {
        childList: true,
        subtree: true,
    };

    /**
     *
     * @param {MutationRecord[]} mutationsList
     * @param {MutationObserver} observer
     */
    function mutationObserverCallback(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
                lowlightInaccessibleImages();
            }
        }
    }

    const mainElement = document.querySelector("main");
    if (!mainElement) {
        throw new Error("Could not find main element");
    }
    const observer = new MutationObserver(mutationObserverCallback);
    observer.observe(mainElement, observerConfig);
    lowlightInaccessibleImages();
})();
