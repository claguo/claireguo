import React from "react";
import PropTypes from "prop-types";

function Button({ variant = "default", onClick, className, children }) {
  const getClasses = () => {
    if (variant === "ghost") {
      return `flex items-center gap-3xs font-mono px-xs py-3xs ${
        className || ""
      }`;
    } else if (variant === "inline") {
      return `inline-block cursor-pointer font-mono hover:text-pink ${
        className || ""
      }`;
    } else {
      return `bg-text-blooms text-white flex items-center gap-3xs font-mono px-xs py-3xs hover:bg-text-blooms/90 rounded-sm ${
        className || ""
      }`;
    }
  };

  return (
    <button type="button" onClick={onClick} className={getClasses()}>
      {children}
    </button>
  );
}

//   if (variant === "inline") {
//     if (url) {
//       return (
//         <a
//           href={url}
//           target="_blank"
//           rel="noopener noreferrer"
//           onMouseEnter={() => setIsHovered(true)}
//           onMouseLeave={() => setIsHovered(false)}
//           onClick={onClick}
//           className={`inline-block cursor-pointer font-mono ${
//             isHovered ? "text-pink" : "italic"
//           } ${className}`}
//         >
//           {renderContent()}
//         </a>
//       );
//     }

//     if (to) {
//       return (
//         <Link
//           to={to}
//           onMouseEnter={() => setIsHovered(true)}
//           onMouseLeave={() => setIsHovered(false)}
//           onClick={onClick}
//           className={`inline-block cursor-pointer font-mono ${
//             isHovered ? "text-pink" : "italic"
//           } ${className}`}
//         >
//           {renderContent()}
//         </Link>
//       );
//     }
//   } else {
//     if (url) {
//       return (
//         <a
//           href={url}
//           target="_blank"
//           rel="noopener noreferrer"
//           onMouseEnter={() => setIsHovered(true)}
//           onMouseLeave={() => setIsHovered(false)}
//           onClick={onClick}
//           className={`flex items-center gap-3xs cursor-pointer font-mono tracking-normal px-xs py-3xs hover:italic hover:text-pink ${className}`}
//         >
//           {renderContent()}
//         </a>
//       );
//     }

//     if (to) {
//       return (
//         <Link
//           to={to}
//           onMouseEnter={() => setIsHovered(true)}
//           onMouseLeave={() => setIsHovered(false)}
//           onClick={onClick}
//           className={`flex items-center gap-3xs cursor-pointer font-mono tracking-normal px-xs py-3xs hover:italic hover:text-pink ${className}`}
//         >
//           {renderContent()}
//         </Link>
//       );
//     } else {
//       return (
//         <button
//           type="button"
//           onMouseEnter={() => setIsHovered(true)}
//           onMouseLeave={() => setIsHovered(false)}
//           onClick={onClick}
//           className={`flex items-center gap-3xs cursor-pointer font-mono tracking-normal px-xs py-3xs hover:italic hover:text-pink ${className}`}
//           aria-label={text || "Button"}
//         >
//           {renderContent()}
//         </button>
//       );
//     }
//   }

Button.propTypes = {
  variant: PropTypes.oneOf(["default", "ghost", "inline"]),
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Button;
