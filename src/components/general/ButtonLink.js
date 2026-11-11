import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function ButtonLink({
  variant = "default",
  to,
  text,
  icon,
  onClick,
  className,
  target,
}) {
  const getClasses = () => {
    if (variant === "ghost") {
      return `flex items-center gap-4xs lg:gap-3xs font-mono px-xs py-3xs hover:text-pink ${
        className || ""
      }`;
    } else if (variant === "inline") {
      return `inline-flex items-center gap-4xs lg:gap-3xs cursor-pointer font-mono tracking-tight hover:text-pink ${
        className || ""
      }`;
    } else {
      return `flex items-center gap-4xs lg:gap-3xs font-mono px-xs py-3xs rounded-sm bg-text-blooms hover:bg-text-blooms/90 text-white ${
        className || ""
      }`;
    }
  };

  return (
    <Link
      to={to}
      onClick={onClick}
      className={getClasses()}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
    >
      {text} {icon && icon}
    </Link>
  );
}

ButtonLink.propTypes = {
  variant: PropTypes.oneOf(["default", "ghost", "inline"]),
  to: PropTypes.string,
  text: PropTypes.string,
  icon: PropTypes.node,
  onClick: PropTypes.func,
  className: PropTypes.string,
  target: PropTypes.string,
};

export default ButtonLink;
