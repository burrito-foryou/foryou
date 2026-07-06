import { FiHeart, FiMessageCircle, FiCheckCircle } from "react-icons/fi";
import { NOTIFICATION_TYPE } from "./notificationType";

const LIKE_STYLE = {
  icon: FiHeart,
  iconBg: "bg-pink-100",
  iconColor: "text-pink-500",
  cardBg: "bg-pink-50/60",
};

const COMMENT_STYLE = {
  icon: FiMessageCircle,
  iconBg: "bg-pink-100",
  iconColor: "text-pink-500",
  cardBg: "bg-pink-50/60",
};

const ACCEPT_STYLE = {
  icon: FiCheckCircle,
  iconBg: "bg-pink-100",
  iconColor: "text-pink-500",
  cardBg: "bg-pink-50/60",
};

export const DEFAULT_STYLE = {
  icon: FiHeart,
  iconBg: "bg-gray-100",
  iconColor: "text-gray-400",
  cardBg: "bg-white",
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