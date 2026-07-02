import useAnswerList from "../hooks/useAnswerList";
import AnswerItem from "./AnswerItem";
import AnswerForm from "./AnswerForm";

const AnswerList = ({ questionId }) => {
  const { answers, loading, error, refetch } = useAnswerList(questionId);

  if (loading) return <p className="py-6 text-center text-sm text-text-muted">불러오는 중...</p>;
  if (error) return <p className="py-6 text-center text-sm text-red-500">{error}</p>;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-bold text-text">
        답변 <span className="text-primary">{answers.length}</span>
      </p>

      {answers.length === 0 ? (
        <p className="py-6 text-center text-sm text-text-muted">
          아직 답변이 없습니다. 첫 번째 답변을 남겨보세요!
        </p>
      ) : (
        answers.map((answer) => (
          <AnswerItem key={answer.id} answer={answer} />
        ))
      )}

      <AnswerForm questionId={questionId} onSuccess={refetch} />
    </div>
  );
};

export default AnswerList;
