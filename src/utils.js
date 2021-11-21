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

export const set = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));

export const get = key => JSON.parse(localStorage.getItem(key));

export const mapData = data => {
  return {
    id: data.id,
    name: data.name,
    title: data.title,
    thumb: data.thumbnail,
    type: getMediaType(data.url),
    image: data.url,
    url: 'https://www.reddit.com' + data.permalink,
    subreddit: data.subreddit.startsWith('u_')
      ? 'u/' + data.subreddit.slice(2)
      : 'r/' + data.subreddit,
    video: data?.media?.reddit_video?.fallback_url,
  };
};
