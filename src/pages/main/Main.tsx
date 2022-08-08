import * as C from "./Main.styles";
import * as Photos from "../../services/photos";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { Photo } from "../../types/Photo";
import PhotoItem from "../../components/PhotoItem";

const Main = () => {
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const getPhotos = async () => {
      setLoading(true);
      let photos = await Photos.getAll();
      setPhotos(photos);
      setLoading(false);
    };
    getPhotos().catch(console.error);
  }, []);

  const handleFormSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const file = formData.get("image") as File;

      if (file && file.size > 0) {
        setUploading(true);
        let result = await Photos.insert(file);
        setUploading(false);

        if (result instanceof Error) {
          alert(`${result.name} - ${result.message}`);
        } else {
          let newPhotoList = [...photos];
          newPhotoList.push(result);
          setPhotos(newPhotoList);
        }
      }
    },
    [photos]
  );

  return (
    <C.Container>
      <C.Area>
        <C.Header>Galeria de Fotos</C.Header>
        <C.UploadForm method="POST" onSubmit={(e) => handleFormSubmit(e)}>
          <input type="file" name="image" />
          <input type="submit" value="Enviar" />
          {uploading && "Enviando..."}
        </C.UploadForm>

        {loading && (
          <C.ScreenWarning>
            <div className="emoji">✋</div>
            <div>Carregando...</div>
          </C.ScreenWarning>
        )}

        {!loading && photos.length > 0 && (
          <C.PhotoList>
            {photos.map((item, index) => (
              <PhotoItem key={index} url={item.url} name={item.name} />
            ))}
          </C.PhotoList>
        )}

        {!loading && photos.length === 0 && (
          <C.ScreenWarning>
            <div className="emoji">😔</div>
            <div>Não há fotos cadastradas</div>
          </C.ScreenWarning>
        )}
      </C.Area>
    </C.Container>
  );
};

export default Main;
