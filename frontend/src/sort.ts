import {score} from "common/src/types";

function sort(smaller: (a:score, b:score) => boolean, scoreArray: score[]): score[] {
    let tempScores: score[] = scoreArray;
    for (let x = 0; x < tempScores.length; x++) {
        for (let i = 1; i < tempScores.length - x; i++) {
            if (smaller(tempScores[i-1], tempScores[i])) {
                const temp = tempScores[i-1];
                tempScores[i-1] = tempScores[i];
                tempScores[i] = temp;
            }
        }
    }
    return tempScores
}

export default sort;