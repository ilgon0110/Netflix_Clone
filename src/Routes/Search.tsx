import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import {
  getMovieSearch,
  getTvSearch,
  IGetMovieSearch,
  IGetTvSearch,
} from "../api";
import MovieSearch from "../Components/Search/MovieSearch";
import TvSearch from "../Components/Search/TvSearch";
import styled from "styled-components";

const NoResult = styled.div`
  margin-top: 300px;
`;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const { data, isLoading } = useQuery<IGetMovieSearch>(
    ["movieSearch", keyword],
    () => getMovieSearch(keyword)
  );

  const { data: tvData, isLoading: tvLoading } = useQuery<IGetTvSearch>(
    ["tvSearch", keyword],
    () => getTvSearch(keyword)
  );
  return (
    <>
      {isLoading ? null : data && data.results.length !== 0 ? (
        <MovieSearch data={data} keyword={keyword} />
      ) : (
        <NoResult>No Result of {keyword}</NoResult>
      )}
      {tvLoading ? null : tvData && tvData.results.length !== 0 ? (
        <TvSearch data={tvData} keyword={keyword} />
      ) : (
        <NoResult>No Result of {keyword}</NoResult>
      )}
    </>
  );
}

export default Search;
