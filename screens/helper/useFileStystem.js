/* eslint-disable @typescript-eslint/restrict-template-expressions */
import RNFetchBlob, {Dirs} from 'rn-fetch-blob';
const dirs = RNFetchBlob.fs.dirs;
const DownloadDir = dirs.DownloadDir;

export const getFileSizeFromURL = async url => {
  const filename = url.split('?')[0].split('/');
  console.log(filename[filename.length - 1]);
  try {
    const response = await fetch(url, {method: 'HEAD'});
    // Check if the response status is OK (200)
    if (response.ok) {
      const contentLength = response.headers.get('Content-Length') ?? '';
      const fileSizeInBytes = parseInt(contentLength, 10);

      if (!isNaN(fileSizeInBytes)) {
        console.log('fileSizeInBytes', fileSizeInBytes);
        return fileSizeInBytes;
      } else {
        console.error('Invalid Content-Length header:', contentLength);
        return 0;
      }
    } else {
      console.error('Failed to fetch file size. HTTP status:', response.status);
      return 0;
    }
  } catch (error) {
    console.error('Error fetching file size:', error);
    return 0;
  }
};
// return directory if already exists otherwise create then return
export const getPathForDownload = async () => {
  try {
    const path = DownloadDir + '/chatrn';
    const res = await checkIfFileExists(path);
    if (res) {
      return path;
    } else {
      await RNFetchBlob.fs.mkdir(path);
      return DownloadDir + '/chatrn';
    }
  } catch (error) {
    console.log('getDirs Error==', error);
    return DownloadDir;
  }
};

//  Check total available space
export const getAvailableSpace = async () => {
  try {
    const freeSpace = await RNFetchBlob.fs.df();
    return freeSpace.free ?? freeSpace?.internal_free;
  } catch (error) {
    console.log('getAvailableSpace Error==', error);
    return 0;
  }
};
// Check if file already exists
export const checkIfFileExists = async filePath => {
  console.log(filePath);
  const filename = filePath.split('?')[0].split('/');
  const path = `${DownloadDir}/${filename[filename.length - 1]}`;
  try {
    const exists = await RNFetchBlob.fs.exists(path);
    return exists;
  } catch (error) {
    console.log('checkIfFileExists Error==', error);
    return false;
  }
};
export const getLocalUrl = async url => {
  const filename = url.split('?')[0].split('/');
  return `${DownloadDir}/${filename[filename.length - 1]}`;
};
export const downloadFileFromurl = async url => {
  const filename = url.split('?')[0].split('/');
  const path = `${DownloadDir}/${filename[filename.length - 1]}`;
  try {
    const fileSize = await getFileSizeFromURL(url);
    const availableSpace = await getAvailableSpace();
    if (fileSize > availableSpace) {
      return {
        status: 500,
        msg: `Not enough space: ${availableSpace - fileSize}`,
      };
    } else {
      const res = await RNFetchBlob.config({
        addAndroidDownloads: {
          useDownloadManager: true, // <-- this is the only thing required
          // Optional, override notification setting (default to true)
          notification: true,
          // Optional, but recommended since android DownloadManager will fail when
          // the url does not contains a file extension, by default the mime type will be text/plain
          // mime: 'text/plain',
          description: 'File downloaded by download manager.',
          path: path,
        },
      }).fetch('GET', url);
      if (res?.data) {
        console.log(res?.data);
        return {
          status: 200,
          msg: `File downloaded to: ${res?.data}`,
        };
      } else {
        return {
          status: 500,
          msg: `Download failed : ${res.data}`,
        };
      }
    }
  } catch (error) {
    return {
      status: 500,
      msg: `Download failed : ${error}`,
    };
  }
};
