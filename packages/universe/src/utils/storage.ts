import fs from "fs";
import path from "path";
import { IFile, fileSchema } from "../schemas/base";
import { UploadedFile } from "express-fileupload";
// import { awsAccess } from "../config";
// import { EnBucketPath } from "../constants";
const RootPath = path.dirname(__dirname);
export const AssetFolder = path.join(RootPath, "assets");
export function createFolderIfNotExists(path: string) {
  if (fs.existsSync(path)) {
    return;
  }
  return fs.mkdirSync(path, { recursive: true });
}
export function createAsset(fileContent: string, filepath: string) {
  const folder = path.dirname(filepath);
  createFolderIfNotExists(folder);
  const buffer = Buffer.from(fileContent, "base64");
  return fs.writeFileSync(filepath, buffer);
}

export function createFile(fileContent: string, filepath: string) {
  const folder = path.dirname(filepath);
  createFolderIfNotExists(folder);
  const writer = fs.createWriteStream(filepath, { flags: "a" });
  writer.write(fileContent);
  // return fs.writeFileSync(filepath, fileContent, { flag: "a" });
}

export function moveImageFile(
  from: string,
  to: string = path.join(RootPath, "assets", `${Date.now()}.jpg`),
) {
  const folder = path.dirname(to);
  createFolderIfNotExists(folder);
  fs.renameSync(from, to);
  const relativePath = path.relative(RootPath, to);
  return relativePath.replace(/\\/g, "/");
  // return fs.writeFileSync(filepath, fileContent, { flag: "a" });
}

export async function moveUploadedFile(
  file: UploadedFile,
  to: string = path.join(RootPath, "assets", `${Date.now()}.jpg`),
) {
  await file.mv(to);
  const relativePath = path.relative(RootPath, to);
  return relativePath.replace(/\\/g, "/");
}

export function storeOnLocalAsset(data: string, filePathName: string): string;
export function storeOnLocalAsset(
  data: string,
  filePath: string,
  fileName: string,
): string;
export function storeOnLocalAsset(
  data: string,
  filePath: string,
  fileName?: string,
): string {
  if (fileName) {
    filePath = path.join(filePath, fileName);
  }
  createAsset(data, filePath);
  const relativePath = path.relative(RootPath, filePath);
  return relativePath.replace(/\\/g, "/");
}

export function isFile(file: unknown): file is IFile {
  try {
    fileSchema.parse(file);
    return true;
  } catch (err) {
    return false;
  }
}

export function isUploadedFile(file: unknown): file is UploadedFile {
  if (
    typeof file === "object" &&
    file &&
    "data" in file &&
    file.data instanceof Buffer &&
    "mv" in file &&
    typeof file.mv === "function"
  ) {
    return true;
  }
  return false;
}
// export async function storeOnCloud(
//   data: string,
//   filePathName: string,
// ): Promise<{ filePath: string; fileSize: number }>;
// export async function storeOnCloud(
//   data: string,
//   filePath: string,
//   fileName: string,
// ): Promise<{ filePath: string; fileSize: number }>;
// export async function storeOnCloud(
//   data: string,
//   filePath: string,
//   fileName?: string,
// ): Promise<{ filePath: string; fileSize: number }> {
//   const buffer = Buffer.from(data, "base64");
//   // return fs.writeFileSync(filepath, buffer);
//   const Key = fileName
//     ? path.join(filePath, fileName).replace(/\\/g, "/")
//     : path.join(EnBucketPath.Assets, filePath).replace(/\\/g, "/");
//   const { Location } = await awsAccess.uploadOnBucket({
//     Bucket: "lokasevatest",
//     Key,
//     Body: buffer,
//   });
//   return { filePath: Location, fileSize: buffer.byteLength };
// }
