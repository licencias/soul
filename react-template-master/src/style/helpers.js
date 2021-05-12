export const animationDelay = (values) => {
    let css = '';

    for (let i = 0; i < values.length; i++) {
        css += `
        &:nth-child(${i + 1}) {
            animation-delay: ${values[i]}s;
        }
        `;
    }

    return css;
};
