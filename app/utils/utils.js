function splitParagraph(paragraph, wordCount) {
    // Split the paragraph into an array of words
    const words = paragraph.split(' ');

    // Check if the word count is less than the total number of words
    if (wordCount < words.length) {
        // Use slice to get the first part of the paragraph
        const firstPart = words.slice(0, wordCount).join(' ');

        // Use slice to get the remaining part of the paragraph
        const secondPart = words.slice(wordCount).join(' ');

        // Return an object with both parts
        return {
            firstPart: firstPart,
            secondPart: secondPart
        };
    } else {
        // If the word count is greater than or equal to the total number of words,
        // return the entire paragraph as the first part, and an empty string as the second part
        return {
            firstPart: paragraph,
            secondPart: ""
        };
    }
}

function transformAlertFacettes(originalArray) {

    const transformedObject = {
        f: [],
        s: [],
        th: [],
        t: []
    };

    originalArray.forEach(item => {
        const processChildren = (children) => {
            children.forEach(child => {
                switch (child.id.charAt(0)) {
                    case 'F':
                        transformedObject.f.push(child.id);
                        break;
                    case 'S':
                        transformedObject.s.push(child.id);
                        break;
                    case 'T':
                        transformedObject.th.push(child.id);
                        break;
                    case 'T':
                        transformedObject.t.push(child.id);
                        break;
                    default:
                        break;
                }
            });
        };

        switch (item.id.charAt(0)) {
            case 'F':
                transformedObject.f.push(item.id);
                if (item.children) {
                    processChildren(item.children);
                }
                break;
            case 'S':
                transformedObject.s.push(item.id);
                if (item.children) {
                    processChildren(item.children);
                }
                break;
            case 'T':
                transformedObject.th.push(item.id);
                if (item.children) {
                    processChildren(item.children);
                }
                break;
            case 'T':
                transformedObject.t.push(item.id);
                if (item.children) {
                    processChildren(item.children);
                }
                break;
            default:
                break;
        }
    });

    return transformedObject;

}

function encodeAlertString(facettes) {
    let queryString = '';

    Object.keys(facettes).forEach(key => {
        if (facettes[key].length > 0) {
            const encodedValues = facettes[key].map(value => encodeURIComponent(`${key}:${value}`)).join('%20OR%20');
            queryString += `(${encodedValues})AND`;
        }
    });

    // Remove the trailing 'AND'
    queryString = queryString.slice(0, -3);

    return queryString
}

export { splitParagraph, transformAlertFacettes, encodeAlertString };