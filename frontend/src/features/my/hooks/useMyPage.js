import { useEffect, useState } from "react";
import {
  getMyAnswers,
  getMyBookmarks,
  getMyComments,
  getMyInfo,
  getMyQuestions,
} from "../api/myApi";

const useMyPage = () => {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("question");

  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);

  const [answers, setAnswers] = useState([]);
  const [answersLoading, setAnswersLoading] = useState(true);

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);

  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(true);

  useEffect(() => {
    getMyInfo()
      .then(setMember)
      .finally(() => setLoading(false));

    getMyQuestions()
      .then(setQuestions)
      .finally(() => setQuestionsLoading(false));

    getMyAnswers()
      .then(setAnswers)
      .finally(() => setAnswersLoading(false));

    getMyComments()
      .then(setComments)
      .finally(() => setCommentsLoading(false));

    getMyBookmarks()
      .then(setBookmarks)
      .finally(() => setBookmarksLoading(false));
  }, []);

  const tabItems = { question: questions, answer: answers, comment: comments, bookmark: bookmarks };
  const tabLoading = { question: questionsLoading, answer: answersLoading, comment: commentsLoading, bookmark: bookmarksLoading };

  return {
    member,
    loading,
    activeTab,
    setActiveTab,
    items: tabItems[activeTab],
    isLoading: tabLoading[activeTab],
  };
};

export default useMyPage;
