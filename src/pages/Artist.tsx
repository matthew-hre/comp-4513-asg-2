import { useParams } from "react-router";

export default function Artist() {
  const { id } = useParams();
  return <h1>Artist {id}</h1>;
}
