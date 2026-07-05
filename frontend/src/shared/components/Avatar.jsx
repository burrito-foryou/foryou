// 프로필 이미지가 있으면 이미지를, 없으면 이름 첫 글자로 된 원형 아바타를 보여준다.
const Avatar = ({
  src,
  name,
  size = 40,
  textSize = "text-base",
  bordered = false,
  className = "",
  children,
}) => {
  const dimension = { width: size, height: size };

  if (src) {
    return (
      <img
        src={src}
        alt=""
        style={dimension}
        className={`shrink-0 rounded-full object-cover ${bordered ? "border border-border" : ""} ${className}`}
      />
    );
  }

  return (
    <span
      style={dimension}
      className={`flex shrink-0 items-center justify-center rounded-full bg-background-avatar font-black text-text-primary ${textSize} ${className}`}
    >
      {children ?? name?.charAt(0)?.toUpperCase()}
    </span>
  );
};

export default Avatar;
