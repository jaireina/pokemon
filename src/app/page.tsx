"use client";
import Image from "next/image";
import { useState } from "react";
import { useEffect } from "react";
import type { IPokemonInfo } from "@/types/types";
interface IPokemonList {
  name: string;
  url: string;
}

export default function Home() {
  const [pokemon, setPokemon] = useState<IPokemonInfo>();
  const [pokemons, setPokemons] = useState<IPokemonList[]>([]);
  const [visiblePokemons, setVisiblePokemons] = useState<IPokemonList[]>([]);

  const search = (q: string) => {
    setVisiblePokemons(pokemons.filter((pokemon) => pokemon.name.includes(q)));
  };

  const getPokemonInfo = async (pokemon: IPokemonList) => {
    const { name, url } = pokemon;
    const localPokemon = window.localStorage.getItem(name);
    let pokemonData;
    if (localPokemon) {
      pokemonData = JSON.parse(localPokemon);
    } else {
      let data = await fetch(url);
      pokemonData = await data.json();
      if (pokemon)
        window.localStorage.setItem(name, JSON.stringify(pokemonData));
    }
    setPokemon(pokemonData);
  };

  const showRandomPokemon = () => {
    const randomPokemon = pokemons[Math.floor(Math.random() * pokemons.length)];
    getPokemonInfo(randomPokemon);
  };

  useEffect(() => {
    async function fetchData() {
      const localPokemons = window.localStorage.getItem("localPokemons");
      let pokemons;
      if (localPokemons) {
        pokemons = JSON.parse(localPokemons);
      } else {
        let data = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=1400&offset=0"
        );
        pokemons = await data.json();
        if (pokemons)
          window.localStorage.setItem(
            "localPokemons",
            JSON.stringify(pokemons)
          );
      }
      setPokemons(pokemons.results);
      setVisiblePokemons(pokemons.results);
    }
    fetchData();
  }, []);
  if (!pokemons) return <div>Loading...</div>;

  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <nav className="w-full">
        <input
          type="text"
          placeholder="Search"
          className="p-2 text-black"
          onChange={(e) => search(e.target.value)}
        />
        <div className="overflow-x-auto w-full">
          <div className="flex flex-row flex-nowrap gap-8 row-start-2 items-start sm:items-start h-14 mt-4">
            {visiblePokemons?.map((pokemon: IPokemonList) => (
              <div
                key={pokemon.name}
                className="flex items-center gap-4 text-xl "
              >
                <button
                  className="underline"
                  onClick={() => getPokemonInfo(pokemon)}
                >
                  {pokemon.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </nav>
      <main className="w-full mx-auto">
        <div className="w-full flex align-center justify-center">
          <button
            className="text-4xl font-bold bg-white text-black py-2 px-4 rounded-md my-10"
            onClick={showRandomPokemon}
          >
            MAGIC BUTTON!
          </button>
        </div>
        {pokemon && (
          <div className="w-full grid grid-cols-6">
            <img
              src={pokemon?.sprites?.other["official-artwork"].front_default}
              className="w-full col-start-2 col-span-3"
            />
            <div className="text-2xl pt-10">
              <dl>
                <dt className="font-extrabold">Name</dt>
                <dd>{pokemon.name}</dd>
                <dt className="font-extrabold mt-4">Height</dt>
                <dd>{pokemon.height * 0.1} m</dd>
                <dt className="font-extrabold mt-4">Weight</dt>
                <dd>{pokemon.weight * 0.1} kg</dd>
                <dt className="font-extrabold mt-4">Showdown</dt>
                <dd>
                  <img src={pokemon?.sprites?.other.showdown.front_default} />
                </dd>
              </dl>
            </div>
          </div>
        )}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={40}
            height={40}
          />
          Examples
        </a>
      </footer>
    </div>
  );
}
