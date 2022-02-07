import { useQuery } from "react-query";
import {
  getMovieDetail,
  getTvDetail,
  IGetMovieDetail,
  IGetTvDetail,
} from "../../api";
import styled from "styled-components";
import { makeImagePath } from "../../Routes/utils";

const Genre = styled.span`
  color: ${(props) => props.theme.white.lighter};
  padding: 12px;
  font-size: 20px;
  font-weight: 600;
`;
const RunTime = styled.span`
  color: ${(props) => props.theme.white.lighter};
  padding: 12px;
  font-size: 20px;
  font-weight: 600;
`;
const HomePage = styled.a`
  position: relative;
  top: 0;
  right: 10;
  font-size: 24px;
`;
const OverView = styled.p`
  font-size: 20px;
  padding: 16px;
`;
const GridTest = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-items: center;
`;
const PreView = styled.h1`
  font-size: 20px;
  padding-left: 40px;
  padding-top: 16px;
  padding-bottom: 16px;
`;
const Videos = styled.iframe`
  width: fit-content;
  margin-bottom: 16px;
`;
const Logo = styled.div<{ logo: string }>`
  float: left;
  width: 150px;
  height: 50px;
  margin-top: 40px;
  margin-left: 40px;
  margin-bottom: 80px;
  background-image: url(${(props) => props.logo});
  background-repeat: no-repeat;
  background-size: contain;
`;

function Detail({ id }: { id: any }) {
  const tvId = parseInt(id);
  const { data, isLoading } = useQuery<IGetTvDetail>(["moviesDetail", id], () =>
    getTvDetail(tvId)
  );
  return (
    <>
      {isLoading ? (
        "Loading..."
      ) : (
        <>
          <Genre>
            {data?.genres.map((a, index) =>
              index === data.genres.length - 1 ? a.name : `${a.name} / `
            )}
          </Genre>
          <RunTime>{`${
            data ? Math.floor(data.episode_run_time[0] / 60) : ""
          }시간 ${data ? data.episode_run_time[0] % 60 : ""}분`}</RunTime>
          <HomePage href={data?.homepage} target="_blank">
            <span role="img" aria-label="homepage">
              🖥️
            </span>
          </HomePage>
          <OverView>{data?.overview}</OverView>
          <hr />
          <PreView>예고편</PreView>
          <GridTest>
            {data?.videos.results.map((src) => (
              <Videos
                key={src.id}
                src={`https://www.youtube.com/embed/${src.key}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></Videos>
            ))}
          </GridTest>
          <>
            {data?.production_companies.map((a) => (
              <>
                {a.logo_path ? (
                  <Logo
                    key={a.id}
                    logo={`${makeImagePath(a.logo_path)}`}
                  ></Logo>
                ) : null}
              </>
            ))}
          </>
        </>
      )}
    </>
  );
}

export default Detail;
