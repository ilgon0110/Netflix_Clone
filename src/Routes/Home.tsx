import { useQuery } from "react-query";
import {
  getMovies,
  IGetMoviesResult,
  getMovieVideo,
  IGetMovieVideo,
} from "../api";
import { motion } from "framer-motion";
import styled from "styled-components";
import { makeImagePath } from "./utils";
import { useNavigate } from "react-router-dom";
import NowPlaying from "../Components/Movie/NowPlaying";
import PopularMovie from "../Components/Movie/PopularMovie";
import TopRatedMovie from "../Components/Movie/TopRatedMovie";
import UpComingMovie from "../Components/Movie/UpComingMovie";

const Wrapper = styled.div`
  overflow: hidden;
  height: 220vh;
`;
const Loader = styled.div`
  height: 20vh;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;
const Title = styled.h2`
  font-size: 36px;
  margin-bottom: 20px;
  font-weight: 400;
`;
const Play = styled(motion.div)`
  position: relative;
  width: 40px;
  height: 40px;
  background-image: url("${process.env.PUBLIC_URL}/img/play.png");
  background-size: cover;
  opacity: 0.8;
  &:hover {
    opacity: 1;
    transition: 0.3s ease-in-out;
    cursor: pointer;
  }
`;
const DetailBtn = styled.div`
  position: relative;
  width: 140px;
  height: 40px;
  background-color: #636363;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -40px;
  margin-left: 80px;
  font-weight: 600;
  &:hover {
    background-color: #9e9e9e;
    transition: 0.3s ease-in-out;
    cursor: pointer;
  }
`;
const Video = styled.iframe`
  margin-top: -70px;
  margin-bottom: 10px;
  width: 560px;
  height: 315px;
  z-index: 0;
`;

function Home() {
  const history = useNavigate();
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    async () => await getMovies()
  );
  const movieId = data?.results[0].id;

  const { data: videoData, isLoading: videoLoading } = useQuery<IGetMovieVideo>(
    ["movies", movieId],
    () => getMovieVideo(movieId)
  );
  const onBoxClicked = (movieId: number) => {
    history(`/movies/1/${movieId}`);
  };

  return (
    <>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Wrapper>
            <Banner
              bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}
            >
              {videoLoading && videoData?.results.length === 0 ? null : (
                <Video
                  src={`https://www.youtube.com/embed/${videoData?.results[0].key}?autoplay=1&mute=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></Video>
              )}
              <Title>{data?.results[0].title}</Title>
              {movieId ? (
                <Play onClick={() => onBoxClicked(movieId)}></Play>
              ) : null}
              {movieId ? (
                <DetailBtn onClick={() => onBoxClicked(movieId)}>
                  <span>상세정보</span>
                </DetailBtn>
              ) : (
                ""
              )}
            </Banner>
            <NowPlaying />
            <PopularMovie />
            <TopRatedMovie />
            <UpComingMovie />
          </Wrapper>
        </>
      )}
    </>
  );
}

export default Home;
