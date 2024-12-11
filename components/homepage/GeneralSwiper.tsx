"use server";

import { LoadMoreProps } from "@/types/client";
import InfiniteSwiperLoader from "../InfiniteSwiperLoder";
import { FC } from "react";

type Props = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loader: (props: LoadMoreProps) => Promise<any[]>;
    rows: number; 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: FC<any>
}

export default async function GeneralSwiper(props: Props) {
        
    const defaultLoad: LoadMoreProps = {
        cursor: 0,
        limit: 16,
    }

    let initialData = [];
    
    try {
        initialData = await props.loader(defaultLoad);
    } catch (e) {
        console.error(e);
        return (
            <>
            <h1>Something went wrong loading popular Characters</h1>
            </>
        )
    }

    return (
        <>
        <InfiniteSwiperLoader 
            loadMore={props.loader} 
            limit={15} 
            rows={props.rows}
            initialData={initialData} 
            component={props.component}
            componentProps={{
                hasLink: true,
            }}
        />
        </>
    )
}