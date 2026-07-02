import { FiHeart, FiMessageCircle, FiCheckCircle } from "react-icons/fi";
import { NOTIFICATION_TYPE } from "./notificationType";

const LIKE_STYLE = {
  bg: "bg-pink-50",
  border: "border-pink-200",
  icon: FiHeart,
  iconColor: "text-pink-500",
};

const COMMENT_STYLE = {
  bg: "bg-sky-50",
  border: "border-sky-200",
  icon: FiMessageCircle,
  iconColor: "text-sky-500",
};

const ACCEPT_STYLE = {
  bg: "bg-violet-50",
  border: "border-violet-200",
  icon: FiCheckCircle,
  iconColor: "text-violet-500",
};

export const NOTIFICATION_STYLE = {
  [NOTIFICATION_TYPE.QUESTION_LIKED]: LIKE_STYLE,
  [NOTIFICATION_TYPE.ANSWER_LIKED]: LIKE_STYLE,
  [NOTIFICATION_TYPE.COMMENT_LIKED]: LIKE_STYLE,

  [NOTIFICATION_TYPE.QUESTION_ANSWER_CREATED]: COMMENT_STYLE,
  [NOTIFICATION_TYPE.QUESTION_COMMENT_CREATED]: COMMENT_STYLE,
  [NOTIFICATION_TYPE.ANSWER_COMMENT_CREATED]: COMMENT_STYLE,

  [NOTIFICATION_TYPE.ANSWER_ACCEPTED]: ACCEPT_STYLE,
};