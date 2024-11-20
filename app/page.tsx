"use server";

import CharacterCard from "@/components/character/CharacterCard";
import { getCharacters } from "@/functions/db/character";
import { Character } from "@/types/db";
import { redirect } from "next/navigation";

import { getStories } from "@/functions/db/stories";
import StoryCard from "@/components/story/StoryCard";
import Searchbar from "@/components/Searchbar";
import CategoryScroller from "@/components/CategoryScroller";
import { getCategories } from "@/functions/db/categories";
import InfiniteSwiperLoader from "@/components/InfiniteSwiperLoder";
import { CurrentCategoryProvider } from "@/context/CurrentCategoryProvider";
import Spotlight from "@/components/Spotlight";

export default async function Home() {

  let characters: Character[] = [];
  const stories = await getStories(0, 5);
  const categories = await getCategories(0, 5);

  try {
    characters = await getCharacters(0, 5);
  } catch (error) {
    console.error(error);
    redirect("/error");
  }

  return (
    <div className="flex justify-center max-2xl:block max-h-full w-full overflow-y-auto pb-20">
      <div className="flex flex-col gap-4 px-4 py-6 h-fit max-w-[1300px]">

        <Searchbar />

        <Spotlight character={characters[0]} />

        <div className="flex flex-col gap-2 w-full relative">
          <h2 className="dark:prose-invert text-lg font-bold">Popular</h2>
          <InfiniteSwiperLoader 
            loadMore={getCharacters} 
            limit={5} 
            initialData={characters} 
            component={CharacterCard}
            componentProps={{
              hasLink: true,
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="dark:prose-invert text-lg font-bold">Stories</h2>
          <InfiniteSwiperLoader 
            loadMore={getStories}
            limit={5}
            initialData={stories}
            component={StoryCard}
            componentProps={{
              hasLink: true,
            }}
          />
        </div>

        <div className="flex flex-col gap-2 w-full relative">
          <h2 className="dark:prose-invert text-lg font-bold">Popular</h2>
          <InfiniteSwiperLoader 
            loadMore={getCharacters} 
            limit={5} 
            initialData={characters} 
            component={CharacterCard}
            componentProps={{
              hasLink: true,
            }}
          />
        </div>

        <CurrentCategoryProvider>
          <CategoryScroller categories={categories} />
        </CurrentCategoryProvider>

      </div>
    </div>
  );
}
