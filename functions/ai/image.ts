"use server";

import { ImgurClient } from "imgur"
import Replicate from "replicate";
import { HfInference } from "@huggingface/inference";
import { ImageModelId } from "@/lib/ai";
import { Character } from "@/types/db";


interface GenerateImageProps {
    hfToken?: string | undefined;
    replicateToken?: string | undefined;
    inputs: string;
    prefix?: string;
}

type ReplicateOutput = string[];

export async function generateImage(props: GenerateImageProps): Promise<string> {
    if(props.replicateToken) {
        const replicate = new Replicate({
            auth: props.replicateToken
        });
        const output = await replicate.run(
            "black-forest-labs/flux-schnell", 
            { 
                input: {
                    prompt: props.prefix + props.inputs, 
                    disable_safety_checker: true,
                    output_format: "jpg",
                    go_fast: true,
                    aspect_ratio: "4:5"
                } 
            }
        );

        const repOutput: ReplicateOutput = output as ReplicateOutput;

        return repOutput[0];
    } else {

        if(!props.hfToken) {
            throw new Error("No hf token provided");
        }

        const hf = new HfInference(props.hfToken);
        const model: ImageModelId = "black-forest-labs/FLUX.1-schnell";

        const blob = await hf.textToImage({
            model: model,
            inputs: props.inputs,
            parameters: {
                height: 512,
                width: 512,
            }
        }).catch((e) => {
            throw new Error(e);
        })

        if(!blob) {
            throw new Error("Error generating image");
        }

        const base64 =  (await blob.arrayBuffer().then((buffer) => Buffer.from(buffer).toString("base64")));

        const link = await uploadImageToImgur(base64);

        return link;
    }

}

interface GenerateImageOfCharacterProps extends GenerateImageProps {
    character: Character;
}

export async function generateImageOfCharacter(props: GenerateImageOfCharacterProps): Promise<string> {
    const replicate = new Replicate({
        auth: props.replicateToken
    });
    const output = await replicate.run(
        "zsxkib/pulid:43d309c37ab4e62361e5e29b8e9e867fb2dcbcec77ae91206a8d95ac5dd451a0", 
        { 
            input: {
                prompt: props.prefix + props.inputs + " img", 
                main_face_image: props.character.image_link,
                disable_safety_checker: true,
                negative_prompt: "lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry",
                output_format: "jpg",

            } 
        }
    );

    const repOutput: ReplicateOutput = output as ReplicateOutput;

    return repOutput[0];
}

export async function uploadImageToImgur(base64: string): Promise<string> {
    const imgur = new ImgurClient({ 
        clientId: process.env.IMGUR_CLIENT_ID,
        clientSecret: process.env.IMGUR_CLIENT_SECRET
    });

    const imgurResponse = await imgur.upload({
        image: base64,
        type: "base64"
    }).catch((e) => {
        throw new Error(e);
    });

    return imgurResponse.data.link
}