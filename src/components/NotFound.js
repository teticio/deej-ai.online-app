import { VerticalSpacer } from './Lib';
import Track from './Track';

export default function NotFound() {
  return (
    <>
      <h3 style={{ textAlign: 'center' }}>I still haven't found what you're looking for...</h3>
      <VerticalSpacer px={10} />
      <div className='d-flex flex-row justify-content-center align-items-center'>
        <Track track_id='6wpGqhRvJGNNXwWlPmkMyO' />
      </div>
    </>
  );
}