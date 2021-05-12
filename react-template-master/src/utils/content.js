import PanelType from '@constants/PanelType';

/**
 * Process the incoming context data and decode any JSON strings
 */
const prepContextData = (context) => {
    const result = {};

    if (typeof context !== 'object') {
        return result;
    }

    const keys = Object.keys(context);

    keys.forEach((key) => {
        if (context.hasOwnProperty(key)) {
            let data = context[key];

            if (typeof data === 'string') {
                try {
                    data = JSON.parse(data);
                } catch (e) {}
            }

            if (data) {
                result[key] = data;
            }
        }
    });

    return result;
};

/**
 * Determine if a message has an info panel
 */
const isPanelMessage = (message) => {
    return !!message.panel;
};

/**
 * Remove existing options panels from the transcript
 *
 * Typically if a new user message is received, previous options will no longer
 * be relevant.
 */
const removeOptionsPanels = (transcript) => {
    return transcript.filter((message) => {
        // Transcript messages
        if (message.panel && message.panel.type === PanelType.OPTIONS) {
            return false;
        }

        return true;
    });
};

/**
 * We've received a new message, so remove options items and close the panel
 */
const resetInfoPanels = (activePanelIndex, infoPanels) => {
    // Remove options items
    infoPanels = infoPanels.filter((item) => {
        return item.type !== PanelType.OPTIONS;
    });

    // Push the active index back to the last good panel
    if (activePanelIndex > infoPanels.length - 1) {
        activePanelIndex = infoPanels.length - 1;
    }

    return {
        activePanelIndex,
        infoPanels,
    };
};

export {
    prepContextData,
    isPanelMessage,
    removeOptionsPanels,
    resetInfoPanels
};
