
const logicGatesTrainingData = [
    //AND
    {
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
        inputs: [
            0, 0, 0,
            0, 1, 1,
            1, 0, 1,
            1, 1, 0,
        ],
        outputs: [0, 0, 0, 1]
    },

];
