export const decodeImage = (base64String) => {
  // decode the data URL

  const decoder = new TextDecoder("base64");
  const binary = decoder.decode(base64String.split(",")[1]);

  // create a buffer from the binary data
  const buffer = new ArrayBuffer(binary.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) {
    view[i] = binary.charCodeAt(i);
  }

  // create a blob from the buffer
  const blob = new Blob([view], { type: "image/gif" });

  // create an object URL from the blob
  const objectURL = URL.createObjectURL(blob);

  console.log(objectURL);
};
