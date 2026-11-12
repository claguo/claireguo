import React from "react";

function Tag({ text, theme }) {
  const colors = {
    mochi: "bg-bg-mochi text-text-mochi border-border-mochi",
    a11y: "bg-bg-a11y text-text-a11y border-border-a11y",
    eto: "bg-bg-eto text-text-eto border-border-eto",
    blooms: "bg-bg-blooms text-text-blooms border-border-blooms",
    stardrift: "bg-bg-stardrift text-text-stardrift border-border-stardrift",
  };
  const themeColors = colors[theme] || "border-[#C0C0D8] text-[#63637A]";

  return (
    <div
      className={`font-mono text-sm rounded-full px-[6px] py-[1px] border-[1px] tracking-normal ${themeColors}`}
    >
      {text && text.toLowerCase()}
    </div>
  );
}

export default Tag;
