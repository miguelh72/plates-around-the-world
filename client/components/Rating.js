import React from 'react';

import './../sass/Rating.scss';

export default function Rating({
  rating,
  setRating
}) {
  return (
    <div className="rating rating2">
      <a className={rating >= 5 ? 'set' : ''} href="#5" title="Give 5 stars" onClick={() => setRating(5)}>★</a>
      <a className={rating >= 4 ? 'set' : ''} href="#4" title="Give 4 stars" onClick={() => setRating(4)}>★</a>
      <a className={rating >= 3 ? 'set' : ''} href="#3" title="Give 3 stars" onClick={() => setRating(3)}>★</a>
      <a className={rating >= 2 ? 'set' : ''} href="#2" title="Give 2 stars" onClick={() => setRating(2)}>★</a>
      <a className={rating >= 1 ? 'set' : ''} href="#1" title="Give 1 star" onClick={() => setRating(1)}>★</a>
    </div>
  );
}
