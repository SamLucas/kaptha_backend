function Normalization() {

  function _changeValueMinMax(
    data: { min: number, max: number },
    value: number
  ) {
    const { max, min } = data
    return {
      min: Math.min(...[min, value]),
      max: Math.max(...[max, value]),
    };
  }

  function _calcNormalization(
    x: number,
    data: { min: number, max: number }
  ) {
    const { min, max } = data

    const partUp = x - min
    const partDown = max - min
    const result = partUp / partDown

    return result
  }

  const _changedToPrecision = (x: Number, numberCase: number) =>
    parseFloat(x.toPrecision(numberCase))

  return {
    _changeValueMinMax,
    _calcNormalization,
    _changedToPrecision
  }

}

export default Normalization()