import { useEffect, useState } from "react";
import "./App.css";
import { getAllCountries } from "./api/countries";
import { AxiosError } from "axios";
import styled from "styled-components";

interface Country {
  name: { common: string };
  capital: string;
  flags: { png: string };
  like: boolean;
}

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);

  const fetchData = async (): Promise<void> => {
    try {
      const response = await getAllCountries();
      const countriesLike = response.data.map((country: Country) => ({
        ...country,
        flags: country.flags,
        like: false,
      }));
      setCountries(countriesLike);
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err);
      } else {
        console.log(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleLike = (name: string) => {
    setCountries((prevCountries) =>
      prevCountries.map((country) =>
        country.name.common === name
          ? { ...country, like: !country.like }
          : country
      )
    );
  };

  if (isLoading) {
    return <div>로딩중</div>;
  }

  if (error) {
    console.log(error);
    return <div>에러발생{error.message}</div>;
  }

  return (
    <>
      <Text>Favorite Countries</Text>
      <CardBox>
        {countries
          .filter((country) => country.like)
          .map((country: Country) => (
            <CountryCard
              key={country.name.common}
              onClick={() => toggleLike(country.name.common)}
            >
              <ImgBox>
                <Img
                  src={country.flags.png}
                  alt={`Flag of ${country.name.common}`}
                />
              </ImgBox>
              <TextBox>
                <Name>{country.name.common}</Name>
                <Capital>{country.capital}</Capital>
              </TextBox>
            </CountryCard>
          ))}
      </CardBox>
      <Text>Countries</Text>
      <CardBox>
        {countries
          .filter((country) => !country.like)
          .map((country) => (
            <CountryCard
              key={country.name.common}
              onClick={() => toggleLike(country.name.common)}
            >
              <ImgBox>
                <Img
                  src={country.flags.png}
                  alt={`Flag of ${country.name.common}`}
                />
              </ImgBox>
              <TextBox>
                <Name>{country.name.common}</Name>
                <Capital>{country.capital}</Capital>
              </TextBox>
            </CountryCard>
          ))}
      </CardBox>
    </>
  );
}

const CardBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const Text = styled.p`
  font-size: 50px;
  font-weight: bold;
`;

const ImgBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Img = styled.img`
  height: 100px;
`;

const CountryCard = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  height: 100%;
  width: 250px;
  margin: 50px;
  box-shadow: 3px 3px 10px;
`;

const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Name = styled.p`
  font-size: 20px;
  font-weight: bold;
  margin: 10px 0;
`;

const Capital = styled.p`
  margin: 0;
`;

export default App;
