import { useQuery } from "react-query";
import { IGetMovieVideo } from "../api";
import { getTvVideo } from "../api";
import styled from "styled-components";

const Video = styled.iframe`
  position: relative;
  margin-top: -70px;
  margin-bottom: 10px;
  width: 560px;
  height: 315px;
  z-index: 0;
`;

function LoadingTest({
  id,
  index,
  setIndex,
}: {
  id: number;
  index: number;
  setIndex: Function;
}) {
  const { data: videoData, isLoading: videoLoading } = useQuery<IGetMovieVideo>(
    ["tv", id],
    () => getTvVideo(id)
  );
  console.log(videoData);
  if (videoData?.results === undefined) {
    setIndex((prev: number) => prev + 1);
  }

  return (
    <Video
      src={`https://www.youtube.com/embed/${videoData?.results[index].key}?autoplay=1&mute=1`}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></Video>
  );
}

export default LoadingTest;
