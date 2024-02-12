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

export default splitParagraph;