const fs = require("fs");

function copyFallback(target, path, callback) {
  fs.cp(target, path, { recursive: true, force: false, errorOnExist: true }, callback);
}

const originalSymlink = fs.symlink;
fs.symlink = function symlinkWithCopyFallback(target, path, type, callback) {
  const cb = typeof type === "function" ? type : callback;
  const linkType = typeof type === "function" ? undefined : type;

  return originalSymlink.call(fs, target, path, linkType, (err) => {
    if (!err) {
      cb(null);
      return;
    }

    if (err.code !== "EPERM") {
      cb(err);
      return;
    }

    copyFallback(target, path, cb);
  });
};

const originalSymlinkSync = fs.symlinkSync;
fs.symlinkSync = function symlinkSyncWithCopyFallback(target, path, type) {
  try {
    return originalSymlinkSync.call(fs, target, path, type);
  } catch (err) {
    if (!err || err.code !== "EPERM") throw err;
    return fs.cpSync(target, path, { recursive: true, force: false, errorOnExist: true });
  }
};

const originalPromisesSymlink = fs.promises.symlink.bind(fs.promises);
fs.promises.symlink = async function promisesSymlinkWithCopyFallback(target, path, type) {
  try {
    return await originalPromisesSymlink(target, path, type);
  } catch (err) {
    if (!err || err.code !== "EPERM") throw err;
    return fs.promises.cp(target, path, { recursive: true, force: false, errorOnExist: true });
  }
};
