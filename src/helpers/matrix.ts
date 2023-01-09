export const matrixPositionToIndex = ({pos, matrixSize}) => {
    const indexes = pos.split(',')
    const matrixWidth = matrixSize[1]
    const keyIndex = Number(indexes[0]) * matrixWidth + Number(indexes[1])
    return keyIndex
}