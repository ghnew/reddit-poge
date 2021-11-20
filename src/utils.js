export const getMediaType = url => {
    const ext = url && url?.substr(url?.lastIndexOf('.') + 1)?.toLowerCase();
    if (
      ext === 'png' ||
      ext === 'PNG' ||
      ext === 'jpg' ||
      ext === 'JPG' ||
      ext === 'jpeg' ||
      ext === 'JPEG'
    ) {
      return 'image';
    } else if (ext === 'gif' || ext === 'GIF') {
      return 'gif';
    } else if (url && url.includes('v.redd.it')) {
      return 'video';
    } else {
      return 'unknown';
    }
};

export const set = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export const get = key => JSON.parse(localStorage.getItem(key));