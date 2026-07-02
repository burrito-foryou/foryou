export const buildTargetLink = ({ questionId, targetType, targetId }) => {
  return `/questions/${questionId}?targetType=${targetType}&targetId=${targetId}`;
};
