import { useMutation, useQuery } from "react-query";
import {
  getMovies,
  getPopularMovies,
  IGetMoviesResult,
  IGetPopularMoviesResult,
  getMovieVideo,
  IGetMovieVideo,
  getTvAiringToday,
  IGetTvAiringToday,
  getTvVideo,
} from "../api";
import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import styled from "styled-components";
import { makeImagePath } from "./utils";
import { useEffect, useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import AiringToday from "../Components/Tv/AiringToday";
import PopularTv from "../Components/Tv/PopularTv";
import TopRatedTv from "../Components/Tv/TopRatedTv";
import OnTheAirTv from "../Components/Tv/OnTheAirTv";
import { constSelector, useRecoilState } from "recoil";
import { boxOpenState } from "../atom";
import LoadingTest from "./LoadingTest";
import { json } from "stream/consumers";

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

const offset = 6;

function TV() {
  const history = useNavigate();
  const [index, setIndex] = useState(0);
  const { data, isLoading } = useQuery<IGetTvAiringToday>(
    ["tv", "airingToday"],
    async () => await getTvAiringToday()
  );
  const tvId = data?.results[index].id;

  const { data: tvData, isLoading: tvLoading } = useQuery<IGetMovieVideo>(
    ["movies", tvId],
    () => getMovieVideo(tvId)
  );
  console.log(tvData);
  const onBoxClicked = (tvId: number) => {
    history(`/tv/1/${tvId}`);
  };
  return (
    <>
      {isLoading ? (
        <>
          <Loader>Loading...</Loader>
        </>
      ) : (
        <>
          <Wrapper>
            <Banner
              bgphoto={makeImagePath(data?.results[index].backdrop_path || "")}
            >
              {tvData?.success === false ? null : tvData?.results.length ===
                0 ? null : (
                <Video
                  src={`https://www.youtube.com/embed/${tvData?.results[0].key}?autoplay=1&mute=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></Video>
              )}
              <Title>{data?.results[index].name}</Title>
              {tvId ? <Play onClick={() => onBoxClicked(tvId)}></Play> : null}
              {tvId ? (
                <DetailBtn onClick={() => onBoxClicked(tvId)}>
                  <span>상세정보</span>
                </DetailBtn>
              ) : (
                ""
              )}
            </Banner>
            )
            <AiringToday />
            <PopularTv />
            <TopRatedTv />
            <OnTheAirTv />
          </Wrapper>
        </>
      )}
    </>
  );
}

export default TV;
