const getRandomWeighted = (listWithWeights) => {
  const tags = listWithWeights.map((segment) => segment.tag);
  const weights = listWithWeights.map((segment) => segment.weight);

  const totalWeights = eval(weights.join("+"));

  const weightedList = new Array();
  let currentIteration = 0;

  while (currentIteration < tags.length) {
    for (let i = 0; i < weights[currentIteration]; i++) {
      weightedList[weightedList.length] = tags[currentIteration];
    }
    currentIteration++;
  }
  const randomNumber = Math.floor(Math.random() * totalWeights);
  return weightedList[randomNumber];
};

module.exports = {
  getRandomWeighted,
};
