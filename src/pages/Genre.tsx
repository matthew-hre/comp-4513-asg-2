import { useParams } from "react-router";

export default function Genre() {
  const { id } = useParams();
  return <h1>Genre {id}</h1>;
}
