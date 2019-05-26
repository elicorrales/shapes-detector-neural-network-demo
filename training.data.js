
const training_data = [
    //AND
    {
        index: 0,
        inputs: [
            0, 0, 0,
            0, 1, 0,
            1, 0, 0,
            1, 1, 1,
        ],
        outputs: [1, 0, 0, 0],
    },

    //OR
    {
        index: 0,
        inputs: [
            0, 0, 0,
            0, 1, 1,
            1, 0, 1,
            1, 1, 1,
        ],
        outputs: [0, 1, 0, 0],
    },

    //NAND
    {
        index: 0,
        inputs: [
            0, 0, 1,
            0, 1, 1,
            1, 0, 1,
            1, 1, 0,
        ],
        outputs: [0, 0, 1, 0],
    },

    //XOR
    {
        index: 0,
        inputs: [
            0, 0, 0,
            0, 1, 1,
            1, 0, 1,
            1, 1, 0,
        ],
        outputs: [0, 0, 0, 1]
    },

];
