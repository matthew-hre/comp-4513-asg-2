import { useParams } from "react-router";

export default function Song() {
  const { id } = useParams();
  return <h1>Song {id}</h1>;
}
