import { useEffect } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { resourceLimits } from "worker_threads";
import {
  getMovieSearch,
  getTvSearch,
  IGetMovieSearch,
  IGetTvSearch,
} from "../api";
import MovieSearch from "../Components/Search/MovieSearch";
import TvSearch from "../Components/Search/TvSearch";

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const { data, isLoading } = useQuery<IGetMovieSearch>(
    ["movieSearch", keyword],
    () => getMovieSearch(keyword)
  );
  console.log(data);
  const { data: tvData, isLoading: tvLoading } = useQuery<IGetTvSearch>(
    ["tvSearch", keyword],
    () => getTvSearch(keyword)
  );
  console.log(tvData);
  return (
    <>
      {isLoading ? null : data ? <MovieSearch data={data} /> : null}
      {tvLoading ? null : tvData ? <TvSearch data={tvData} /> : null}
    </>
  );
}

export default Search;
