"use client";

import { Avatar } from "@nextui-org/avatar";
import { Tabs, Tab } from "@nextui-org/tabs";
import Link from "next/link";
import { Story } from "@/types/db";
import StoryCardSmall from "@/components/story/StoryCard";
import { Button } from "@/components/utils/Button";
import Icon from "@/components/utils/Icon";

import { Character } from "@/types/db";

type Props = {
    character: Character,
    stories: Story[]
}

export default function CharacterPage(props: Props) {

    return (
        <>
        <div className="flex flex-col items-center gap-4 pb-20 px-4 py-6">

            <div className="flex flex-row max-md:flex-col gap-6 items-center justify-center w-full">

                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2 items-center justify-center">
                        <Avatar src={props.character.image_link} className="w-20 h-20 text-large"/>
                        <h1 className="text-xl font-bold">{props.character.name}</h1>
                        <p className="text-sm dark:text-neutral-400">By @{props.character.owner.username}</p>
                    </div>
                    
                    <div className="prose dark:prose-invert prose-p:text-sm dark:prose-p:text-neutral-400">
                        <p>{props.character.description}</p>
                    </div>
                </div>

                <div className="flex flex-col w-full">
                    <Tabs variant="underlined"
                        classNames={{
                            cursor: "dark:bg-slate-400",
                        }}
                    >
                        <Tab key="about" title="About">
                            <div className="w-full flex justify-start items-start flex-col prose dark:prose-invert prose-p:text-sm dark:prose-p:text-zinc-400 prose-h3:mt-0">
                                <h2>About</h2>
                                <h3>Introduction</h3>
                                <p>{props.character.intro || "No Introduction"}</p>
                                <h3>Bio</h3>
                                <p>{props.character.bio}</p>
                            </div>
                        </Tab>
                        <Tab key="stories" title="Stories">
                            <div className="flex flex-row items-center justify-between ">
                                <h2 className="font-bold text-xl">Stories with {props.character.name}</h2>
                                <Link href={`/c/${props.character.id}/story/new`}>
                                    <Button variant="light" color="warning" isIconOnly>
                                        <Icon>add</Icon>
                                    </Button>
                                </Link>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                {props.stories.map((story: Story) => (
                                    <StoryCardSmall key={story.id} story={story} hasLink fullWidth />
                                ))}

                                {props.stories.length == 0 && <p className="text-sm dark:text-neutral-400">No stories found. Want to make the first?</p>}
                            
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
                        


        </div>
        </>
    )

}