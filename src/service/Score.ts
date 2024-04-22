import {fetcher} from "./Fetcher.ts";

export type scoreEntry = {
    _id: string;
    username: string;
    score: number;
}

export function fetchScores() {
    return fetcher<scoreEntry[]>("GET", "/", null);
}

export function addScore(body: any) {
    return fetcher<any>("POST", "/add", body)
}
