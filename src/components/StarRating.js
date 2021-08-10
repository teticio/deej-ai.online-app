import { useState } from "react";
import Star from "./Star";
import { createArray } from "../lib";

export default function StarRating({ rating }) {
  return (
    <>
      {createArray(Math.floor(rating)).map((n, i) => (
        <Star
          key={i + 1}
          value={(Math.floor(rating) > i) ? 1 : 0}
        />
      ))}
      {(rating - Math.floor(rating) >= 0.5) ?
        <Star
          key={0}
          value={0.5}
        /> : <div />
      }
    </>
  );
}

export function RateStars({ totalStars = 5, onSelect = f => f }) {
  const [selectedStars, setSelectedStars] = useState(0);

  return (
    <>
      {createArray(totalStars).map((n, i) => (
        <Star
          key={i}
          unrated={true}
          value={(selectedStars > i) ? 1 : 0}
          onSelect={() => {
            if (selectedStars === 1 && i === 0) { // toggle 1 star
              setSelectedStars(0);
              onSelect(0);
            } else {
              setSelectedStars(i + 1);
              onSelect(i + 1);
            }
          }}
        />
      ))}
    </>
  );
}
