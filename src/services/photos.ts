import { Photo } from "../types/Photo";
import { storage } from "../libs/firebase";
import { ref, listAll, getDownloadURL, uploadBytes } from "firebase/storage";
import { uuidv4 } from "@firebase/util";
import { v4 } from "uuid";

export const getAll = async () => {
  let list: Photo[] = [];

  const imageFolder = ref(storage, "images");
  const photoList = await listAll(imageFolder);

  for (let i in photoList.items) {
    let photoURL = await getDownloadURL(photoList.items[i]);

    list.push({
      name: photoList.items[i].name,
      url: photoURL,
    });
  }

  return list;
};

export const insert = async (file: File) => {
  if (["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
    let randomName = v4();
    let newfile = ref(storage, `images/${randomName}`);
    let upload = await uploadBytes(newfile, file);
    let photoURL = await getDownloadURL(upload.ref);
    return {
      name: upload.ref.name,
      url: photoURL,
    } as Photo;
  } else {
    return new Error("Tipo de arquivo não permitido.");
  }
};
