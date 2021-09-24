import React from 'react';
import GoogleBadge from '../images/google-play-badge.png'
import AppleBadge from '../images/download-on-the-app-store.png'
import { ReactJSOnly, Text, Link, FaPlus, FaForward, FaCloudUploadAlt, FaSpotify, FaCog } from './Platform';
import { B, I, VerticalSpacer, Row } from './Lib';

export default function About() {
  return (
    <>
      <Text h3 style={{ textAlign: 'center' }}>About Deej-A.I.</Text>
      <Text h5 data-testid='blurb'>
        <B>Deej-A.I.</B> uses artificial intelligence to automatically
        generate playlists of tracks that go well together. It was trained using hundreds of thousands of
        Spotify tracks and user playlists.
      </Text>
      <VerticalSpacer px={15} />
      <Text h5>
        Create a playlist by adding <FaPlus /> any tracks that you would like to include.
        Pressing <FaForward /> will then generate a playlist that smoothly "<I>joins the dots</I>" between
        them. This is a great way to create playlists that start off with chill out, for example, and build
        up to dance music as the party picks up!
      </Text>
      <VerticalSpacer px={15} />
      <Text h5>
        Don't forget to rate the playlists! This will help other people find the best ones.
      </Text>
      <VerticalSpacer px={15} />
      <Text h5>
        If you have a Spotify <FaSpotify /> account and you log in, you will see the current track if one
        is playing when creating a playlist. By clicking on this, Deej-A.I. will search for similar sounding
        tracks in its database. You will also be able to upload <FaCloudUploadAlt /> playlists to your account.
      </Text>
      <VerticalSpacer px={15} />
      <Text h5>
        In the settings screen <FaCog />, you can control the number of tracks that are added to the
        playlists as well as a couple of aspects of how they are generated. If <I>creativity</I> is set to 100%,
        then tracks are chosen with similar sound, energy, mood and instrumentation. It does this by
        simply "listening" and not using any information about the tracks themselves. If creativity
        is set to 0%, then tracks are selected based on similar artists ("Spotify users also included in
        their playlists..."). You can use the <I>noise</I> setting to add a bit of randomness.
      </Text>
      <VerticalSpacer px={15} />
      <Text h5>
        This was my Masters in Deep Learning projects
        at <Link
          url='https://www.mbitschool.com/'
          text='MBIT School'
        />
        . If you want to learn about it works, check out
        this <Link
          url='https://towardsdatascience.com/create-automatic-playlists-by-using-deep-learning-to-listen-to-the-music-b72836c24ce2'
          text='article'
        />.
      </Text>
      <ReactJSOnly>
        <VerticalSpacer px={15} />
        <Row>
          <Link style={{ width: 150, height: 60 }}
            url='https://play.google.com/store/apps/details?id=online.deejai.www&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'
            source={GoogleBadge}
            alt='Get it on Google Play'
          />
          <Link style={{ width: 120, height: 40 }}
            url='https://apps.apple.com/us/app/deej-a-i/id1529860910?mt=8'
            source={AppleBadge}
            alt='Get it on App Store'
          />
        </Row>
      </ReactJSOnly>
    </>
  );
}
