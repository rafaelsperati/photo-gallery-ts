import * as C from "./PhotoItem.style";
type Props = {
  url: string;
  name: string;
};

const PhotoItem = ({ name, url }: Props) => {
  return (
    <C.Container>
      <img src={url} alt={name} />
      {name}
    </C.Container>
  );
};

export default PhotoItem;
