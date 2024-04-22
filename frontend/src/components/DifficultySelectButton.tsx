import React from 'react';

type Prop = {
    selected: number;
    buttonNumber: number;
    setSelected: (n: number) => void;
    setDifficulty: () => void;
    difficulty: string;
}
function DifficultySelectButton(props: Prop) {
    function handleClick() {
        props.setDifficulty();
        props.setSelected(props.buttonNumber);
    }

    return (
        <button className={props.selected === props.buttonNumber?"bg-green-900 hover:bg-emerald-300 text-white font-bold py-2 px-4 border-b-4 border-green-600 hover:border-blue-500 rounded": "bg-green-900 hover:bg-emerald-300 text-white font-bold py-2 px-4 border-b-4 border-green-600 hover:border-blue-500 rounded"}
                onClick={handleClick}>{props.difficulty}
        </button>
    );
}

export default DifficultySelectButton;
