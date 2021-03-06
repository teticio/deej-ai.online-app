import React, { useState } from 'react';
import Playlist from './Playlist';
import { updatePlaylistName, updatePlaylistRating, updatePlaylistId, updatePlaylistUploads } from './SavePlaylist';
import StarRating, { RateStars } from './StarRating';
import {
  View, Text, TextInput, Small, Link, Card, Spinner,
  FaBackward, FaCloudUploadAlt, FaPen, Hr
} from './Platform';
import { Row, Col } from './Lib';

export default function ShowPlaylist({ style, playlist, onClose = f => f, spotify = null, userPlaylist = false }) {
  const [editing, setEditing] = useState(false);
  const [playlistName, setPlaylistName] = useState(playlist.name);
  const [playlistUserId, setPlaylistUserId] = useState(playlist.user_id);
  const [playlistId, setPlaylistId] = useState(playlist.playlist_id);
  const [playlistUrl, setPlaylistUrl] = useState(null);
  const [rateIt, setRateIt] = useState(playlist.av_rating === 0);
  const [spinner, setSpinner] = useState(false);

  const handleUpload = () => {
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
  }

  const handleUpdate = () => {
    setEditing(false);
    updatePlaylistName(playlist.id, playlistName)
      .catch(error => console.error('Error:', error));
  }

  return (
    <Card style={style}>
      <Row style={{ flexWrap: 'wrap', justifyContent: 'space-between', paddingBottom: 15 }} surface={true} >
        <Col surface={true}>
          {editing ?
            <View style={{ width: 200 }}>
              <TextInput
                value={playlistName}
                onChange={event => setPlaylistName(event.target.value)}
                onChangeText={value => setPlaylistName(value)}
                onBlur={handleUpdate}
                onKeyUp={event => {
                  if (event.key === 'Enter') {
                    handleUpdate();
                  }
                }}
              />
            </View> :
            <Text h4>
              {(spotify && spotify.loggedIn()) ?
                <>
                  {spinner ?
                    <Spinner animation='border' size='md' /> :
                    <FaCloudUploadAlt size='25'
                      className='link'
                      data-toggle="tooltip"
                      title="Upload to Spotify"
                      onClick={handleUpload}
                    />
                  }
                  {' '}
                </> : <></>
              }
              {playlistUrl ?
                <Link
                  url={playlistUrl}
                  text={playlistName}
                /> :
                <>
                  <Text
                    onClick={() => {
                      if (userPlaylist) setEditing(true);
                    }}
                  >{playlistName}
                    {userPlaylist ?
                      <>
                        {' '}
                        <FaPen size='15' className='link' />
                      </> :
                      <></>
                    }
                  </Text>
                </>
              }
            </Text>
          }
          {(playlist.creativity !== undefined && playlist.noise !== undefined) ?
            <Text h6><Small className='text-muted'>
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
      <Playlist {...playlist} playlist_id={playlistId} />
      {userPlaylist ?
        <>
          <Hr />
          <Row style={{ justifyContent: 'space-between' }} surface={true} >
            <FaBackward
              size='25'
              className='link'
              onClick={() => onClose()}
            />
          </Row>
        </> : <></>
      }
    </Card>
  );
}
