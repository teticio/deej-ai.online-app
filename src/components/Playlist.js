import Track from "./Track";

export default function Playlist({ tracks = [] }) {
  return (
    <>
      {tracks.map((track, i) => (
        <div className="d-flex flex-row align-items-center">
          <Track key={i} {...track} highlight={false} />
        </div>
      ))}
    </>
  );
}
