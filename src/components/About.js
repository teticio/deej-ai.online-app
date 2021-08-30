import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FaPlus, FaForward, FaSave, FaSpotify, FaCog } from "react-icons/fa";
import { VerticalSpacer } from "../lib";

export default function About() {
  return (
    <>
      <h5>
        <b>Deej-A.I.</b> uses artificial intelligence to automatically generate playlists of tracks that go well
        together. It was trained using hundreds of thousands of Spotify tracks and user playlists.
      </h5>
      <VerticalSpacer px={15} />
      <h5>
        Create a playlist by adding <FaPlus /> any tracks that you would like to include.
        Pressing <FaForward /> will then generate a playlist that smoothly "<i>joins the dots</i>" between
        them. This is a great way to create playlists that start off with chill out, for example, and build
        up to dance music as the party picks up!
      </h5>
      <VerticalSpacer px={15} />
      <h5>
        Don't forget to rate the playlists! This will help other people find the best ones.
      </h5>
      <VerticalSpacer px={15} />
      <h5>
        If you have a Spotify <FaSpotify /> account and you log in, you will see the current track if one
        is playing. By clicking on this, Deej-A.I. will search for similar sounding tracks in its database.
        You will also be able to save <FaSave /> playlists to your account.
      </h5>
      <VerticalSpacer px={15} />
      <h5>
        In the settings screen <FaCog />, you can control the number of tracks that are added to the
        playlists as well as a couple of aspects of how they are generated. If creativity is set to 100%,
        then tracks are chosen with similar sound, energy, mood and instrumentation. It does this by
        simply "listening" and not using any information about the tracks themselves. If <i>creativity</i>
        is set to 0%, then tracks are selected based on similar artists ("Spotify users also included in
        their playlists..."). You can use the <i>noise</i> setting to add a bit of randomness.
      </h5>
      <VerticalSpacer px={15} />
      <h5>
        This was my Masters in Deep Learning project at <a
          href="https://www.mbitschool.com/"
          target="_blank"
          rel="noopener noreferrer"
        >MBIT School</a>. If you want to learn about it works, check out this <a
          href="https://towardsdatascience.com/create-automatic-playlists-by-using-deep-learning-to-listen-to-the-music-b72836c24ce2"
          target="_blank"
          rel="noopener noreferrer"
        >article</a>.
      </h5>
      <VerticalSpacer px={15} />
      <Row className="align-items-center">
        <Col>
          <div className="text-center">
            <a
              href='https://play.google.com/store/apps/details?id=online.deejai.www&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'
              target="_blank"
              rel="noopener noreferrer"
            ><img
                alt='Get it on Google Play'
                src='https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png'
                width="150px"
              />
            </a>
          </div>
        </Col>
        <Col>
          <div class="text-center">
            <a
              href="https://apps.apple.com/us/app/deej-a-i/id1529860910?mt=8"
              target="_blank"
              rel="noopener noreferrer"
            ><img
              alt='Get it on iTunes'
              src="https://linkmaker.itunes.apple.com/en-us/badge-lrg.svg?releaseDate=2020-09-01&kind=iossoftware&bubble=apple_music) no-repeat;width:135px;height:40px;">
              </img>
            </a>
          </div>
        </Col>
      </Row>
    </>
  );
}