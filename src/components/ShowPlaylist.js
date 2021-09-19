import React from 'react';
import { useState } from 'react';
import Playlist from './Playlist';
import { updatePlaylistName, updatePlaylistRating, updatePlaylistId, updatePlaylistUploads } from './SavePlaylist';
import StarRating, { RateStars } from './StarRating';
import { View, Text, Small, Link, Card, Spinner, FaBackward, FaCloudUploadAlt, FaPen } from './Platform';
import { Row, Col, HorizontalSpacer } from './Lib';

export default function ShowPlaylist({ playlist, onClose = f => f, spotify = null, userPlaylist = false }) {
  const [editing, setEditing] = useState(false);
  const [playlistName, setPlaylistName] = useState(playlist.name);
  const [playlistUserId, setPlaylistUserId] = useState(playlist.user_id);
  const [playlistId, setPlaylistId] = useState(playlist.playlist_id);
  const [playlistUrl, setPlaylistUrl] = useState(null);
  const [rateIt, setRateIt] = useState(playlist.av_rating === 0);
  const [spinner, setSpinner] = useState(false);

  return (
    <Card>
      <Row style={{ justifyContent: 'space-between', padding: 10 }} surface={true} >
        <Col surface={true}>
          <Row style={{ justifyContent: 'flex-start' }} surface={true}>
            {(spotify && spotify.loggedIn()) ?
              <>
                {spinner ?
                  <Spinner animation='border' size='md' /> :
                  <FaCloudUploadAlt size='25'
                    className='link'
                    data-toggle="tooltip"
                    title="Upload to Spotify"
                    onClick={() => {
                      setSpinner(true);
                      spotify.autoRefresh(() => spotify.createNewPlayist(playlistName, playlist.track_ids))
                        .then((spotify_playlist) => {
                          setSpinner(false);
                          setEditing(false);
                          setPlaylistUrl(spotify_playlist.external_urls.spotify);
                          setPlaylistId(spotify_playlist.id);
                          updatePlaylistUploads(
                            playlist.id,
                            (playlist.uploads ? playlist.uploads : 0) + 1
                          )
                            .catch(error => console.error('Error:', error));
                          if (userPlaylist) {
                            setPlaylistUserId(spotify_playlist.owner.id);
                            updatePlaylistId(playlist.id, playlistUserId, playlistId)
                              .catch(error => console.error('Error:', error));
                          }
                        }).catch(error => console.error('Error:', error));
                    }}
                  />}
                <HorizontalSpacer px={10} />
              </> : <></>
            }
            {playlistUrl ?
              <Link
                url={playlistUrl}
                text={playlistName}
              /> :
              <Text onClick={() => { if (userPlaylist) setEditing(true); }}>
                {editing ?
                  <Text
                    value={playlistName}
                    onChange={event => setPlaylistName(event.target.value)}
                    onBlur={() => {
                      setEditing(false);
                      updatePlaylistName(playlist.id, playlistName)
                        .catch(error => console.error('Error:', error));
                    }}
                    onKeyUp={event => {
                      if (event.key === 'Enter') {
                        setEditing(false);
                        updatePlaylistName(playlist.id, playlistName)
                          .catch(error => console.error('Error:', error));
                      }
                    }}
                  /> :
                  <View style={{ display: 'flex' }} surface={true}>
                    <Text h4>{playlistName}</Text>
                    {userPlaylist ?
                      <>
                        <HorizontalSpacer px={10} />
                        <FaPen size='15' className='link' />
                      </> :
                      <></>
                    }
                  </View>
                }
              </Text>
            }
          </Row>
          {(playlist.creativity !== undefined && playlist.noise !== undefined) ?
            <Text h6><Small class='text-muted'>
              creativity {Math.round(playlist.creativity * 100)}%
              , noise {Math.round(playlist.noise * 100)}%
            </Small></Text> :
            <></>
          }
        </Col>
        <Col>
          <Row style={{ justifyContent: 'flex-end' }} surface={true}>
            {rateIt ?
              <Text><RateStars
                totalStars={5}
                onSelect={(rating) => {
                  updatePlaylistRating(
                    playlist.id,
                    (rating + playlist.av_rating) / (playlist.num_ratings + 1),
                    playlist.num_ratings + 1
                  ).catch(error => console.error('Error:', error));
                }}
              /></Text> :
              <Text onClick={() => setRateIt(true)}>
                <StarRating rating={playlist.av_rating} />
              </Text>
            }
          </Row>
        </Col>
      </Row>
      {
        /*
        {playlistUrl ?
          <iframe
            title={playlistId}
            src={'https://open.spotify.com/embed/playlist/' + playlistId}
            width='100%'
            height={80 + 50 * playlist.track_ids.length}
            frameBorder='0'
            allowtransparency='true'
            allow='encrypted-media'
          /> :
        */
      }
      <Playlist {...playlist} />
      {
        /*
        }
        */
      }
      {userPlaylist ?
        <>
          <hr />
          <div className='d-flex align-items-center justify-content-between'>
            <FaBackward
              size='25'
              className='link'
              onClick={() => onClose()}
            />
          </div>
        </> : <></>
      }
    </Card>
  );
}

