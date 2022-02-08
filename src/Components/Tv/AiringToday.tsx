import { useQuery } from "react-query";
import { getTvAiringToday, IGetTvAiringToday } from "../../api";
import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import styled from "styled-components";
import { makeImagePath } from "../../Routes/utils";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import DetailTv from "./DetailTv";

const offset = 6;
const Wrapper = styled.div``;
const Title = styled.span`
  position: relative;
  top: -120px;
  padding-left: 60px;
  font-size: 20px;
  font-weight: 600;
`;
const Slider = styled.div`
  position: relative;
`;
const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  margin-bottom: 10px;
  padding: 0px 60px;
  position: absolute;
  width: 100%;
  top: -100px;
`;
const Box = styled(motion.div)<{ bgphoto: string }>`
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  border-radius: 3px;
  height: 150px;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    font-size: 14px;
    text-align: center;
  }
`;
const Vote = styled.span`
  font-size: 10px;
  padding-left: 20px;
`;
const OpenDate = styled.span`
  position: relative;
  font-size: 10px;
  padding-left: 25%;
`;
const RArrow = styled(motion.svg)`
  position: absolute;
  width: 40px;
  height: 50px;
  z-index: 5;
  top: -50px;
  right: 5px;
`;
const LArrow = styled(motion.svg)`
  position: absolute;
  width: 40px;
  height: 50px;
  z-index: 5;
  top: -50px;
  left: 5px;
`;
export const BigMovie = styled(motion.div)`
  position: absolute;
  width: 50vw;
  height: max-content;
  background-color: ${(props) => props.theme.black.lighter};
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  z-index: 98;
`;
export const BigCover = styled.div<{ bgPhoto: string }>`
  width: 100%;
  background-size: cover;
  background-position: center center;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  height: 400px;
`;
export const BigTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  text-align: center;
  font-size: 20px;
  position: relative;
  top: -60px;
  padding: 20px;
  margin-bottom: -50px;
`;
export const BigRate = styled.span`
  color: yellow;
  padding-left: 16px;
  font-size: 20px;
  font-weight: 600;
`;
export const BigDay = styled.span`
  color: ${(props) => props.theme.white.lighter};
  padding-left: 12px;
  font-size: 20px;
  font-weight: 600;
`;
export const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 1;
`;
const rowVariants = {
  hidden: (back: boolean) => {
    return {
      x: back ? -window.outerWidth - 5 : window.outerWidth + 5,
    };
  },
  visible: {
    x: 0,
  },
  exit: (back: boolean) => {
    return {
      x: back ? window.outerWidth + 5 : -window.outerWidth - 5,
    };
  },
};
const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.4,
    y: -50,
    transition: {
      delay: 0.3,
      duration: 0.5,
      type: "tween",
    },
  },
};
const infoVariants = {
  hover: {
    opacity: 0.8,
  },
};

function AiringToday() {
  const { data } = useQuery<IGetTvAiringToday>(
    ["tv", "airingToday"],
    getTvAiringToday
  );
  const history = useNavigate();
  const onOverlayClick = () => {
    history("/tv");
  };
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving1 = () => setLeaving((prev) => !prev);
  const [back, setBack] = useState(false);
  const [index, setIndex] = useState(0);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      setLeaving(true);
      setBack(false);
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      setLeaving(true);
      setBack(true);
      const totalMovies = data?.results.length - 1;
      const minIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? (prev = minIndex) : prev - 1));
    }
  };

  const onBoxClicked = (tvId: number) => {
    history(`/tv/1/${tvId}`);
  };
  const bigMovieMatch = useMatch("tv/1/:tvId");
  const tvId = bigMovieMatch?.params.tvId;
  const { scrollY } = useViewportScroll();
  const clickedMovie =
    bigMovieMatch?.params.tvId &&
    data?.results.find(
      (movie) => String(movie.id) === bigMovieMatch.params.tvId
    );
  return (
    <Wrapper>
      <Title>Airing Today</Title>
      <Slider>
        <RArrow
          onClick={increaseIndex}
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
          role="img"
          viewBox="0 0 256 512"
        >
          <motion.path
            fill="currentColor"
            d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"
          />
        </RArrow>
        <LArrow
          onClick={decreaseIndex}
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
          role="img"
          viewBox="0 0 256 512"
        >
          <motion.path
            fill="currentColor"
            d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z"
          />
        </LArrow>
        <AnimatePresence
          custom={back}
          initial={false}
          onExitComplete={toggleLeaving1}
        >
          <Row
            custom={back}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            key={index}
            transition={{ type: "tween", duration: 1 }}
          >
            {data?.results
              .slice(1)
              .slice(offset * index, offset * index + offset)
              .map((movie) => (
                <Box
                  layoutId={movie.id.toString() + "1"}
                  variants={boxVariants}
                  whileHover="hover"
                  initial="normal"
                  transition={{ type: "tween" }}
                  key={movie.id}
                  bgphoto={makeImagePath(movie.poster_path || "")}
                  onClick={() => onBoxClicked(movie.id)}
                >
                  <Info variants={infoVariants}>
                    <h4>{movie.name}</h4>
                    <OpenDate>{`${movie.first_air_date}`}</OpenDate>
                    <Vote>⭐{movie.vote_average}</Vote>
                  </Info>
                </Box>
              ))}
          </Row>
        </AnimatePresence>
      </Slider>
      <AnimatePresence>
        {bigMovieMatch ? (
          <>
            <Overlay
              onClick={onOverlayClick}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <BigMovie
              style={{ top: scrollY.get() + 70 }}
              layoutId={bigMovieMatch?.params.tvId + "1"}
            >
              {clickedMovie && (
                <>
                  <BigCover
                    bgPhoto={makeImagePath(
                      clickedMovie.backdrop_path
                        ? clickedMovie.backdrop_path
                        : clickedMovie.poster_path
                    )}
                  />
                  <BigTitle>{clickedMovie.name}</BigTitle>
                  <BigRate>{clickedMovie.vote_average}</BigRate>
                  <BigDay>{`${clickedMovie.first_air_date.slice(
                    0,
                    4
                  )}년`}</BigDay>
                  <DetailTv id={tvId} />
                </>
              )}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </Wrapper>
  );
}

export default AiringToday;
