import { MdStar, MdStarHalf, MdStarBorder } from "react-icons/md";

export default function Star({ value = 0, unrated = false, onSelect = f => f }) {
  return (
    <>
      {unrated ?
        <MdStarBorder color={(value === 0) ? "grey" : "red"} onClick={onSelect} /> :
        (value > 0 && value < 1) ?
          <MdStarHalf color="red" /> :
          <MdStar color={(value === 0) ? "grey" : "red"} />
      }
    </>)
}
