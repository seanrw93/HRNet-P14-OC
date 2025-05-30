export const reformatCamelCase = (string) => {
    const upperCaseChar = /(?=[A-Z])/;
    const wordsArray = string?.split(upperCaseChar).map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
    return wordsArray.join(" ");
}
