export const matrixPositionToIndex = ({
  pos,
  matrixSize,
}: {
  pos: string;
  matrixSize: Number[];
}) => {
  const indexes = pos.split(",");
  const matrixWidth = Number(matrixSize[1]);
  return Number(indexes[0]) * matrixWidth + Number(indexes[1]);
};
