import { detect } from 'detect-browser';

const isAudioOnlySupported = () => {
    const browser = detect();

    // Safari on macOS and iOS do not allow WebRTC video without camera permission
    // See https://stackoverflow.com/a/53914556
    if (['safari', 'ios'].indexOf(browser.name) >= 0) {
        return false;
    }

    return true;
};

/**
 * Non-Safari browsers on iOS do not allow access to the microphone or camera
 *
 * ios = Safari
 * crios = Chrome iOS
 * fxios = Firefox iOS
 */
const isCompatible = () => {
    const browser = detect();

    if (browser.os === 'iOS' && browser.name !== 'ios') {
        return false;
    }

    return true;
};

export {
    isAudioOnlySupported,
    isCompatible
};
