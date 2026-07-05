import { FiInfo } from "react-icons/fi";
import useAnswerList from "../hooks/useAnswerList";
import useMemberId from "../../question/hooks/useMemberId";
import AnswerItem from "./AnswerItem";
import AnswerForm from "./AnswerForm";

const AnswerList = ({ questionId, questionMemberId }) => {
  const { answers, loading, error, refetch } = useAnswerList(questionId);
  const memberId = useMemberId();

  if (loading)
    return (
      <p className="py-6 text-center text-sm text-text-muted">불러오는 중...</p>
    );
  if (error)
    return <p className="py-6 text-center text-sm text-red-500">{error}</p>;

  const hasAcceptedAnswer = answers.some((a) => a.accepted);
  const isQuestionAuthor = questionMemberId
    ? String(memberId) === String(questionMemberId)
    : false;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xl font-black text-text">
          답변 <span className="text-primary">{answers.length}</span>
        </p>
        {isQuestionAuthor && !hasAcceptedAnswer && answers.length > 0 && (
          <span className="flex items-center gap-1.5 text-sm font-bold text-primary">
            <FiInfo size={14} />
            마음에 드는 답변을 채택해 보세요
          </span>
        )}
      </div>

      {answers.length === 0 ? (
        <p className="py-6 text-center text-sm text-text-muted">
          아직 답변이 없습니다. 첫 번째 답변을 남겨보세요!
        </p>
      ) : (
        answers.map((answer) => (
          <AnswerItem
            key={answer.id}
            answer={answer}
            onSuccess={refetch}
            questionMemberId={questionMemberId}
            hasAcceptedAnswer={hasAcceptedAnswer}
          />
        ))
      )}

      {!hasAcceptedAnswer && (
        <AnswerForm questionId={questionId} onSuccess={refetch} />
      )}
    </div>
  );
};

export default AnswerList;
