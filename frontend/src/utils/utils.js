// src/utils/utils.js
const getInitials = name => {
    const splitName = name.split(' ');
    if (splitName.length > 1) {
        return splitName[0][0] + splitName[splitName.length - 1][0];  // Take first initial and last initial
    }
    return splitName[0][0];  // Take the first initial if only one word
};

export { getInitials };
