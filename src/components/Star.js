import { MdStar, MdStarHalf, MdStarBorder } from 'react-icons/md';

export default function Star({ value = 0, unrated = false, onSelect = f => f }) {
  return (
    <>
      {unrated ?
        <MdStarBorder
          size='25'
          className={(value === 0) ? 'text-muted' : 'link'}
          style={{ cursor: 'pointer' }}
          onClick={onSelect}
        /> :
        (value > 0 && value < 1) ?
          <MdStarHalf
            size='25'
            className='link'
          /> :
          <MdStar
            size='25'
            className={(value === 0) ? 'text-muted' : 'link'}
            style={{ cursor: 'pointer' }}
          />
      }
    </>)
}
